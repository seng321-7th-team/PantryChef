import { useMemo } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import { todaysSampleOrders } from '../../api/mock/sampleOrders';
import { sampleAuditLog } from '../../api/mock/sampleScreens';
import { SampleDataPage } from '../../components/SampleDataPage';
import { OrdersTable } from '../orders/OrdersTable';

const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

/** scr-05a-orders-and-audit. The "Preview as" switch of the prototype is not part of this screen. */
export function OrdersAuditPage({ mode }: { mode: OrdersMode }) {
  const orders = useMemo(() => todaysSampleOrders(), []);
  const audit = useMemo(() => sampleAuditLog(), []);

  return (
    <SampleDataPage
      title="Orders & audit log"
      mode={mode}
      notImplemented="Cancel and Late cancel are not connected in this build."
    >
      <div className="split split--orders">
        <section className="panel panel--flush split__main" aria-labelledby="todays-orders">
          <h2 id="todays-orders" className="panel__title panel__title--padded">
            Today&apos;s orders
          </h2>
          <OrdersTable orders={orders} viewer="manager" showRecipeVersions />
        </section>

        <section className="panel panel--flush split__side" aria-labelledby="audit-log">
          <h2 id="audit-log" className="panel__title panel__title--padded">
            Audit log
          </h2>
          <ul className="audit-list">
            {audit.map(({ entry, subject, summary, actorRole }) => (
              <li key={entry.id} className="audit-list__row">
                <p className="audit-list__meta">
                  <span>
                    {time.format(new Date(entry.occurredAt))} · {actorRole} · {entry.actor.username}
                  </span>
                  <span>{subject}</span>
                </p>
                <p className="audit-list__action">{entry.action}</p>
                <p className="audit-list__summary">{summary}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SampleDataPage>
  );
}
