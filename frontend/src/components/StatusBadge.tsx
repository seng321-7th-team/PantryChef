import type { OrderStatus } from '../api/types';

const ORDER_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PREPARING: 'Preparing',
  READY: 'Ready',
  CANCELLED: 'Cancelled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{ORDER_LABELS[status]}</span>;
}

export type StockLevel = 'OK' | 'LOW' | 'OUT';

const STOCK_LABELS: Record<StockLevel, string> = { OK: 'OK', LOW: 'Low', OUT: 'Out' };

/** "Out" (available 0) and "Low" (lowStock) are display labels from scr-04a. */
export function StockBadge({ level }: { level: StockLevel }) {
  return <span className={`badge badge--stock-${level.toLowerCase()}`}>{STOCK_LABELS[level]}</span>;
}
