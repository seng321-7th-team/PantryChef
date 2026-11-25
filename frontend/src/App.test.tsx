import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { COMPACT_RECIPE_PICKER_QUERY } from './features/manager/RecipesPage';
import { parseRoute } from './navigation/routes';

const MOCK_ENV = { VITE_ORDERS_MODE: 'mock' };

function renderAt(hash: string, env: Record<string, string> = MOCK_ENV) {
  window.location.hash = hash;
  return render(<App env={env} />);
}

function menuLinks(name: string) {
  return within(screen.getByRole('navigation', { name })).getAllByRole('link');
}

function selected(name: string) {
  return menuLinks(name)
    .filter((link) => link.getAttribute('aria-current') === 'page')
    .map((link) => link.textContent);
}

/** Makes matchMedia answer `matches` for one query, as on a narrow screen. */
function narrowScreenFor(query: string) {
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: media === query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

beforeEach(() => {
  window.location.hash = '';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('routes', () => {
  it('maps hashes to screens and reports unknown paths', () => {
    expect(parseRoute('')).toEqual({ kind: 'role-select' });
    expect(parseRoute('#/')).toEqual({ kind: 'role-select' });
    expect(parseRoute('#/manager/recipes/')).toMatchObject({ kind: 'page', role: 'MANAGER', item: { page: 'manager-recipes' } });
    expect(parseRoute('#/chef/kitchen')).toMatchObject({ kind: 'page', role: 'CHEF' });
    expect(parseRoute('#/manager/kitchen')).toEqual({ kind: 'not-found', path: '/manager/kitchen' });
  });
});

describe('App role preview and navigation', () => {
  it('starts with a demo role choice that has no sign-in form', () => {
    const { container } = renderAt('');
    expect(screen.getByRole('heading', { name: 'Demo role preview' })).toBeInTheDocument();
    expect(screen.getByText(/There is no sign-in in this build/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^(Waiter|Chef|Manager)/ }).map((link) => link.getAttribute('href'))).toEqual([
      '#/waiter/new-order',
      '#/chef/kitchen',
      '#/manager/inventory',
    ]);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(container.querySelector('input[type="password"]')).toBeNull();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('opens the manager screens from the role choice and moves the selected tab', async () => {
    const user = userEvent.setup();
    renderAt('');
    await user.click(screen.getByRole('link', { name: /^Manager/ }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Inventory' })).toBeInTheDocument();
    expect(menuLinks('Manager menu').map((link) => link.textContent)).toEqual([
      'Inventory',
      'Recipes',
      'Orders & audit',
      'Staff permissions',
    ]);
    expect(selected('Manager menu')).toEqual(['Inventory']);
    expect(screen.getByText('Demo role preview:').parentElement).toHaveTextContent('Demo role preview: Manager');

    await user.click(screen.getByRole('link', { name: 'Recipes' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Recipes' })).toBeInTheDocument();
    expect(selected('Manager menu')).toEqual(['Recipes']);

    await user.click(screen.getByRole('link', { name: 'Orders & audit' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Orders & audit log' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Staff permissions' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Staff permissions' })).toBeInTheDocument();
    expect(selected('Manager menu')).toEqual(['Staff permissions']);
  });

  it('shows only New order and Orders to the waiter', async () => {
    const user = userEvent.setup();
    renderAt('#/waiter/new-order');
    expect(menuLinks('Waiter menu').map((link) => link.textContent)).toEqual(['New order', 'Orders']);
    expect(selected('Waiter menu')).toEqual(['New order']);

    await user.click(screen.getByRole('link', { name: 'Orders' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Orders' })).toBeInTheDocument();
    expect(selected('Waiter menu')).toEqual(['Orders']);
  });

  it('shows the existing kitchen board under the chef menu', async () => {
    renderAt('#/chef/kitchen');
    expect(menuLinks('Chef menu').map((link) => link.textContent)).toEqual(['Kitchen']);
    expect(selected('Chef menu')).toEqual(['Kitchen']);
    expect(screen.getByRole('heading', { level: 1, name: 'Kitchen board' })).toBeInTheDocument();
    expect(await screen.findByRole('region', { name: 'Pending' })).toBeInTheDocument();
  });

  it('returns to the role choice with Change role', async () => {
    const user = userEvent.setup();
    renderAt('#/manager/staff');
    await user.click(screen.getByRole('link', { name: 'Change role' }));
    expect(await screen.findByRole('heading', { name: 'Demo role preview' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('shows a not-found state for an unknown address', () => {
    renderAt('#/admin');
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Choose a role' })).toHaveAttribute('href', '#/');
  });

  it('opens and closes the narrow-screen menu with the Menu button, Escape and a page link', async () => {
    const user = userEvent.setup();
    renderAt('#/manager/inventory');
    const toggle = screen.getByRole('button', { name: 'Menu' });
    const panel = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(within(panel).getByRole('navigation', { name: 'Manager menu' })).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();

    await user.click(toggle);
    await user.click(within(panel).getByRole('link', { name: 'Recipes' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Recipes' })).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('has no Menu button on the role choice', () => {
    renderAt('');
    expect(screen.queryByRole('button', { name: 'Menu' })).toBeNull();
    expect(screen.getByText('Mock data')).toBeInTheDocument();
  });
});

describe('sample-data screens', () => {
  it('keeps one current order behind a toggle and still adds and removes dishes', async () => {
    const user = userEvent.setup();
    renderAt('#/waiter/new-order');
    expect(screen.getAllByRole('complementary', { name: 'Current order' })).toHaveLength(1);
    const toggle = screen.getByRole('button', { name: 'Show order (2 dishes)' });
    const body = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(within(body).getByText('Menemen')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Hide order (2 dishes)');
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Add Lentil Soup' }));
    expect(toggle).toHaveAccessibleName('Show order (3 dishes)');
    await user.click(within(body).getByRole('button', { name: 'Remove one Menemen' }));
    expect(within(body).queryByText('Menemen')).toBeNull();
    expect(toggle).toHaveAccessibleName('Show order (2 dishes)');
  });

  it('keeps the waiter draft on the page and does not offer sending', async () => {
    const user = userEvent.setup();
    renderAt('#/waiter/new-order');
    const currentOrder = screen.getByRole('complementary', { name: 'Current order' });
    expect(within(currentOrder).queryByText('Lentil Soup')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Add Lentil Soup' }));
    expect(within(currentOrder).getByText('Lentil Soup')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send to kitchen' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
    expect(screen.getByText(/Send to kitchen and Cancel are not connected/)).toBeInTheDocument();
  });

  it('filters the inventory to low-stock rows and keeps stock changes disabled', async () => {
    const user = userEvent.setup();
    renderAt('#/manager/inventory');
    expect(screen.getByRole('status')).toHaveTextContent('3 ingredients at or below their low-stock threshold');
    expect(within(screen.getByRole('region', { name: 'Stock' })).getAllByRole('row')).toHaveLength(9);

    await user.click(screen.getByRole('button', { name: 'Low stock only' }));
    const rows = within(screen.getByRole('region', { name: 'Stock' })).getAllByRole('rowheader');
    expect(rows.map((row) => row.textContent)).toEqual(['Red lentils', 'Chicken breast', 'Minced beef']);
    expect(screen.getByRole('button', { name: 'Low stock only' })).toHaveAttribute('aria-pressed', 'true');
    for (const button of screen.getAllByRole('button', { name: /^(Edit|Adjust)$/ })) expect(button).toBeDisabled();
  });

  it('keeps a created ingredient listed after another screen, in step with the mock duplicate check', async () => {
    // Mock mode only: the list and the duplicate answer both come from this app session, not an API.
    const user = userEvent.setup();
    renderAt('#/manager/inventory');
    const bulgurRows = () =>
      within(screen.getByRole('region', { name: 'Stock' })).queryAllByRole('rowheader', { name: 'Bulgur' });
    const dialog = () => document.querySelector('dialog')!;

    await user.click(screen.getByRole('button', { name: '+ New ingredient' }));
    await user.type(within(dialog()).getByLabelText('Name'), 'Bulgur');
    await user.type(within(dialog()).getByLabelText(/^Low-stock threshold/), '2000');
    await user.click(within(dialog()).getByRole('button', { name: 'Create ingredient' }));
    await vi.waitFor(() => expect(bulgurRows()).toHaveLength(1), { timeout: 3000 });

    await user.click(within(screen.getByRole('navigation', { name: 'Manager menu' })).getByRole('link', { name: 'Recipes' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Recipes' })).toBeInTheDocument();
    await user.click(within(screen.getByRole('navigation', { name: 'Manager menu' })).getByRole('link', { name: 'Inventory' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Inventory' })).toBeInTheDocument();

    expect(bulgurRows()).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('4 ingredients at or below their low-stock threshold');

    await user.click(screen.getByRole('button', { name: '+ New ingredient' }));
    await user.type(within(dialog()).getByLabelText('Name'), 'Bulgur');
    await user.type(within(dialog()).getByLabelText(/^Low-stock threshold/), '500');
    await user.click(within(dialog()).getByRole('button', { name: 'Create ingredient' }));
    expect(
      await within(dialog()).findByText('An ingredient with this name already exists.', undefined, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(bulgurRows()).toHaveLength(1);
  });

  it('keeps each stock amount tied to its column and unit for screen readers and on cards', () => {
    renderAt('#/manager/inventory');
    const stock = screen.getByRole('region', { name: 'Stock' });
    expect(within(stock).getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Ingredient',
      'Unit',
      'On hand physical',
      'Reserved pending orders',
      'Available on hand − reserved',
      'Threshold',
      'Status',
      'Actions',
    ]);
    const row = within(stock).getByRole('rowheader', { name: 'Red lentils' }).closest('tr')!;
    const cells = within(row).getAllByRole('cell');
    // The card labels and units are visible text only; the cell names stay the plain values.
    expect(cells.slice(0, 5).map((cell) => cell.textContent)).toEqual([
      'Unitg',
      'On hand (physical)3000g',
      'Reserved (pending orders)200g',
      'Available (on hand − reserved)2800g',
      'Threshold4000g',
    ]);
    expect(cells[1]).toHaveAccessibleName('3000');
    expect(cells[3]).toHaveAccessibleName('2800');
    for (const button of within(row).getAllByRole('button')) expect(button).toBeDisabled();
  });

  it('lists every item line of an order separately and keeps the cancel actions disabled', () => {
    renderAt('#/manager/orders');
    const row = screen.getByRole('rowheader', { name: '#1043' }).closest('tr')!;
    expect(within(row).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '1× Menemen (v3)',
      '1× Shepherd Salad (v2)',
    ]);
    expect(within(row).getByRole('button', { name: 'Cancel…' })).toBeDisabled();
    for (const button of screen.getAllByRole('button', { name: 'Late cancel…' })) expect(button).toBeDisabled();
  });

  it('selects a recipe from the menu item list on wide screens', async () => {
    const user = userEvent.setup();
    renderAt('#/manager/recipes');
    expect(screen.queryByRole('combobox')).toBeNull();
    await user.click(screen.getByRole('button', { name: /^Grilled Chicken/ }));
    expect(screen.getByRole('heading', { level: 2, name: /^Grilled Chicken/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Grilled Chicken/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('selects a recipe with one labelled select on narrow screens and updates the details', async () => {
    narrowScreenFor(COMPACT_RECIPE_PICKER_QUERY);
    const user = userEvent.setup();
    renderAt('#/manager/recipes');
    const picker = screen.getByRole('combobox', { name: 'Menu item' });
    expect(screen.queryByRole('button', { name: /^Menemen/ })).toBeNull();
    expect(within(picker).getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Menemen · recipe v3',
      'Lentil Soup · recipe v1',
      'Grilled Chicken · recipe v2',
      'Shepherd Salad · recipe v2',
      'Köfte Plate · recipe v1',
      'Rice Pudding · recipe v1',
    ]);
    const history = () =>
      within(screen.getByRole('region', { name: 'Version history' }))
        .getAllByRole('listitem')
        .map((item) => item.querySelector('strong')!.textContent);
    expect(screen.getByRole('heading', { level: 2, name: /^Menemen/ })).toHaveTextContent('Current: v3');
    expect(within(screen.getByRole('region', { name: /^Menemen/ })).getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual([
      'Eggs',
      'Tomatoes',
      'Olive oil',
    ]);
    expect(history()).toEqual(['v3', 'v2', 'v1']);

    await user.selectOptions(picker, 'Grilled Chicken');
    expect(picker).toHaveValue('Grilled Chicken');
    expect(screen.getByRole('heading', { level: 2, name: /^Grilled Chicken/ })).toHaveTextContent('Current: v2');
    expect(screen.getByText('The ingredient lines of this recipe are not part of the sample data.')).toBeInTheDocument();
    expect(history()).toEqual(['v2']);
    expect(screen.getByRole('button', { name: 'Edit recipe' })).toBeDisabled();
  });

  it('shows the staff permission read-only', () => {
    renderAt('#/manager/staff');
    const toggle = screen.getByRole('switch', { name: /Allow late cancellation/ });
    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
    expect(screen.getByText(/saving the late-cancel permission is not connected/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to orders' })).toHaveAttribute('href', '#/manager/orders');
  });

  it('does not fall back to sample data in http mode', () => {
    renderAt('#/manager/inventory', { VITE_ORDERS_MODE: 'http', VITE_API_BASE_URL: '/v1' });
    expect(screen.getByText('This screen is not connected to the API yet.')).toBeInTheDocument();
    expect(screen.queryByText('Tomatoes')).toBeNull();
    expect(screen.getByText('API /v1')).toBeInTheDocument();
  });
});
