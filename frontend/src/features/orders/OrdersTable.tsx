import type { Order } from '../../api/types';
import { CellLabel } from '../../components/CellLabel';
import { OrderStatusBadge } from '../../components/StatusBadge';

interface OrdersTableProps {
  orders: Order[];
  /** Show the recipe version of each item, as in the manager frame scr-05a. */
  showRecipeVersions?: boolean;
  /** Late cancel is offered to managers; the waiter frame scr-05c shows it disabled. */
  viewer: 'waiter' | 'manager';
}

function lineText(line: Order['items'][number], withVersions: boolean): string {
  return `${line.quantity}× ${line.menuItemName}${withVersions ? ` (v${line.recipeVersion})` : ''}`;
}

/** "Today's orders" table of scr-05a / scr-05c. Cancel actions are shown disabled: not connected yet. */
export function OrdersTable({ orders, showRecipeVersions = false, viewer }: OrdersTableProps) {
  return (
    // Explicit roles keep the table semantics when narrow screens show the rows as cards.
    <table className="table table--stack table--orders" role="table">
      <thead role="rowgroup">
        <tr role="row">
          <th scope="col" role="columnheader">
            Order
          </th>
          <th scope="col" role="columnheader">
            Table
          </th>
          <th scope="col" role="columnheader">
            Items
          </th>
          <th scope="col" role="columnheader">
            Status
          </th>
          <th scope="col" role="columnheader">
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {orders.map((order) => (
          <tr key={order.id} role="row">
            <th scope="row" role="rowheader" className="table__title">
              #{order.orderNumber}
            </th>
            <td role="cell" className="muted table__inline">
              <CellLabel>Table</CellLabel>
              {order.tableLabel}
            </td>
            <td role="cell" className="table__wide">
              <CellLabel>Items</CellLabel>
              <ul className="item-lines">
                {order.items.map((line) => (
                  <li key={line.id}>{lineText(line, showRecipeVersions)}</li>
                ))}
              </ul>
            </td>
            <td role="cell" className="table__status">
              <CellLabel>Status</CellLabel>
              <OrderStatusBadge status={order.status} />
            </td>
            <td role="cell" className="table__action">
              {order.status === 'PENDING' ? (
                <button type="button" className="btn btn--outline-muted" disabled title="Not connected in this build">
                  Cancel…
                </button>
              ) : null}
              {order.status === 'PREPARING' || order.status === 'READY' ? (
                <button
                  type="button"
                  className={viewer === 'manager' ? 'btn btn--outline-danger' : 'btn btn--disabled'}
                  disabled
                  title={viewer === 'manager' ? 'Not connected in this build' : 'Needs ORDER_LATE_CANCEL'}
                >
                  Late cancel…
                </button>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
