import { useMemo, useState } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import { sampleInventory } from '../../api/mock/sampleScreens';
import type { InventoryItem } from '../../api/types';
import { CellLabel } from '../../components/CellLabel';
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
        {/* Explicit roles keep the table semantics when narrow screens show the rows as cards. */}
        {visible.length === 0 ? (
          <p className="muted panel__footnote">No ingredients match this filter.</p>
        ) : (
          <table className="table table--stack table--stack-wide" role="table">
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader">
                  Ingredient
                </th>
                <th scope="col" role="columnheader">
                  Unit
                </th>
                <th scope="col" role="columnheader" className="num">
                  On hand <span className="table__sub">physical</span>
                </th>
                <th scope="col" role="columnheader" className="num">
                  Reserved <span className="table__sub">pending orders</span>
                </th>
                <th scope="col" role="columnheader" className="num">
                  Available <span className="table__sub">on hand − reserved</span>
                </th>
                <th scope="col" role="columnheader" className="num">
                  Threshold
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
              {visible.map((item) => (
                <tr key={item.ingredientId} role="row">
                  <th scope="row" role="rowheader" className="table__plain table__title">
                    {item.ingredientName}
                  </th>
                  <td role="cell" className="muted">
                    <CellLabel>Unit</CellLabel>
                    {item.unit}
                  </td>
                  <td role="cell" className="num">
                    <CellLabel>On hand (physical)</CellLabel>
                    {numberFormat.format(item.onHand)}
                    <span className="cell-unit" aria-hidden="true">
                      {item.unit}
                    </span>
                  </td>
                  <td role="cell" className="num muted">
                    <CellLabel>Reserved (pending orders)</CellLabel>
                    {numberFormat.format(item.reserved)}
                    <span className="cell-unit" aria-hidden="true">
                      {item.unit}
                    </span>
                  </td>
                  <td role="cell" className="num">
                    <CellLabel>Available (on hand − reserved)</CellLabel>
                    <strong>{numberFormat.format(item.available)}</strong>
                    <span className="cell-unit" aria-hidden="true">
                      {item.unit}
                    </span>
                  </td>
                  <td role="cell" className="num muted">
                    <CellLabel>Threshold</CellLabel>
                    {numberFormat.format(item.lowStockThreshold)}
                    <span className="cell-unit" aria-hidden="true">
                      {item.unit}
                    </span>
                  </td>
                  <td role="cell">
                    <CellLabel>Status</CellLabel>
                    <StockBadge level={stockLevel(item)} />
                  </td>
                  <td role="cell" className="table__action">
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
        )}
      </section>
    </SampleDataPage>
  );
}
