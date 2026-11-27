import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMockOrdersService, type MockOrdersService } from '../../api/mock/mockOrdersService';
import { figmaSampleOrders, manyPendingOrders } from '../../api/mock/sampleOrders';
import type { OrdersService } from '../../api/ordersService';
import type { ListOrdersQuery, Order, OrderPage } from '../../api/types';
import { KitchenBoardPage, STATUS_TABS_QUERY } from './KitchenBoardPage';
import type { UseKitchenBoardOptions } from './useKitchenBoard';

const LONG_POLL = 60_000;

function mock(orders: Order[] = figmaSampleOrders()): MockOrdersService {
  return createMockOrdersService({ orders });
}

function renderBoard(service: OrdersService, options: UseKitchenBoardOptions = {}) {
  return render(<KitchenBoardPage service={service} options={{ pollIntervalMs: LONG_POLL, ...options }} />);
}

const column = (name: 'Pending' | 'Preparing' | 'Ready') => screen.getByRole('region', { name });

function counts() {
  return (['Pending', 'Preparing', 'Ready'] as const)
    .map((name) => within(column(name)).getByLabelText(/orders?$/).textContent)
    .join(' / ');
}

function cardNumbers(name: 'Pending' | 'Preparing' | 'Ready') {
  return within(column(name))
    .queryAllByRole('article')
    .map((card) => card.getAttribute('aria-labelledby') && within(card).getByRole('heading').textContent);
}

async function loaded() {
  await screen.findByRole('region', { name: 'Pending' });
}

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

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('KitchenBoardPage', () => {
  it('groups orders by status and takes counters from page.totalItems', async () => {
    renderBoard(mock());
    await loaded();

    expect(counts()).toBe('3 / 1 / 1');
    expect(cardNumbers('Pending')).toEqual(['#1040 · Table 9', '#1042 · Table 7', '#1043 · Table 4']);
    expect(cardNumbers('Preparing')).toEqual(['#1041 · Table 2']);
    expect(cardNumbers('Ready')).toEqual(['#1039 · Table 5']);
    expect(within(column('Ready')).getByText('Ready to serve')).toBeInTheDocument();
    expect(within(column('Ready')).queryByRole('button')).toBeNull();
  });

  it('moves #1042 Pending → Preparing → Ready with counters 3/1/1 → 2/2/1 → 2/1/2', async () => {
    const user = userEvent.setup();
    renderBoard(mock());
    await loaded();

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(counts()).toBe('2 / 2 / 1'));
    expect(cardNumbers('Preparing')).toContain('#1042 · Table 7');

    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1042' }));
    await waitFor(() => expect(counts()).toBe('2 / 1 / 2'));
    expect(cardNumbers('Ready')).toContain('#1042 · Table 7');
  });

  it('offers the actions on every eligible order, not only #1042', async () => {
    const user = userEvent.setup();
    renderBoard(mock());
    await loaded();

    for (const n of [1040, 1042, 1043]) {
      expect(screen.getByRole('button', { name: `Start preparing order #${n}` })).toBeEnabled();
    }
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1040' }));
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1040 · Table 9'));

    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1041' }));
    await waitFor(() => expect(cardNumbers('Ready')).toContain('#1041 · Table 2'));
    expect(counts()).toBe('2 / 1 / 2');
  });

  it('locks only the card whose status change is in progress', async () => {
    const base = mock();
    const pending = new Map<string, Deferred<void>>();
    const service: OrdersService = {
      listOrders: (q, o) => base.listOrders(q, o),
      async updateOrderStatus(id, update, key, o) {
        const gate = deferred<void>();
        pending.set(update.status, gate);
        await gate.promise;
        return base.updateOrderStatus(id, update, key, o);
      },
    };
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    const busy = screen.getByRole('button', { name: 'Deducting stock… order #1042' });
    expect(busy).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Start preparing order #1040' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Start preparing order #1043' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Mark as ready order #1041' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1041' }));
    expect(screen.getByRole('button', { name: 'Marking as ready… order #1041' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Start preparing order #1040' })).toBeEnabled();

    await act(async () => {
      pending.get('PREPARING')!.resolve();
      pending.get('READY')!.resolve();
    });
    await waitFor(() => expect(counts()).toBe('2 / 1 / 2'));
  });

  it('shows "Showing X of Y" when a column has more orders than the first page', async () => {
    renderBoard(mock([...figmaSampleOrders(), ...manyPendingOrders(130)]));
    await loaded();

    expect(within(column('Pending')).getByLabelText('133 orders')).toBeInTheDocument();
    expect(within(column('Pending')).getByText('Showing 100 of 133')).toBeInTheDocument();
    expect(within(column('Pending')).getAllByRole('article')).toHaveLength(100);
    expect(within(column('Preparing')).queryByText(/Showing/)).toBeNull();
  });

  it.each([
    ['the response is lost', 'network-after-apply'],
    ['the 2xx response body cannot be read', 'unreadable-after-apply'],
  ] as const)('retries an unknown result (%s) with the same key and body, and uses a new key for the next change', async (_name, fault) => {
    const base = mock();
    let holdLists = false;
    const service: OrdersService = {
      // After the first load, list responses are held so the card keeps its retry state.
      listOrders: (q, o) => (holdLists ? new Promise<OrderPage>(() => undefined) : base.listOrders(q, o)),
      updateOrderStatus: (id, u, k, o) => base.updateOrderStatus(id, u, k, o),
    };
    let n = 0;
    const user = userEvent.setup();
    renderBoard(service, { createIdempotencyKey: () => `key-${++n}` });
    await loaded();
    holdLists = true;

    base.failNext('update', fault); // applied on the server, but the client cannot confirm it
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    expect(await screen.findByText(/The result is unknown/)).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'Retry start preparing order #1042' }));
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1042 · Table 7'));
    expect(counts()).toBe('2 / 2 / 1');

    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1042' }));
    await waitFor(() => expect(counts()).toBe('2 / 1 / 2'));

    expect(base.calls.update.map((c) => [c.update.status, c.idempotencyKey])).toEqual([
      ['PREPARING', 'key-1'],
      ['PREPARING', 'key-1'],
      ['READY', 'key-2'],
    ]);
    // The retry was answered from the stored result; the order changed status only once per step.
    expect(base.snapshot().find((o) => o.orderNumber === 1042)!.statusHistory.map((h) => h.toStatus)).toEqual([
      'PENDING',
      'PREPARING',
      'READY',
    ]);
  });

  it('drops the retry when a refresh shows that an unreadable 2xx change was applied', async () => {
    const base = mock();
    const user = userEvent.setup();
    renderBoard(base, { createIdempotencyKey: () => 'key-1' });
    await loaded();

    base.failNext('update', 'unreadable-after-apply');
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    // The board refreshes after the unknown result and finds #1042 already Preparing.
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1042 · Table 7'));
    expect(screen.queryByRole('button', { name: 'Retry start preparing order #1042' })).toBeNull();
    expect(screen.queryByText(/The result is unknown/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Mark as ready order #1042' })).toBeEnabled();
    expect(counts()).toBe('2 / 2 / 1');
    expect(base.calls.update).toHaveLength(1);
  });

  it('reuses the key when the user retries after a network failure', async () => {
    const base = mock();
    const listGate: { held: boolean } = { held: false };
    const service: OrdersService = {
      // Keep the board unchanged after the failure, so the retry button stays visible.
      listOrders: (q, o) => (listGate.held ? new Promise<OrderPage>(() => undefined) : base.listOrders(q, o)),
      updateOrderStatus: (id, u, k, o) => base.updateOrderStatus(id, u, k, o),
    };
    let n = 0;
    const user = userEvent.setup();
    renderBoard(service, { createIdempotencyKey: () => `key-${++n}` });
    await loaded();

    listGate.held = true;
    base.failNext('update', 'network');
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1040' }));
    await user.click(await screen.findByRole('button', { name: 'Retry start preparing order #1040' }));
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1040 · Table 9'));

    expect(base.calls.update.map((c) => c.idempotencyKey)).toEqual(['key-1', 'key-1']);
    expect(base.calls.update[1]!.update).toEqual(base.calls.update[0]!.update);
  });

  it('does not let an older list response undo a successful status change', async () => {
    const base = mock();
    const held: Array<() => void> = [];
    let hold = false;
    const service: OrdersService = {
      async listOrders(query, options) {
        const snapshot = await base.listOrders(query, options); // server view at request time
        if (!hold) return snapshot;
        const gate = deferred<void>();
        held.push(() => gate.resolve());
        await gate.promise;
        return snapshot;
      },
      updateOrderStatus: (id, u, k, o) => base.updateOrderStatus(id, u, k, o),
    };
    const user = userEvent.setup();
    renderBoard(service); // long interval: only status changes start refresh groups
    await loaded();
    hold = true;

    // The successful change of #1040 starts a refresh group; it reads the server before #1042 changes.
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1040' }));
    await waitFor(() => expect(held).toHaveLength(3));
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(counts()).toBe('1 / 3 / 1'));

    // Release the older group only; the follow-up group stays held.
    await act(async () => {
      for (const release of held.splice(0, 3)) release();
    });
    await waitFor(() => expect(held).toHaveLength(3)); // a new group was requested instead
    expect(counts()).toBe('1 / 3 / 1');
    expect(cardNumbers('Pending')).toEqual(['#1043 · Table 4']);
    expect(cardNumbers('Preparing')).toEqual(['#1040 · Table 9', '#1041 · Table 2', '#1042 · Table 7']);

    hold = false;
    await act(async () => {
      for (const release of held.splice(0)) release();
    });
    expect(counts()).toBe('1 / 3 / 1');
  });

  it('keeps the Start preparing lock and label when a poll moves the card before the PATCH response', async () => {
    const base = mock();
    const patchResponses = new Map<string, Deferred<void>>();
    const service: OrdersService = {
      listOrders: (q, o) => base.listOrders(q, o),
      async updateOrderStatus(id, update, key, options) {
        const result = await base.updateOrderStatus(id, update, key, options); // applied on the server
        const gate = deferred<void>();
        patchResponses.set(update.status, gate);
        await gate.promise; // response not yet received
        return result;
      },
    };
    const user = userEvent.setup();
    renderBoard(service, { pollIntervalMs: 40 });
    await loaded();

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1042 · Table 7'));

    // The card is in Preparing, but its Start preparing request is still open.
    const locked = screen.getByRole('button', { name: 'Deducting stock… order #1042' });
    expect(locked).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Marking as ready… order #1042|Mark as ready order #1042/ })).toBeNull();
    await user.click(locked);
    expect(base.calls.update.map((c) => c.update.status)).toEqual(['PREPARING']);

    await act(async () => {
      patchResponses.get('PREPARING')!.resolve();
    });
    const markReady = screen.getByRole('button', { name: 'Mark as ready order #1042' });
    expect(markReady).toBeEnabled();

    // The Ready request keeps its own busy label.
    await user.click(markReady);
    expect(screen.getByRole('button', { name: 'Marking as ready… order #1042' })).toBeDisabled();
    await act(async () => {
      patchResponses.get('READY')!.resolve();
    });
    await waitFor(() => expect(cardNumbers('Ready')).toContain('#1042 · Table 7'));
    expect(counts()).toBe('2 / 1 / 2');
  });

  it('does not count a change twice when a poll shows it before the PATCH response arrives', async () => {
    const base = mock();
    const patchResponse = deferred<void>();
    let holdLists = false;
    const service: OrdersService = {
      listOrders: (q, o) => (holdLists ? new Promise<OrderPage>(() => undefined) : base.listOrders(q, o)),
      async updateOrderStatus(id, update, key, options) {
        const result = await base.updateOrderStatus(id, update, key, options); // applied on the server
        await patchResponse.promise; // response not yet received
        return result;
      },
    };
    const user = userEvent.setup();
    renderBoard(service, { pollIntervalMs: 40 });
    await loaded();

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    // A poll that started after the server applied the change already shows #1042 in Preparing.
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1042 · Table 7'));
    expect(counts()).toBe('2 / 2 / 1');

    holdLists = true; // no further server view can correct the board
    await act(async () => {
      patchResponse.resolve();
    });

    expect(counts()).toBe('2 / 2 / 1');
    expect(screen.getAllByRole('heading', { name: '#1042 · Table 7' })).toHaveLength(1);
    expect(cardNumbers('Preparing')).toEqual(['#1041 · Table 2', '#1042 · Table 7']);
    expect(cardNumbers('Pending')).toEqual(['#1040 · Table 9', '#1043 · Table 4']);
    expect(screen.getByRole('button', { name: 'Mark as ready order #1042' })).toBeEnabled();
  });

  it('runs at most one refresh group at a time and stops polling on unmount', async () => {
    vi.useFakeTimers();
    const signals: AbortSignal[] = [];
    const calls: ListOrdersQuery[] = [];
    const service: OrdersService = {
      listOrders(query, options) {
        calls.push(query);
        if (options?.signal) signals.push(options.signal);
        return new Promise<OrderPage>(() => undefined); // never settles
      },
      updateOrderStatus: () => Promise.reject(new Error('not used')),
    };
    const view = render(<KitchenBoardPage service={service} options={{ pollIntervalMs: 20_000 }} />);
    expect(calls.map((q) => q.status)).toEqual(['PENDING', 'PREPARING', 'READY']);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(120_000);
    });
    expect(calls).toHaveLength(3);

    view.unmount();
    expect(signals.every((s) => s.aborted)).toBe(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120_000);
    });
    expect(calls).toHaveLength(3);
  });

  it('polls again after the interval once the previous group has finished', async () => {
    vi.useFakeTimers();
    const service = mock();
    render(<KitchenBoardPage service={service} options={{ pollIntervalMs: 20_000 }} />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(service.calls.list).toHaveLength(3);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(19_999);
    });
    expect(service.calls.list).toHaveLength(3);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(service.calls.list).toHaveLength(6);
  });

  it('shows "already started" on a 409 for Start preparing and reloads the board', async () => {
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    service.setStatusExternally(1042, 'PREPARING'); // another chef started it
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Order #1042 was already started');
    expect(alert).toHaveTextContent('INVALID_STATUS_TRANSITION');
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1042 · Table 7'));
    expect(counts()).toBe('2 / 2 / 1');
  });

  it('uses a Ready-specific message on a 409 for Mark as ready', async () => {
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    service.setStatusExternally(1041, 'READY');
    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1041' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Order #1041 could not be marked as ready');
    expect(alert).not.toHaveTextContent('already started');
    await waitFor(() => expect(cardNumbers('Ready')).toContain('#1041 · Table 2'));
  });

  it('keeps the conflict reload when a refresh group is already in flight', async () => {
    const base = mock();
    let hold = false;
    const held: Array<() => void> = [];
    const service: OrdersService = {
      async listOrders(query, options) {
        const result = await base.listOrders(query, options);
        if (!hold) return result;
        const gate = deferred<void>();
        held.push(() => gate.resolve());
        await gate.promise;
        return result;
      },
      updateOrderStatus: (id, u, k, o) => base.updateOrderStatus(id, u, k, o),
    };
    const user = userEvent.setup();
    renderBoard(service); // long interval: no poll can hide a lost reload request
    await loaded();
    hold = true;

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1040' }));
    await waitFor(() => expect(held).toHaveLength(3)); // refresh group in flight
    base.setStatusExternally(1043, 'PREPARING');
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1043' }));
    await screen.findByText('Order #1043 was already started');

    hold = false;
    const before = base.calls.list.length;
    await act(async () => {
      for (const release of held.splice(0)) release();
    });
    await waitFor(() => expect(base.calls.list.length).toBe(before + 3));
    await waitFor(() => expect(cardNumbers('Preparing')).toContain('#1043 · Table 4'));
    expect(counts()).toBe('1 / 3 / 1');
  });

  it('shows the error state on a failed first load and recovers with Retry', async () => {
    const service = mock();
    service.failNext('list', 'server-error');
    const user = userEvent.setup();
    renderBoard(service);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Something went wrong on our side.');
    expect(alert).toHaveTextContent('Code: INTERNAL_ERROR');
    await user.click(within(alert).getByRole('button', { name: 'Retry' }));
    await loaded();
    expect(counts()).toBe('3 / 1 / 1');
  });

  it('keeps the cards and shows a warning when a later refresh fails', async () => {
    const service = mock();
    renderBoard(service, { pollIntervalMs: 30 });
    await loaded();

    service.failNext('list', 'network');
    const warning = await screen.findByText("Couldn't refresh the board.");
    expect(warning.closest('[role="status"]')).toHaveTextContent("Can't reach the server.");
    expect(warning.closest('[role="status"]')).toHaveTextContent(/Showing orders from \d{2}:\d{2}:\d{2}/);
    expect(counts()).toBe('3 / 1 / 1');
    expect(cardNumbers('Pending')).toHaveLength(3);
  });

  it('shows the empty state when no order is open', async () => {
    renderBoard(mock([]));
    expect(await screen.findByText('No orders to prepare')).toBeInTheDocument();
    expect(screen.getByText('New orders appear on this board automatically.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No orders to prepare');
  });

  it('shows a loading state before the first response', () => {
    const service: OrdersService = {
      listOrders: () => new Promise<OrderPage>(() => undefined),
      updateOrderStatus: () => Promise.reject(new Error('not used')),
    };
    renderBoard(service);
    expect(screen.getByRole('status')).toHaveTextContent('Loading orders…');
  });
});

/** Stubs matchMedia so that the status-tab query matches; `resize` changes the answer later. */
function screenWidth(narrow: boolean) {
  let matches = narrow;
  const listeners = new Set<() => void>();
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    get matches() {
      return media === STATUS_TABS_QUERY && matches;
    },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  }));
  return {
    resize(nextNarrow: boolean) {
      matches = nextNarrow;
      act(() => listeners.forEach((listener) => listener()));
    },
  };
}

const tab = (name: 'Pending' | 'Preparing' | 'Ready') => screen.getByRole('tab', { name: new RegExp(`^${name}`) });

function tabCounts() {
  return (['Pending', 'Preparing', 'Ready'] as const)
    .map((name) => within(tab(name)).getByLabelText(/orders?$/).textContent)
    .join(' / ');
}

/** Cards a user can see: hidden panels are left out. */
function visibleCards() {
  return screen.queryAllByRole('article').map((card) => within(card).getByRole('heading').textContent);
}

describe('KitchenBoardPage on narrow screens', () => {
  it('shows one column at a time and keeps the chosen tab through the #1042 flow', async () => {
    screenWidth(true);
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service);
    expect(await screen.findByRole('tablist', { name: 'Order status' })).toBeInTheDocument();

    expect(screen.getAllByRole('tab').map((t) => t.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect(tabCounts()).toBe('3 / 1 / 1');
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName(/^Pending/);
    expect(visibleCards()).toEqual(['#1040 · Table 9', '#1042 · Table 7', '#1043 · Table 4']);

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(tabCounts()).toBe('2 / 2 / 1'));
    expect(tab('Pending')).toHaveAttribute('aria-selected', 'true');
    expect(visibleCards()).toEqual(['#1040 · Table 9', '#1043 · Table 4']);

    // The board reloads once after a successful change (3 column requests); tab clicks add none.
    await waitFor(() => expect(service.calls.list).toHaveLength(6));
    await user.click(tab('Preparing'));
    expect(visibleCards().filter((card) => card === '#1042 · Table 7')).toHaveLength(1);
    expect(service.calls.list).toHaveLength(6);

    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1042' }));
    await waitFor(() => expect(tabCounts()).toBe('2 / 1 / 2'));
    expect(tab('Preparing')).toHaveAttribute('aria-selected', 'true');
    expect(visibleCards()).toEqual(['#1041 · Table 2']);

    await waitFor(() => expect(service.calls.list).toHaveLength(9));
    await user.click(tab('Ready'));
    await user.click(tab('Pending'));
    await user.click(tab('Ready'));
    expect(visibleCards()).toEqual(['#1042 · Table 7', '#1039 · Table 5']);
    expect(service.calls.list).toHaveLength(9);
    expect(service.calls.update.map((call) => call.update.status)).toEqual(['PREPARING', 'READY']);
  });

  it('moves between tabs with the arrow keys, Home and End and keeps hidden cards out of the tab order', async () => {
    screenWidth(true);
    const user = userEvent.setup();
    renderBoard(mock());
    await screen.findByRole('tablist');

    tab('Pending').focus();
    await user.keyboard('{ArrowRight}');
    expect(tab('Preparing')).toHaveFocus();
    expect(tab('Preparing')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(tab('Ready')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tab('Pending')).toHaveFocus();
    await user.keyboard('{End}');
    expect(tab('Ready')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');

    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Start preparing order #1040' })).toHaveFocus();
  });

  it('keeps an emptied tab selected through later polls and shows its empty state', async () => {
    screenWidth(true);
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service, { pollIntervalMs: 50 });
    await screen.findByRole('tablist');

    await user.click(tab('Preparing'));
    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1041' }));
    await waitFor(() => expect(tabCounts()).toBe('3 / 0 / 2'));
    const listCalls = service.calls.list.length;
    await waitFor(() => expect(service.calls.list.length).toBeGreaterThanOrEqual(listCalls + 3));

    expect(tab('Preparing')).toHaveAttribute('aria-selected', 'true');
    expect(within(screen.getByRole('tabpanel')).getByText('No orders')).toBeInTheDocument();
    expect(visibleCards()).toEqual([]);
  });

  it('keeps cards and a running status change when the screen width changes', async () => {
    const width = screenWidth(true);
    const base = mock();
    const gate = deferred<void>();
    const service: OrdersService = {
      listOrders: (q, o) => base.listOrders(q, o),
      async updateOrderStatus(id, update, key, o) {
        await gate.promise;
        return base.updateOrderStatus(id, update, key, o);
      },
    };
    const user = userEvent.setup();
    renderBoard(service);
    await screen.findByRole('tablist');

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    const listCalls = base.calls.list.length;

    width.resize(false);
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(counts()).toBe('3 / 1 / 1');
    expect(screen.getByRole('button', { name: 'Deducting stock… order #1042' })).toBeDisabled();

    width.resize(true);
    expect(tab('Pending')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Deducting stock… order #1042' })).toBeDisabled();
    expect(base.calls.list).toHaveLength(listCalls);

    await act(async () => gate.resolve());
    await waitFor(() => expect(tabCounts()).toBe('2 / 2 / 1'));
    expect(base.calls.update).toHaveLength(1);
  });
});

/** The polite live region under the page title. */
const feedback = () => document.querySelector('[aria-live="polite"]')!;

describe('KitchenBoardPage status change feedback', () => {
  it('reports a confirmed move once and does not repeat it on polls or width changes', async () => {
    const width = screenWidth(true);
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service, { pollIntervalMs: 30 });
    await screen.findByRole('tablist');
    expect(feedback()).toBeEmptyDOMElement();

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(feedback()).toHaveTextContent('Order #1042 moved to Preparing.'));
    expect(tab('Pending')).toHaveAttribute('aria-selected', 'true');
    expect(feedback()).not.toContainElement(document.activeElement as HTMLElement);

    // Count every change of the live region while the board polls and the width changes.
    let changes = 0;
    const observer = new MutationObserver(() => (changes += 1));
    observer.observe(feedback(), { childList: true, characterData: true, subtree: true });
    const listCalls = service.calls.list.length;
    await waitFor(() => expect(service.calls.list.length).toBeGreaterThanOrEqual(listCalls + 6));
    width.resize(false);
    width.resize(true);
    observer.disconnect();
    expect(changes).toBe(0);
    expect(feedback()).toHaveTextContent('Order #1042 moved to Preparing.');

    await user.click(tab('Preparing'));
    await user.click(screen.getByRole('button', { name: 'Mark as ready order #1042' }));
    await waitFor(() => expect(feedback()).toHaveTextContent('Order #1042 moved to Ready.'));
    expect(tab('Preparing')).toHaveAttribute('aria-selected', 'true');
  });

  it.each([
    ['a rejected change', 'server-error'],
    ['a network failure', 'network'],
    ['an unreadable 2xx answer', 'unreadable-after-apply'],
  ] as const)('shows no success message after %s', async (_name, fault) => {
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    service.failNext('update', fault);
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: /order #1042$/ })).toBeEnabled());
    // An unreadable 2xx answer: the refresh may show the move, but the client never saw a confirmation.
    await waitFor(() => expect(service.calls.list.length).toBeGreaterThanOrEqual(6));
    expect(feedback()).toBeEmptyDOMElement();
  });

  it('does not report a move when a 2xx answer carries a different status', async () => {
    const base = mock();
    const service: OrdersService = {
      listOrders: (q, o) => base.listOrders(q, o),
      updateOrderStatus: async (id) => base.snapshot().find((order) => order.id === id)!,
    };
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Start preparing order #1042' })).toBeEnabled());
    expect(feedback()).toBeEmptyDOMElement();
  });

  it('clears the previous message when the next change starts and a conflict follows', async () => {
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    await user.click(screen.getByRole('button', { name: 'Start preparing order #1042' }));
    await waitFor(() => expect(feedback()).toHaveTextContent('Order #1042 moved to Preparing.'));
    service.failNext('update', 'conflict');
    await user.click(screen.getByRole('button', { name: 'Start preparing order #1040' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Order #1040 was already started');
    expect(feedback()).toBeEmptyDOMElement();
  });
});

describe('KitchenBoardPage background refresh failure', () => {
  it('keeps the cards and the last successful update time, then clears the warning on recovery', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 10, 21, 12, 0, 0));
    const service = mock();
    renderBoard(service, { pollIntervalMs: 30 });
    await loaded();
    const lastUpdated = () => screen.getByText(/Last updated/).textContent;
    const before = lastUpdated();
    expect(before).toContain('12:00:0');

    vi.setSystemTime(new Date(2026, 10, 21, 12, 5, 0));
    service.failNext('list', 'network');
    const warning = (await screen.findByText("Couldn't refresh the board.")).closest('[role="status"]')!;
    expect(warning).toHaveTextContent("Can't reach the server.");
    expect(warning).toHaveTextContent(`Showing orders from ${before!.replace(/^.*Last updated /, '')}`);
    expect(lastUpdated()).toBe(before);
    expect(counts()).toBe('3 / 1 / 1');
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();

    await waitFor(() => expect(screen.queryByText("Couldn't refresh the board.")).toBeNull());
    expect(lastUpdated()).toContain('12:05:');
    expect(counts()).toBe('3 / 1 / 1');
  });
});

describe('KitchenBoardPage keyboard focus after a status change', () => {
  const button = (name: string) => screen.getByRole('button', { name });

  it('moves focus to the next card, then the previous card, then the column heading on wide screens', async () => {
    const user = userEvent.setup();
    renderBoard(mock());
    await loaded();

    button('Start preparing order #1042').focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(counts()).toBe('2 / 2 / 1'));
    await waitFor(() => expect(button('Start preparing order #1043')).toHaveFocus());

    await user.keyboard('{Enter}');
    await waitFor(() => expect(counts()).toBe('1 / 3 / 1'));
    await waitFor(() => expect(button('Start preparing order #1040')).toHaveFocus());

    await user.keyboard('{Enter}');
    await waitFor(() => expect(counts()).toBe('0 / 4 / 1'));
    await waitFor(() => expect(screen.getByRole('heading', { level: 2, name: 'Pending' })).toHaveFocus());
    expect(feedback()).not.toHaveFocus();
  });

  it('moves focus to the selected status tab when the last card leaves the column on narrow screens', async () => {
    screenWidth(true);
    const user = userEvent.setup();
    renderBoard(mock());
    await screen.findByRole('tablist');

    await user.click(tab('Preparing'));
    button('Mark as ready order #1041').focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(tabCounts()).toBe('3 / 0 / 2'));
    await waitFor(() => expect(tab('Preparing')).toHaveFocus());
    expect(tab('Preparing')).toHaveAttribute('aria-selected', 'true');
  });

  it('leaves focus where the user moved it while the request was running', async () => {
    const base = mock();
    const gate = deferred<void>();
    const service: OrdersService = {
      listOrders: (q, o) => base.listOrders(q, o),
      async updateOrderStatus(id, update, key, o) {
        await gate.promise;
        return base.updateOrderStatus(id, update, key, o);
      },
    };
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    button('Start preparing order #1042').focus();
    await user.keyboard('{Enter}');
    // The user moves on to another card before the answer arrives.
    act(() => button('Start preparing order #1040').focus());
    expect(button('Start preparing order #1040')).toHaveFocus();

    await act(async () => gate.resolve());
    await waitFor(() => expect(counts()).toBe('2 / 2 / 1'));
    expect(button('Start preparing order #1040')).toHaveFocus();
  });

  it('does not pull focus back after the user clicks elsewhere on the page during the request', async () => {
    const base = mock();
    const gate = deferred<void>();
    const service: OrdersService = {
      listOrders: (q, o) => base.listOrders(q, o),
      async updateOrderStatus(id, update, key, o) {
        await gate.promise;
        return base.updateOrderStatus(id, update, key, o);
      },
    };
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    button('Start preparing order #1042').focus();
    await user.keyboard('{Enter}');
    // jsdom moves focus off the now disabled button on its next render tick.
    await waitFor(() => expect(document.body).toHaveFocus());
    // A click on text that cannot take focus leaves focus on the page itself.
    await user.click(screen.getByRole('heading', { level: 1, name: 'Kitchen board' }));
    expect(document.body).toHaveFocus();

    await act(async () => gate.resolve());
    await waitFor(() => expect(counts()).toBe('2 / 2 / 1'));
    expect(document.body).toHaveFocus();
  });

  it('does not move focus on polls or width changes without a status change', async () => {
    const width = screenWidth(true);
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service, { pollIntervalMs: 30 });
    await screen.findByRole('tablist');

    await user.click(tab('Ready'));
    expect(tab('Ready')).toHaveFocus();
    const listCalls = service.calls.list.length;
    await waitFor(() => expect(service.calls.list.length).toBeGreaterThanOrEqual(listCalls + 6));
    expect(tab('Ready')).toHaveFocus();

    // A card button exists at every width; the tabs exist only on narrow screens.
    await user.click(tab('Pending'));
    act(() => button('Start preparing order #1040').focus());
    width.resize(false);
    width.resize(true);
    expect(button('Start preparing order #1040')).toHaveFocus();
  });

  it('keeps focus on the card button when the change fails and the card stays', async () => {
    const service = mock();
    const user = userEvent.setup();
    renderBoard(service);
    await loaded();

    service.failNext('update', 'network');
    button('Start preparing order #1042').focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('button', { name: 'Retry start preparing order #1042' })).toHaveFocus();
    expect(counts()).toBe('3 / 1 / 1');
  });
});
