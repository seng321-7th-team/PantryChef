import type { Order } from '../../api/types';
import { type BoardStatus, type ColumnData, columnText } from './kitchenModel';
import { OrderCard } from './OrderCard';
import type { CardAction } from './useKitchenBoard';

interface BoardColumnProps {
  status: BoardStatus;
  column: ColumnData;
  actions: Record<string, CardAction>;
  onAction: (order: Order) => void;
}

export function BoardColumn({ status, column, actions, onAction }: BoardColumnProps) {
  const { title, subtitle } = columnText[status];
  const headingId = `column-${status.toLowerCase()}`;
  const shown = column.orders.length;
  const total = column.totalItems;

  return (
    <section className={`board-column board-column--${status.toLowerCase()}`} aria-labelledby={headingId}>
      <div className="board-column__header">
        <h2 id={headingId} className="board-column__title">
          {title}
        </h2>
        <span className="count-badge" aria-label={`${total} ${total === 1 ? 'order' : 'orders'}`}>
          {total}
        </span>
      </div>
      <p className="board-column__subtitle">{subtitle}</p>
      {shown < total ? (
        <p className="board-column__partial">
          Showing {shown} of {total}
        </p>
      ) : null}
      {shown === 0 ? (
        <p className="board-column__empty">No orders</p>
      ) : (
        <ul className="board-column__list">
          {column.orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} status={status} action={actions[order.id]} onAction={onAction} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
