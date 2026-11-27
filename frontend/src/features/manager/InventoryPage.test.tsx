import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InventoryPage } from './InventoryPage';

// The sample data always has low-stock rows. For this file only, the same rows are read with no
// row below its threshold, so that Low stock only returns no rows.
vi.mock('../../api/mock/sampleScreens', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/mock/sampleScreens')>();
  return {
    ...actual,
    sampleInventory: () => actual.sampleInventory().map((item) => ({ ...item, lowStock: false })),
  };
});

describe('InventoryPage', () => {
  it('says so when Low stock only matches no ingredient, and shows all rows again when turned off', async () => {
    const user = userEvent.setup();
    render(<InventoryPage mode="mock" ingredientsService={null} createdIngredients={[]} onIngredientCreated={() => {}} />);
    const stock = screen.getByRole('region', { name: 'Stock' });
    const filter = screen.getByRole('button', { name: 'Low stock only' });
    expect(within(stock).getAllByRole('rowheader')).toHaveLength(8);

    await user.click(filter);
    expect(filter).toHaveAttribute('aria-pressed', 'true');
    expect(within(stock).getByText('No ingredients match this filter.')).toBeInTheDocument();
    expect(within(stock).queryByRole('table')).toBeNull();

    await user.click(filter);
    expect(filter).toHaveAttribute('aria-pressed', 'false');
    expect(within(stock).queryByText('No ingredients match this filter.')).toBeNull();
    expect(within(stock).getAllByRole('rowheader')).toHaveLength(8);
  });
});
