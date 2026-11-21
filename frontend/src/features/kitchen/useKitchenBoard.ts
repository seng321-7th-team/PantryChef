import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiProblemError, isAbortError, isUncertainOutcome } from '../../api/errors';
import type { OrdersService } from '../../api/ordersService';
import type { KitchenTargetStatus, Order } from '../../api/types';
import {
  actionFor,
  BOARD_STATUSES,
  type BoardData,
  type BoardStatus,
  columnQueries,
  columnText,
  DEFAULT_POLL_INTERVAL_MS,
  type ErrorView,
  findLoadedStatus,
  isBoardStatus,
  moveOrder,
  toErrorView,
} from './kitchenModel';

export interface CardAction {
  target: KitchenTargetStatus;
  from: BoardStatus;
  /** Idempotency-Key of this logical status change. */
  key: string;
  /** running: request in flight; uncertain: result unknown, retry reuses the key; failed: rejected. */
  phase: 'running' | 'uncertain' | 'failed';
  error?: ErrorView;
}

export interface BoardNotice {
  title: string;
  detail: string;
  code?: string;
}

export interface KitchenBoardState {
  data: BoardData | null;
  loadState: 'loading' | 'loaded' | 'error';
  loadError: ErrorView | null;
  /** A refresh failed while earlier data is still shown. */
  refreshWarning: ErrorView | null;
  lastUpdatedAt: Date | null;
  actions: Record<string, CardAction>;
  notice: BoardNotice | null;
  /**
   * Result of the last status change that the server confirmed with the requested status, for
   * example "Order #1042 moved to Preparing." Only the user's own action sets it; refreshes do not.
   */
  moveMessage: string | null;
}

export interface UseKitchenBoardOptions {
  pollIntervalMs?: number;
  createIdempotencyKey?: () => string;
}

const randomKey = () => crypto.randomUUID();

const initialState: KitchenBoardState = {
  data: null,
  loadState: 'loading',
  loadError: null,
  refreshWarning: null,
  lastUpdatedAt: null,
  actions: {},
  notice: null,
  moveMessage: null,
};

/** Drops unresolved card actions that a fresh server view shows as completed or moved on. */
function reconcileActions(actions: Record<string, CardAction>, board: BoardData): Record<string, CardAction> {
  const next: Record<string, CardAction> = {};
  for (const [orderId, action] of Object.entries(actions)) {
    if (action.phase === 'running') {
      next[orderId] = action;
      continue;
    }
    const status = findLoadedStatus(board, orderId);
    if (status === undefined || status === action.from) next[orderId] = action;
  }
  return next;
}

function conflictNotice(order: Order, target: KitchenTargetStatus, error: ApiProblemError): BoardNotice {
  const code = error.code ?? 'INVALID_STATUS_TRANSITION';
  if (target === 'PREPARING') {
    return { title: `Order #${order.orderNumber} was already started`, detail: 'The board has been refreshed.', code };
  }
  return {
    title: `Order #${order.orderNumber} could not be marked as ready`,
    detail: 'Its status was changed elsewhere. The board has been refreshed.',
    code,
  };
}

export function useKitchenBoard(service: OrdersService, options: UseKitchenBoardOptions = {}) {
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const createKey = options.createIdempotencyKey ?? randomKey;

  const [state, setState] = useState<KitchenBoardState>(initialState);

  const mounted = useRef(false);
  const mutationEpoch = useRef(0);
  const refreshInFlight = useRef(false);
  const refreshAgain = useRef(false);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const listController = useRef<AbortController | null>(null);
  const mutationControllers = useRef(new Set<AbortController>());
  const actionsRef = useRef<Record<string, CardAction>>({});
  const refreshRef = useRef<() => void>(() => undefined);

  const updateActions = useCallback((change: (current: Record<string, CardAction>) => Record<string, CardAction>) => {
    actionsRef.current = change(actionsRef.current);
    const actions = actionsRef.current;
    setState((s) => ({ ...s, actions }));
  }, []);

  const refresh = useCallback(async () => {
    if (refreshInFlight.current) {
      // At most one refresh group at a time; remember the request instead of dropping it.
      refreshAgain.current = true;
      return;
    }
    clearTimeout(pollTimer.current);
    refreshInFlight.current = true;
    refreshAgain.current = false;
    const controller = new AbortController();
    listController.current = controller;
    const startedAtEpoch = mutationEpoch.current;

    try {
      // Three separate requests; together they are not one atomic server snapshot.
      const pages = await Promise.all(
        BOARD_STATUSES.map((status) => service.listOrders(columnQueries[status], { signal: controller.signal })),
      );
      if (!mounted.current || controller.signal.aborted) return;
      if (startedAtEpoch !== mutationEpoch.current) {
        // A status change succeeded while this group was in flight: the response may be older
        // than the local update, so it is discarded and a new group is requested.
        refreshAgain.current = true;
        return;
      }
      const data = Object.fromEntries(
        BOARD_STATUSES.map((status, i) => [status, { orders: pages[i]!.items, totalItems: pages[i]!.page.totalItems }]),
      ) as BoardData;
      actionsRef.current = reconcileActions(actionsRef.current, data);
      const actions = actionsRef.current;
      setState((s) => ({
        ...s,
        data,
        actions,
        loadState: 'loaded',
        loadError: null,
        refreshWarning: null,
        lastUpdatedAt: new Date(),
      }));
    } catch (error) {
      controller.abort();
      if (isAbortError(error) || !mounted.current) return;
      const view = toErrorView(error);
      setState((s) =>
        s.data ? { ...s, refreshWarning: view } : { ...s, loadState: 'error', loadError: view },
      );
    } finally {
      if (listController.current === controller) listController.current = null;
      refreshInFlight.current = false;
      if (mounted.current) {
        if (refreshAgain.current) {
          refreshAgain.current = false;
          refreshRef.current();
        } else {
          pollTimer.current = setTimeout(() => refreshRef.current(), pollIntervalMs);
        }
      }
    }
  }, [service, pollIntervalMs]);

  useEffect(() => {
    refreshRef.current = () => void refresh();
  }, [refresh]);

  useEffect(() => {
    mounted.current = true;
    const controllers = mutationControllers.current;
    void refresh();
    return () => {
      mounted.current = false;
      clearTimeout(pollTimer.current);
      listController.current?.abort();
      for (const controller of controllers) controller.abort();
      controllers.clear();
    };
  }, [refresh]);

  const runAction = useCallback(
    async (order: Order) => {
      if (!isBoardStatus(order.status)) return;
      const from = order.status;
      const definition = actionFor[from];
      if (!definition) return;
      const existing = actionsRef.current[order.id];
      if (existing?.phase === 'running') return;

      // A retry after an unknown result is the same logical operation: same key, same body.
      const key =
        existing?.phase === 'uncertain' && existing.target === definition.target && existing.from === from
          ? existing.key
          : createKey();
      const target = definition.target;
      updateActions((a) => ({ ...a, [order.id]: { target, from, key, phase: 'running' } }));
      setState((s) => (s.moveMessage ? { ...s, moveMessage: null } : s));

      const controller = new AbortController();
      mutationControllers.current.add(controller);
      try {
        const updated = await service.updateOrderStatus(order.id, { status: target }, key, {
          signal: controller.signal,
        });
        if (!mounted.current) return;
        mutationEpoch.current += 1;
        updateActions((a) => {
          const rest = { ...a };
          delete rest[order.id];
          return rest;
        });
        // moveOrder works on the current board, so a refresh that already showed this change is
        // not counted twice. The refresh below reconciles cases a first page cannot decide.
        // The message names only the confirmed status; a 2xx answer with another status is not
        // reported as the requested move.
        const moveMessage =
          updated.status === target ? `Order #${order.orderNumber} moved to ${columnText[target].title}.` : null;
        setState((s) => ({ ...s, ...(s.data ? { data: moveOrder(s.data, updated, from) } : {}), moveMessage }));
        refreshRef.current();
      } catch (error) {
        if (isAbortError(error) || !mounted.current) return;
        if (error instanceof ApiProblemError && error.code === 'INVALID_STATUS_TRANSITION') {
          updateActions((a) => {
            const rest = { ...a };
            delete rest[order.id];
            return rest;
          });
          setState((s) => ({ ...s, notice: conflictNotice(order, target, error) }));
          refreshRef.current();
          return;
        }
        const phase = isUncertainOutcome(error) ? 'uncertain' : 'failed';
        updateActions((a) => ({ ...a, [order.id]: { target, from, key, phase, error: toErrorView(error) } }));
        if (phase === 'uncertain') refreshRef.current();
      } finally {
        mutationControllers.current.delete(controller);
      }
    },
    [service, createKey, updateActions],
  );

  const retryLoad = useCallback(() => {
    setState((s) => (s.data ? s : { ...s, loadState: 'loading', loadError: null }));
    refreshRef.current();
  }, []);

  const dismissNotice = useCallback(() => setState((s) => ({ ...s, notice: null })), []);

  return { state, runAction, retryLoad, dismissNotice };
}
