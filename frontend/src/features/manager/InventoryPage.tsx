import { useEffect, useMemo, useRef, useState } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import type { IngredientsService } from '../../api/ingredientsService';
import { sampleInventory } from '../../api/mock/sampleScreens';
import type { Ingredient, InventoryItem } from '../../api/types';
import { CellLabel } from '../../components/CellLabel';
import { SampleDataPage } from '../../components/SampleDataPage';
import { StockBadge, type StockLevel } from '../../components/StatusBadge';
import { NewIngredientDialog } from './NewIngredientDialog';

const numberFormat = new Intl.NumberFormat('en-US', { useGrouping: false });

function stockLevel(item: InventoryItem): StockLevel {
  if (item.available === 0) return 'OUT';
  return item.lowStock ? 'LOW' : 'OK';
}

/** `POST /ingredients` creates the stock record with onHand 0 and reserved 0 (api/openapi.yaml). */
function newStockRow(ingredient: Ingredient): InventoryItem {
  return {
    ingredientId: ingredient.id,
    ingredientName: ingredient.name,
    ingredientActive: ingredient.active,
    unit: ingredient.unit,
    onHand: 0,
    reserved: 0,
    available: 0,
    lowStockThreshold: ingredient.lowStockThreshold,
    lowStock: ingredient.active && 0 <= ingredient.lowStockThreshold,
    updatedAt: ingredient.updatedAt,
  };
}

interface InventoryPageProps {
  mode: OrdersMode;
  /** `null` when no ingredients service exists for the mode (http mode in this build). */
  ingredientsService: IngredientsService | null;
  /**
   * Ingredients that `ingredientsService` returned in this app session. The app keeps them for as long
   * as it keeps the service, so a created row is still listed when the user comes back to this screen.
   */
  createdIngredients: readonly Ingredient[];
  onIngredientCreated: (ingredient: Ingredient) => void;
}

/**
 * scr-04a-inventory. The Low stock only filter works on the page. New ingredient uses the ingredients
 * service (mock only in this build). The rows are the sample stock plus the ingredients created in this
 * app session; this build does not read `GET /inventory`. History, Edit and Adjust are not connected.
 */
export function InventoryPage({ mode, ingredientsService, createdIngredients, onIngredientCreated }: InventoryPageProps) {
  const [sampleRows] = useState(() => sampleInventory());
  const items = useMemo(() => [...sampleRows, ...createdIngredients.map(newStockRow)], [sampleRows, createdIngredients]);
  const [lowOnly, setLowOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const newButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const alerts = items.filter((item) => item.ingredientActive && item.lowStock);
  const visible = lowOnly ? alerts : items;

  // Focus goes back to "+ New ingredient" whenever the dialog closes.
  useEffect(() => {
    if (wasOpen.current && !dialogOpen) newButtonRef.current?.focus();
    wasOpen.current = dialogOpen;
  }, [dialogOpen]);

  function handleCreated(ingredient: Ingredient) {
    onIngredientCreated(ingredient);
    setFeedback(`${ingredient.name} created. It starts with 0 stock.`);
    setDialogOpen(false);
  }

  return (
    <SampleDataPage
      title="Inventory"
      mode={mode}
      notImplemented="New ingredient uses an in-memory mock and sends nothing to the API. History, Edit and Adjust are not connected in this build."
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
          <button
            ref={newButtonRef}
            type="button"
            className="btn btn--primary"
            disabled={!ingredientsService}
            onClick={() => {
              setFeedback('');
              setDialogOpen(true);
            }}
          >
            + New ingredient
          </button>
        </>
      }
    >
      {/* Always present, so screen readers announce new text politely. Empty until a create succeeds. */}
      <p className="page-feedback" aria-live="polite" aria-atomic="true">
        {feedback}
      </p>

      {ingredientsService ? (
        <NewIngredientDialog
          open={dialogOpen}
          service={ingredientsService}
          onOpenChange={setDialogOpen}
          onCreated={handleCreated}
        />
      ) : null}

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
