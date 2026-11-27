import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ApiProblemError, NetworkError } from '../../api/errors';
import type { IngredientsService } from '../../api/ingredientsService';
import { createMockIngredientsService, type MockIngredientsService } from '../../api/mock/mockIngredientsService';
import { sampleIngredients } from '../../api/mock/sampleScreens';
import type { Ingredient, IngredientCreate } from '../../api/types';
import { InventoryPage } from './InventoryPage';
import { NewIngredientDialog } from './NewIngredientDialog';

// The form talks to an IngredientsService. These tests use the in-memory mock or a hand-made fake;
// no request reaches an API, so they say nothing about the real API or its validation.

const BULGUR: Ingredient = {
  id: '00000000-0000-4000-8000-000000000599',
  name: 'Bulgur',
  unit: 'g',
  lowStockThreshold: 2000,
  active: true,
  createdAt: '2026-11-25T10:00:00.000Z',
  updatedAt: '2026-11-25T10:00:00.000Z',
};

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** A service whose answers the test controls. */
function controlledService() {
  const pending: Array<Deferred<Ingredient>> = [];
  const calls: IngredientCreate[] = [];
  const service: IngredientsService = {
    createIngredient: (input) => {
      calls.push(input);
      const next = deferred<Ingredient>();
      pending.push(next);
      return next.promise;
    },
  };
  return { service, calls, pending };
}

function rejectingService(error: unknown) {
  const calls: IngredientCreate[] = [];
  const service: IngredientsService = {
    createIngredient: async (input) => {
      calls.push(input);
      throw error;
    },
  };
  return { service, calls };
}

function mockService(): MockIngredientsService {
  return createMockIngredientsService({ ingredients: sampleIngredients(), newId: () => BULGUR.id });
}

/** Holds the created ingredients the way App does. */
function PageWithSession({ service }: { service: IngredientsService }) {
  const [created, setCreated] = useState<Ingredient[]>([]);
  return (
    <InventoryPage
      mode="mock"
      ingredientsService={service}
      createdIngredients={created}
      onIngredientCreated={(ingredient) => setCreated((current) => [...current, ingredient])}
    />
  );
}

function renderPage(service: IngredientsService) {
  const user = userEvent.setup();
  render(<PageWithSession service={service} />);
  return { user, openButton: screen.getByRole('button', { name: '+ New ingredient' }) };
}

const dialog = () => document.querySelector('dialog')!;
const field = (name: RegExp | string) => within(dialog()).getByLabelText(name);
const submitButton = () => within(dialog()).getByRole('button', { name: /^(Create ingredient|Creating…)$/ });

async function fillForm(user: ReturnType<typeof userEvent.setup>, name: string, unit: string, threshold: string) {
  if (name) await user.type(field('Name'), name);
  await user.selectOptions(field('Unit'), unit);
  if (threshold) await user.type(field(/^Low-stock threshold/), threshold);
}

describe('New ingredient', () => {
  it('opens a labelled modal dialog with Name focused and a threshold label that follows the unit', async () => {
    const { user, openButton } = renderPage(mockService());
    expect(dialog()).not.toHaveAttribute('open');

    await user.click(openButton);
    expect(dialog()).toHaveAttribute('open');
    expect(screen.getByRole('dialog', { name: 'New ingredient' })).toHaveAccessibleDescription('Adds an ingredient to the catalogue');
    expect(field('Name')).toHaveFocus();
    expect(within(field('Unit')).getAllByRole('option').map((option) => option.textContent)).toEqual(['g', 'ml', 'piece']);
    expect(field('Unit')).toHaveAccessibleDescription('g, ml or piece. No unit conversion.');
    expect(field('Low-stock threshold (g)')).toHaveAccessibleDescription('Starts with 0 stock. Add stock using Adjust.');

    await user.selectOptions(field('Unit'), 'ml');
    expect(field('Low-stock threshold (ml)')).toBeInTheDocument();
    expect(within(dialog()).queryByLabelText(/stock on hand|opening stock/i)).toBeNull();
  });

  it('sends the POST /ingredients body and, on success, shows the row with 0 stock, announces it and returns focus', async () => {
    const service = mockService();
    const { user, openButton } = renderPage(service);
    await user.click(openButton);
    await fillForm(user, 'Bulgur', 'g', '2000');
    await user.click(submitButton());

    expect(service.calls).toEqual([{ name: 'Bulgur', unit: 'g', lowStockThreshold: 2000 }]);
    const row = (await screen.findByRole('rowheader', { name: 'Bulgur' })).closest('tr')!;
    expect(within(row).getAllByRole('cell').slice(1, 4).map((cell) => cell.textContent)).toEqual([
      'On hand (physical)0g',
      'Reserved (pending orders)0g',
      'Available (on hand − reserved)0g',
    ]);
    expect(within(row).getByText('Out')).toBeInTheDocument();
    expect(screen.getByText('Bulgur created. It starts with 0 stock.')).toHaveAttribute('aria-live', 'polite');
    expect(dialog()).not.toHaveAttribute('open');
    expect(openButton).toHaveFocus();

    await user.click(openButton);
    expect(field('Name')).toHaveValue('');
    expect(field(/^Low-stock threshold/)).toHaveValue(null);
  });

  it('ignores more submits while the request runs and keeps the dialog open', async () => {
    const { service, calls, pending } = controlledService();
    const { user, openButton } = renderPage(service);
    await user.click(openButton);
    await fillForm(user, 'Bulgur', 'g', '2000');

    await user.click(submitButton());
    expect(submitButton()).toHaveTextContent('Creating…');
    expect(submitButton()).toHaveAttribute('aria-disabled', 'true');
    expect(submitButton()).toHaveFocus();
    expect(within(dialog()).getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(field('Name')).toHaveAttribute('readonly');
    expect(field('Unit')).toBeDisabled();

    await user.click(submitButton());
    await user.type(field(/^Low-stock threshold/), '{Enter}');
    expect(calls).toHaveLength(1);

    // Escape fires `cancel` in a browser; it must not close the dialog during the request.
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog(), cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog()).toHaveAttribute('open');

    await act(async () => pending[0]!.resolve(BULGUR));
    expect(dialog()).not.toHaveAttribute('open');
    expect(screen.getByRole('rowheader', { name: 'Bulgur' })).toBeInTheDocument();
  });

  it('keeps the values and shows the duplicate-name message under Name (scr-04f)', async () => {
    const { user, openButton } = renderPage(mockService());
    await user.click(openButton);
    await fillForm(user, 'Rice', 'g', '2000');
    await user.click(submitButton());

    const name = field('Name');
    expect(await within(dialog()).findByText('An ingredient with this name already exists.')).toBeInTheDocument();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('An ingredient with this name already exists.');
    expect(name).toHaveFocus();
    expect(name).toHaveValue('Rice');
    expect(field(/^Low-stock threshold/)).toHaveValue(2000);
    expect(dialog()).toHaveAttribute('open');

    await user.type(name, 'Bowl');
    expect(name).not.toHaveAttribute('aria-invalid');
    expect(within(dialog()).queryByText('An ingredient with this name already exists.')).toBeNull();
  });

  it('shows contract field errors under their fields and focuses the first one', async () => {
    const error = new ApiProblemError(422, {
      type: 'about:blank',
      title: 'Validation failed',
      status: 422,
      code: 'VALIDATION_FAILED',
      errors: [
        { field: 'lowStockThreshold', message: 'Must be 0 or more.' },
        { field: 'name', message: 'Name is required.' },
      ],
    });
    const { user, openButton } = renderPage(rejectingService(error).service);
    await user.click(openButton);
    await fillForm(user, '', 'g', '-1');
    await user.click(submitButton());

    expect(await within(dialog()).findByText('Name is required.')).toBeInTheDocument();
    expect(field('Name')).toHaveFocus();
    expect(field(/^Low-stock threshold/)).toHaveAccessibleDescription('Starts with 0 stock. Add stock using Adjust. Must be 0 or more.');
    expect(field(/^Low-stock threshold/)).toHaveValue(-1);
    expect(within(dialog()).queryByRole('alert')).toBeNull();
  });

  it('says the ingredient may exist when no answer came back, and keeps the values', async () => {
    const { service, calls } = rejectingService(new NetworkError());
    const { user, openButton } = renderPage(service);
    await user.click(openButton);
    await fillForm(user, 'Bulgur', 'piece', '3');
    await user.click(submitButton());

    const alert = await within(dialog()).findByRole('alert');
    expect(alert).toHaveTextContent('The ingredient may have been created.');
    expect(alert).toHaveTextContent('If you try again and it was created, the name is reported as already existing.');
    expect(alert).not.toHaveTextContent(/inventory list/i);
    expect(field('Name')).toHaveValue('Bulgur');
    expect(field('Unit')).toHaveValue('piece');
    expect(submitButton()).toHaveFocus();
    expect(calls).toHaveLength(1);
    expect(screen.queryByRole('rowheader', { name: 'Bulgur' })).toBeNull();
  });

  it('shows the server text and code for a rejection such as 403', async () => {
    const service = mockService();
    service.failNext('forbidden');
    const { user, openButton } = renderPage(service);
    await user.click(openButton);
    await fillForm(user, 'Bulgur', 'g', '10');
    await user.click(submitButton());

    const alert = await within(dialog()).findByRole('alert');
    expect(alert).toHaveTextContent('The ingredient was not created.');
    expect(alert).toHaveTextContent('Only managers can create ingredients.');
    expect(alert).toHaveTextContent('Code: FORBIDDEN');

    await user.click(submitButton());
    expect(await screen.findByRole('rowheader', { name: 'Bulgur' })).toBeInTheDocument();
  });

  it('does not send an empty or non-numeric threshold as 0 or NaN', async () => {
    const service = mockService();
    const { user, openButton } = renderPage(service);
    await user.click(openButton);
    await fillForm(user, 'Bulgur', 'g', '');
    await user.click(submitButton());

    expect(service.calls).toEqual([]);
    expect(field(/^Low-stock threshold/)).toHaveAccessibleDescription(
      'Starts with 0 stock. Add stock using Adjust. Enter the low-stock threshold as a number.',
    );
    expect(field(/^Low-stock threshold/)).toHaveFocus();
  });

  it('sends nothing when closed with Cancel or Escape before submitting, and starts empty next time', async () => {
    const service = mockService();
    const { user, openButton } = renderPage(service);

    await user.click(openButton);
    await fillForm(user, 'Bulgur', 'g', '5');
    await user.click(within(dialog()).getByRole('button', { name: 'Cancel' }));
    expect(dialog()).not.toHaveAttribute('open');
    expect(openButton).toHaveFocus();

    await user.click(openButton);
    expect(field('Name')).toHaveValue('');
    await user.type(field('Name'), 'Bulgur');
    // A browser closes the dialog after an unprevented `cancel` (Escape); the stand-in does it here.
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog(), cancel);
    expect(cancel.defaultPrevented).toBe(false);
    act(() => dialog().close());
    expect(dialog()).not.toHaveAttribute('open');
    expect(openButton).toHaveFocus();

    await user.click(openButton);
    expect(field('Name')).toHaveValue('');
    expect(service.calls).toEqual([]);
  });

  it('opens again with the error if the browser closed the dialog during the request', async () => {
    const { service, pending } = controlledService();
    const { user, openButton } = renderPage(service);
    await user.click(openButton);
    await fillForm(user, 'Bulgur', 'g', '5');
    await user.click(submitButton());

    act(() => dialog().close());
    expect(dialog()).not.toHaveAttribute('open');

    await act(async () => pending[0]!.reject(new NetworkError()));
    expect(dialog()).toHaveAttribute('open');
    expect(within(dialog()).getByRole('alert')).toHaveTextContent('The ingredient may have been created.');
    expect(field('Name')).toHaveValue('Bulgur');
  });

  it('is not offered in http mode, which has no ingredients service and no mock fallback', () => {
    render(<InventoryPage mode="http" ingredientsService={null} createdIngredients={[]} onIngredientCreated={() => {}} />);
    expect(screen.queryByRole('button', { name: '+ New ingredient' })).toBeNull();
    expect(document.querySelector('dialog')).toBeNull();
    expect(screen.getByText('This screen is not connected to the API yet.')).toBeInTheDocument();
  });
});

describe('validation extension point (S3-05)', () => {
  it('shows the validator messages, focuses the first invalid field and sends nothing', async () => {
    const user = userEvent.setup();
    const service = mockService();
    const validate = vi.fn(() => ({ unit: 'Pick a unit.', name: 'Name is required.' }));
    render(<NewIngredientDialog open service={service} validate={validate} onOpenChange={() => {}} onCreated={() => {}} />);

    await user.type(field(/^Low-stock threshold/), '5');
    await user.click(submitButton());

    expect(validate).toHaveBeenCalledWith({ name: '', unit: 'g', lowStockThreshold: '5' });
    expect(service.calls).toEqual([]);
    expect(field('Name')).toHaveAccessibleDescription('Name is required.');
    expect(field('Unit')).toHaveAccessibleDescription('g, ml or piece. No unit conversion. Pick a unit.');
    expect(field('Name')).toHaveFocus();
  });

  it('lets the validator message replace the built-in number message for the threshold', async () => {
    const user = userEvent.setup();
    const service = mockService();
    const validate = () => ({ lowStockThreshold: 'Enter a threshold of 0 or more.' });
    render(<NewIngredientDialog open service={service} validate={validate} onOpenChange={() => {}} onCreated={() => {}} />);

    await user.type(field('Name'), 'Bulgur');
    await user.click(submitButton());
    expect(field(/^Low-stock threshold/)).toHaveAccessibleDescription(
      'Starts with 0 stock. Add stock using Adjust. Enter a threshold of 0 or more.',
    );
    expect(service.calls).toEqual([]);
  });
});
