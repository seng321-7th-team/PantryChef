import { useCallback, useEffect, useRef } from 'react';
import type { Order } from '../../api/types';
import { type BoardData, type BoardStatus, isBoardStatus } from './kitchenModel';
import type { CardAction } from './useKitchenBoard';

interface PendingFocus {
  orderId: string;
  from: BoardStatus;
  /** Position of the card in its column when the action started. */
  index: number;
}

function cardButton(orderId: string): HTMLButtonElement | null {
  return document.getElementById(`order-${orderId}-heading`)?.closest('article')?.querySelector('button') ?? null;
}

function focusIsLost(): boolean {
  return !document.activeElement || document.activeElement === document.body;
}

/**
 * Keeps keyboard focus near a card after the user's own status change. The action button is
 * disabled while the request runs (browsers then drop its focus) and leaves the column when the
 * card moves. Focus goes back to the card's button if the card stays (failed or unknown result),
 * or to the next card's button in the same column, the previous one, and finally the selected
 * status tab (narrow screens) or the column heading. Nothing is moved if the user has focused or
 * clicked something else in the meantime, and refreshes or width changes alone never move focus.
 */
export function useActionFocus(
  data: BoardData | null,
  actions: Record<string, CardAction>,
  fallback: (from: BoardStatus) => HTMLElement | null,
) {
  const pending = useRef<PendingFocus | null>(null);
  const restoring = useRef(false);

  // Any focus change or click by the user ends the hand-over.
  useEffect(() => {
    const cancel = () => {
      if (!restoring.current) pending.current = null;
    };
    document.addEventListener('focusin', cancel);
    document.addEventListener('pointerdown', cancel);
    return () => {
      document.removeEventListener('focusin', cancel);
      document.removeEventListener('pointerdown', cancel);
    };
  }, []);

  const focusQuietly = (element: HTMLElement) => {
    restoring.current = true;
    element.focus();
    restoring.current = false;
  };

  useEffect(() => {
    const target = pending.current;
    if (!target || !data) return;
    if (actions[target.orderId]?.phase === 'running') return;

    const column = data[target.from].orders;
    if (column.some((order) => order.id === target.orderId)) {
      // The card stayed: give focus back to its button once the request has ended.
      const button = cardButton(target.orderId);
      if (focusIsLost() && button && !button.disabled) focusQuietly(button);
      return;
    }

    pending.current = null;
    if (!focusIsLost()) return;
    const neighbours = [column[target.index], column[target.index - 1]];
    for (const order of neighbours) {
      const button = order ? cardButton(order.id) : null;
      if (button && !button.disabled) {
        focusQuietly(button);
        return;
      }
    }
    const last = fallback(target.from);
    if (last) focusQuietly(last);
  });

  /** Call before starting the action; remembers the card only if its button has focus. */
  return useCallback(
    (order: Order) => {
      const active = document.activeElement;
      const fromButton = active instanceof HTMLButtonElement && active === cardButton(order.id);
      if (!fromButton || !data || !isBoardStatus(order.status)) {
        pending.current = null;
        return;
      }
      const from = order.status;
      pending.current = { orderId: order.id, from, index: data[from].orders.findIndex((o) => o.id === order.id) };
    },
    [data],
  );
}
