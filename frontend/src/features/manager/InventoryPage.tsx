import { useMemo, useState } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import { sampleInventory } from '../../api/mock/sampleScreens';
import type { InventoryItem } from '../../api/types';
import { SampleDataPage } from '../../components/SampleDataPage';
import { StockBadge, type StockLevel } from '../../components/StatusBadge';

const numberFormat = new Intl.NumberFormat('en-US', { useGrouping: false });

function stockLevel(item: InventoryItem): StockLevel {
  if (item.available === 0) return 'OUT';
  return item.lowStock ? 'LOW' : 'OK';
}

/** scr-04a-inventory. The Low stock only filter works on the page; changes to stock are not connected. */
export function InventoryPage({ mode }: { mode: OrdersMode }) {
  const items = useMemo(() => sampleInventory(), []);
  const [lowOnly, setLowOnly] = useState(false);
  const alerts = items.filter((item) => item.ingredientActive && item.lowStock);
  const visible = lowOnly ? alerts : items;

  return (
    <SampleDataPage
      title="Inventory"
      mode={mode}
      notImplemented="History, New ingredient, Edit and Adjust are not connected in this build."
      actions={
        <>
          <button type="button" className="btn btn--outline-quiet" disabled title="Not connected in this build">
            History
          </button>
          <button
            type="button"
            className="btn btn--outline-muted"
            aria-pressed={lowOnly}
            onClick={() => setLowOnly((value) => !value)}
          >
            Low stock only
          </button>
          <button type="button" className="btn btn--primary" disabled title="Not connected in this build">
            + New ingredient
          </button>
        </>
      }
    >
      {alerts.length > 0 ? (
        <div className="alert-banner" role="status">
          <strong>
            {alerts.length} ingredient{alerts.length === 1 ? '' : 's'} at or below their low-stock threshold
          </strong>
          <span>{alerts.map((item) => item.ingredientName).join(', ')}</span>
        </div>
      ) : null}

      <section className="panel panel--flush" aria-label="Stock">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Ingredient</th>
              <th scope="col">Unit</th>
              <th scope="col" className="num">
                On hand <span className="table__sub">physical</span>
              </th>
              <th scope="col" className="num">
                Reserved <span className="table__sub">pending orders</span>
              </th>
              <th scope="col" className="num">
                Available <span className="table__sub">on hand − reserved</span>
              </th>
              <th scope="col" className="num">
                Threshold
              </th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.ingredientId}>
                <th scope="row" className="table__plain">
                  {item.ingredientName}
                </th>
                <td className="muted">{item.unit}</td>
                <td className="num">{numberFormat.format(item.onHand)}</td>
                <td className="num muted">{numberFormat.format(item.reserved)}</td>
                <td className="num">
                  <strong>{numberFormat.format(item.available)}</strong>
                </td>
                <td className="num muted">{numberFormat.format(item.lowStockThreshold)}</td>
                <td>
                  <StockBadge level={stockLevel(item)} />
                </td>
                <td className="table__action">
                  <button type="button" className="btn btn--outline-muted" disabled title="Not connected in this build">
                    Edit
                  </button>
                  <button type="button" className="btn btn--outline-muted" disabled title="Not connected in this build">
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SampleDataPage>
  );
}
