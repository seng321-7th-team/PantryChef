import { useMemo } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import { todaysSampleOrders } from '../../api/mock/sampleOrders';
import { SampleDataPage } from '../../components/SampleDataPage';
import { OrdersTable } from '../orders/OrdersTable';

/** scr-05c without its 403 banner: the banner is the answer to a late-cancel request, not the default view. */
export function WaiterOrdersPage({ mode }: { mode: OrdersMode }) {
  const orders = useMemo(() => todaysSampleOrders(), []);
  return (
    <SampleDataPage
      title="Orders"
      mode={mode}
      notImplemented="Cancel and Late cancel are not connected in this build."
    >
      <section className="panel panel--flush" aria-labelledby="todays-orders">
        <div className="panel__title-row panel__title-row--padded">
          <h2 id="todays-orders" className="panel__title">
            Today&apos;s orders
          </h2>
          <span className="small muted">Late cancel: only a manager or authorized waiter</span>
        </div>
        <OrdersTable orders={orders} viewer="waiter" />
      </section>
    </SampleDataPage>
  );
}
