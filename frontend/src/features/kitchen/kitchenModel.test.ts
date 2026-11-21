import { describe, expect, it } from 'vitest';
import { figmaSampleOrders } from '../../api/mock/sampleOrders';
import { BOARD_STATUSES, type BoardData, columnQueries, moveOrder } from './kitchenModel';

function board(): BoardData {
  const orders = figmaSampleOrders(new Date('2026-11-18T00:00:00'));
  return Object.fromEntries(
    BOARD_STATUSES.map((status) => {
      const list = orders.filter((o) => o.status === status);
      return [status, { orders: list, totalItems: list.length }];
    }),
  ) as BoardData;
}

describe('kitchenModel', () => {
  it('uses the existing GET /orders options: one status per request, first page of 100', () => {
    expect(columnQueries).toEqual({
      PENDING: { status: 'PENDING', sort: 'createdAt', page: 1, size: 100 },
      PREPARING: { status: 'PREPARING', sort: 'createdAt', page: 1, size: 100 },
      READY: { status: 'READY', sort: '-createdAt', page: 1, size: 100 },
    });
  });

  it('moves an order between columns and keeps the totals consistent', () => {
    const start = board();
    const order = start.PENDING.orders.find((o) => o.orderNumber === 1042)!;
    const next = moveOrder(start, { ...order, status: 'PREPARING' }, 'PENDING');

    expect(next.PENDING.totalItems).toBe(2);
    expect(next.PREPARING.totalItems).toBe(2);
    expect(next.READY.totalItems).toBe(1);
    expect(next.PREPARING.orders.map((o) => o.orderNumber)).toEqual([1041, 1042]);
  });

  it('does not count a change twice when a refresh already shows the order in its new column', () => {
    const start = board();
    const order = start.PENDING.orders.find((o) => o.orderNumber === 1042)!;
    const preparing = { ...order, status: 'PREPARING' as const };
    // Board after a refresh that already reflects the change: 2 / 2 / 1, #1042 in Preparing.
    const refreshed = moveOrder(start, preparing, 'PENDING');
    expect([refreshed.PENDING.totalItems, refreshed.PREPARING.totalItems, refreshed.READY.totalItems]).toEqual([2, 2, 1]);

    const next = moveOrder(refreshed, preparing, 'PENDING');

    expect([next.PENDING.totalItems, next.PREPARING.totalItems, next.READY.totalItems]).toEqual([2, 2, 1]);
    const all = BOARD_STATUSES.flatMap((s) => next[s].orders).filter((o) => o.orderNumber === 1042);
    expect(all).toHaveLength(1);
    expect(next.PREPARING.orders.map((o) => o.orderNumber)).toEqual([1041, 1042]);
  });

  it('leaves cards and totals to the next refresh when the order is not on any loaded page', () => {
    const start = board();
    const order = start.PENDING.orders.find((o) => o.orderNumber === 1042)!;
    start.PENDING = { orders: start.PENDING.orders.filter((o) => o.orderNumber !== 1042), totalItems: 2 };

    const next = moveOrder(start, { ...order, status: 'PREPARING' }, 'PENDING');

    expect(next).toBe(start);
  });

  it('keeps the Ready column newest first and leaves totals beyond the first page intact', () => {
    const start = board();
    start.PREPARING.totalItems = 150; // only part of the column is loaded
    const order = start.PREPARING.orders[0]!;
    const next = moveOrder(start, { ...order, status: 'READY' }, 'PREPARING');

    expect(next.PREPARING.totalItems).toBe(149);
    expect(next.READY.orders.map((o) => o.orderNumber)).toEqual([1041, 1039]);
  });
});
