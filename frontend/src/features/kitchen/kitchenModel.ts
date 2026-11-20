import { ApiProblemError, NetworkError, UnexpectedResponseError } from '../../api/errors';
import type { KitchenTargetStatus, ListOrdersQuery, Order } from '../../api/types';

export const BOARD_STATUSES = ['PENDING', 'PREPARING', 'READY'] as const;
export type BoardStatus = (typeof BOARD_STATUSES)[number];

/** First page only; later pages are not loaded in this build. API maximum is 100. */
export const PAGE_SIZE = 100;
/** Within the 15–30 s range of ADR-010. */
export const DEFAULT_POLL_INTERVAL_MS = 20_000;

export const columnQueries: Record<BoardStatus, ListOrdersQuery> = {
  PENDING: { status: 'PENDING', sort: 'createdAt', page: 1, size: PAGE_SIZE },
  PREPARING: { status: 'PREPARING', sort: 'createdAt', page: 1, size: PAGE_SIZE },
  READY: { status: 'READY', sort: '-createdAt', page: 1, size: PAGE_SIZE },
};

export const columnText: Record<BoardStatus, { title: string; subtitle: string }> = {
  PENDING: { title: 'Pending', subtitle: 'Reserved · stock not deducted yet' },
  PREPARING: { title: 'Preparing', subtitle: 'Stock deducted once' },
  READY: { title: 'Ready', subtitle: 'Waiting for pickup' },
};

export interface ActionDefinition {
  target: KitchenTargetStatus;
  label: string;
  busyLabel: string;
  retryLabel: string;
}

/** Chef actions by current status. Every order in a valid status gets its action. */
export const actionFor: Record<BoardStatus, ActionDefinition | null> = {
  PENDING: {
    target: 'PREPARING',
    label: 'Start preparing',
    busyLabel: 'Deducting stock…',
    retryLabel: 'Retry start preparing',
  },
  PREPARING: {
    target: 'READY',
    label: 'Mark as ready',
    busyLabel: 'Marking as ready…',
    retryLabel: 'Retry mark as ready',
  },
  READY: null,
};

export function isBoardStatus(status: string): status is BoardStatus {
  return (BOARD_STATUSES as readonly string[]).includes(status);
}

export interface ColumnData {
  orders: Order[];
  /** page.totalItems of the column's own request. */
  totalItems: number;
}

export type BoardData = Record<BoardStatus, ColumnData>;

function compareForColumn(status: BoardStatus) {
  const direction = columnQueries[status].sort === 'createdAt' ? 1 : -1;
  return (a: Order, b: Order) => direction * a.createdAt.localeCompare(b.createdAt);
}

export function findLoadedStatus(board: BoardData, orderId: string): BoardStatus | undefined {
  return BOARD_STATUSES.find((status) => board[status].orders.some((order) => order.id === orderId));
}

/**
 * Applies a successful status change to the board as it is now.
 *
 * - Card still in `from`: it moves to the column of its new status; both totals change by one.
 * - Card already in its new column (a refresh reflected the change first): only the card data
 *   is updated; totals stay as the server reported them.
 * - Card not on any loaded page, or in another column: the board is left unchanged. Whether the
 *   change is already counted cannot be told from a first page, so the next refresh reconciles it.
 */
export function moveOrder(board: BoardData, updated: Order, from: BoardStatus): BoardData {
  const current = findLoadedStatus(board, updated.id);

  if (current !== undefined && current === updated.status) {
    const column = board[current];
    const orders = column.orders.map((order) => (order.id === updated.id ? updated : order));
    return { ...board, [current]: { ...column, orders } };
  }
  if (current !== from) return board;

  const source = board[from];
  const next: BoardData = {
    ...board,
    [from]: {
      orders: source.orders.filter((order) => order.id !== updated.id),
      totalItems: Math.max(0, source.totalItems - 1),
    },
  };
  if (isBoardStatus(updated.status)) {
    const target = next[updated.status];
    const orders = [...target.orders, updated].sort(compareForColumn(updated.status)).slice(0, PAGE_SIZE);
    next[updated.status] = { orders, totalItems: target.totalItems + 1 };
  }
  return next;
}

export function boardIsEmpty(board: BoardData): boolean {
  return BOARD_STATUSES.every((status) => board[status].totalItems === 0);
}

export interface ErrorView {
  title: string;
  detail: string;
  code?: string;
}

/** User-facing text for an error, using the copy of scr-07a-states where it exists. */
export function toErrorView(error: unknown): ErrorView {
  if (error instanceof NetworkError) {
    return { title: "Can't reach the server.", detail: 'Check your connection and try again.' };
  }
  if (error instanceof ApiProblemError) {
    if (error.status >= 500) {
      return {
        title: 'Something went wrong on our side.',
        detail: "We couldn't confirm the result. Refresh to check the latest status.",
        code: error.code ?? 'INTERNAL_ERROR',
      };
    }
    return {
      title: error.problem?.title ?? `The request was rejected (${error.status}).`,
      detail: error.problem?.detail ?? 'Refresh to check the latest status.',
      ...(error.code ? { code: error.code } : {}),
    };
  }
  if (error instanceof UnexpectedResponseError) {
    return { title: 'Unexpected response from the server.', detail: 'Refresh to check the latest status.' };
  }
  return { title: 'Something went wrong.', detail: 'Refresh to check the latest status.' };
}
