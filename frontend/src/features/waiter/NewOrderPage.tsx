import { useMemo, useState } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import { todaysSampleOrders } from '../../api/mock/sampleOrders';
import { SAMPLE_DRAFT, SAMPLE_MY_OPEN_ORDER_NUMBERS, sampleMenuItems } from '../../api/mock/sampleScreens';
import type { MenuItem } from '../../api/types';
import { SampleDataPage } from '../../components/SampleDataPage';
import { OrderStatusBadge } from '../../components/StatusBadge';

/** Portions at or below this number are shown as a warning, as in scr-02a (Köfte Plate). */
const FEW_PORTIONS = 5;

function portionsText(item: MenuItem): { text: string; tone: 'normal' | 'warning' | 'out' } {
  if (item.availablePortions === 0) return { text: 'Out of stock', tone: 'out' };
  const text = `${item.availablePortions} portion${item.availablePortions === 1 ? '' : 's'} available`;
  return { text, tone: item.availablePortions <= FEW_PORTIONS ? 'warning' : 'normal' };
}

/** scr-02a-waiter-default. The draft can be edited on the page; sending is not connected. */
export function NewOrderPage({ mode }: { mode: OrdersMode }) {
  const menu = useMemo(() => sampleMenuItems(), []);
  const openOrders = useMemo(
    () => todaysSampleOrders().filter((order) => SAMPLE_MY_OPEN_ORDER_NUMBERS.includes(order.orderNumber)),
    [],
  );
  const [draft, setDraft] = useState<Map<string, number>>(() => {
    const byName = new Map(menu.map((item) => [item.name, item.id]));
    return new Map(SAMPLE_DRAFT.lines.map(([name, quantity]) => [byName.get(name)!, quantity]));
  });

  function change(item: MenuItem, delta: number) {
    setDraft((current) => {
      const next = new Map(current);
      const quantity = Math.min((next.get(item.id) ?? 0) + delta, item.availablePortions);
      if (quantity <= 0) next.delete(item.id);
      else next.set(item.id, quantity);
      return next;
    });
  }

  const draftLines = menu.filter((item) => draft.has(item.id));

  return (
    <SampleDataPage
      title="New order"
      mode={mode}
      notImplemented="The order is kept on this page only: Send to kitchen and Cancel are not connected in this build."
    >
      <div className="split">
        <div className="split__main">
          <p className="section-hint">Portions available now</p>
          <ul className="menu-grid" aria-label="Menu">
            {menu.map((item) => {
              const portions = portionsText(item);
              const inOrder = draft.get(item.id);
              return (
                <li key={item.id} className="panel menu-card">
                  <h2 className="menu-card__name">{item.name}</h2>
                  <p className={`menu-card__portions menu-card__portions--${portions.tone}`}>{portions.text}</p>
                  <div className="menu-card__footer">
                    <span className="menu-card__in-order">{inOrder ? `${inOrder} in order` : ''}</span>
                    {item.availablePortions === 0 ? (
                      <button type="button" className="btn btn--disabled" disabled>
                        Unavailable
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--outline"
                        onClick={() => change(item, 1)}
                        disabled={inOrder === item.availablePortions}
                        aria-label={`Add ${item.name}`}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <section className="panel" aria-labelledby="my-open-orders">
            <h2 id="my-open-orders" className="panel__title">
              My open orders
            </h2>
            <ul className="row-list">
              {openOrders.map((order) => (
                <li key={order.id} className="row-list__row">
                  <strong>#{order.orderNumber}</strong>
                  <span className="muted">Table {order.tableLabel}</span>
                  <span className="row-list__grow">
                    {order.items.map((line) => `${line.quantity}× ${line.menuItemName}`).join(', ')}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <span className="row-list__action">
                    {order.status === 'PENDING' ? (
                      <button type="button" className="btn btn--outline-muted" disabled title="Not connected in this build">
                        Cancel
                      </button>
                    ) : (
                      <span className="muted small">Ask a manager to cancel</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="panel split__side" aria-labelledby="current-order">
          <div className="panel__title-row">
            <h2 id="current-order" className="panel__title panel__title--large">
              Current order
            </h2>
            <span className="muted">Table {SAMPLE_DRAFT.tableLabel}</span>
          </div>
          {draftLines.length === 0 ? (
            <p className="muted">No dishes added.</p>
          ) : (
            <ul className="draft-list">
              {draftLines.map((item) => (
                <li key={item.id} className="draft-list__row">
                  <span className="row-list__grow">{item.name}</span>
                  <button type="button" className="qty-btn" onClick={() => change(item, -1)} aria-label={`Remove one ${item.name}`}>
                    −
                  </button>
                  <strong className="draft-list__qty">{draft.get(item.id)}</strong>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => change(item, 1)}
                    disabled={draft.get(item.id) === item.availablePortions}
                    aria-label={`Add one ${item.name}`}
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="btn btn--primary btn--block" disabled>
            Send to kitchen
          </button>
          <p className="small muted">
            Sending is not connected in this build. In the application, the order is sent only if every dish can
            be made (otherwise 409 INSUFFICIENT_STOCK and nothing is reserved).
          </p>
        </aside>
      </div>
    </SampleDataPage>
  );
}
