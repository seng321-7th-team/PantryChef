import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
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

beforeEach(() => {
  window.location.hash = '';
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
});

describe('sample-data screens', () => {
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
