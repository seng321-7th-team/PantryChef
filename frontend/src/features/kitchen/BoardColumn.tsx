import type { Order } from '../../api/types';
import { type BoardStatus, type ColumnData, columnPanelId, columnText } from './kitchenModel';
import { OrderCard } from './OrderCard';
import type { CardAction } from './useKitchenBoard';

interface BoardColumnProps {
  status: BoardStatus;
  column: ColumnData;
  actions: Record<string, CardAction>;
  onAction: (order: Order) => void;
  /** Set on narrow screens, where the column is the panel of its status tab. */
  tab?: { id: string; selected: boolean };
}

export function BoardColumn({ status, column, actions, onAction, tab }: BoardColumnProps) {
  const { title, subtitle } = columnText[status];
  const headingId = `column-${status.toLowerCase()}`;
  const shown = column.orders.length;
  const total = column.totalItems;

  return (
    <section
      id={columnPanelId(status)}
      className={`board-column board-column--${status.toLowerCase()}`}
      role={tab ? 'tabpanel' : undefined}
      aria-labelledby={tab ? tab.id : headingId}
      tabIndex={tab ? 0 : undefined}
      hidden={tab ? !tab.selected : undefined}
    >
      <div className="board-column__header">
        {/* tabIndex -1: a focus target after the last card leaves the column, not a Tab stop. */}
        <h2 id={headingId} className="board-column__title" tabIndex={-1}>
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
