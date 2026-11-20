import type { Order } from '../../api/types';
import { OrderStatusBadge } from '../../components/StatusBadge';

interface OrdersTableProps {
  orders: Order[];
  /** Show the recipe version of each item, as in the manager frame scr-05a. */
  showRecipeVersions?: boolean;
  /** Late cancel is offered to managers; the waiter frame scr-05c shows it disabled. */
  viewer: 'waiter' | 'manager';
}

function itemsText(order: Order, withVersions: boolean): string {
  return order.items
    .map((line) => `${line.quantity}× ${line.menuItemName}${withVersions ? ` (v${line.recipeVersion})` : ''}`)
    .join(', ');
}

/** "Today's orders" table of scr-05a / scr-05c. Cancel actions are shown disabled: not connected yet. */
export function OrdersTable({ orders, showRecipeVersions = false, viewer }: OrdersTableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Table</th>
          <th scope="col">Items</th>
          <th scope="col">Status</th>
          <th scope="col">
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <th scope="row">#{order.orderNumber}</th>
            <td className="muted">{order.tableLabel}</td>
            <td>{itemsText(order, showRecipeVersions)}</td>
            <td>
              <OrderStatusBadge status={order.status} />
            </td>
            <td className="table__action">
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
