import { useMemo, useState } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import { sampleRecipes } from '../../api/mock/sampleScreens';
import { SampleDataPage } from '../../components/SampleDataPage';
import { useMediaQuery } from '../../components/useMediaQuery';

const dateTime = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

function published(iso: string): string {
  const date = new Date(iso);
  return date.toDateString() === new Date().toDateString() ? `Today ${time.format(date)}` : dateTime.format(date);
}

/** Same width at which app.css stacks the list and the details. */
export const COMPACT_RECIPE_PICKER_QUERY = '(max-width: 900px)';

/** scr-06a-recipes. Selecting a menu item works on the page; editing and creating are not connected. */
export function RecipesPage({ mode }: { mode: OrdersMode }) {
  const recipes = useMemo(() => sampleRecipes(), []);
  const [selectedName, setSelectedName] = useState(recipes[0]!.menuItemName);
  const selected = recipes.find((entry) => entry.menuItemName === selectedName) ?? recipes[0]!;
  const current = selected.versions[0]!;
  // Narrow screens stack the list above the details; a select keeps the details close to the top.
  const compactPicker = useMediaQuery(COMPACT_RECIPE_PICKER_QUERY);

  return (
    <SampleDataPage
      title="Recipes"
      mode={mode}
      notImplemented="New menu item and Edit recipe are not connected in this build."
      actions={
        <button type="button" className="btn btn--outline-quiet" disabled title="Not connected in this build">
          New menu item
        </button>
      }
    >
      <div className="split split--recipes">
        <section className="panel panel--flush split__side-left" aria-labelledby="menu-items">
          <h2 id="menu-items" className="panel__title panel__title--padded">
            Menu items
          </h2>
          {compactPicker ? (
            <div className="recipe-picker">
              <label htmlFor="recipe-picker" className="recipe-picker__label">
                Menu item
              </label>
              <select
                id="recipe-picker"
                className="recipe-picker__select"
                value={selected.menuItemName}
                onChange={(event) => setSelectedName(event.target.value)}
              >
                {recipes.map((entry) => (
                  <option key={entry.menuItemName} value={entry.menuItemName}>
                    {entry.menuItemName} · recipe v{entry.versions[0]!.version}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <ul className="select-list">
              {recipes.map((entry) => (
                <li key={entry.menuItemName}>
                  <button
                    type="button"
                    className="select-list__item"
                    aria-pressed={entry.menuItemName === selected.menuItemName}
                    onClick={() => setSelectedName(entry.menuItemName)}
                  >
                    <span>{entry.menuItemName}</span>
                    <span className="tag">recipe v{entry.versions[0]!.version}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="split__main">
          <section className="panel panel--flush" aria-labelledby="recipe-title">
            <div className="panel__title-row panel__title-row--padded">
              <div>
                <h2 id="recipe-title" className="panel__title panel__title--large">
                  {selected.menuItemName} <span className="badge badge--ready">Current: v{current.version}</span>
                </h2>
                <p className="small muted">
                  Last published {published(current.updatedAt)} by {current.updatedBy?.username ?? 'unknown'}
                </p>
              </div>
              <button type="button" className="btn btn--outline-quiet" disabled title="Not connected in this build">
                Edit recipe
              </button>
            </div>
            {current.lines.length > 0 ? (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Ingredient</th>
                      <th scope="col">Unit</th>
                      <th scope="col" className="num">
                        Quantity per portion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.lines.map((line) => (
                      <tr key={line.ingredientId}>
                        <th scope="row" className="table__plain">
                          {line.ingredientName}
                        </th>
                        <td className="muted">{line.unit}</td>
                        <td className="num">
                          <strong>{line.quantity}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="small muted panel__footnote">
                  Each order reserves quantity per portion × ordered quantity of every ingredient in this recipe.
                </p>
              </>
            ) : (
              <p className="muted panel__footnote">
                The ingredient lines of this recipe are not part of the sample data.
              </p>
            )}
          </section>

          <section className="panel" aria-labelledby="version-history">
            <h2 id="version-history" className="panel__title">
              Version history
            </h2>
            <ul className="row-list">
              {selected.versions.map((version) => (
                <li key={version.version} className="row-list__row">
                  <strong>v{version.version}</strong>
                  <span className="muted">
                    {published(version.updatedAt)} · {version.updatedBy?.username ?? 'unknown'}
                  </span>
                  <span className="row-list__grow">
                    {version.current ? 'Used by new orders' : `Kept by existing orders created with v${version.version}`}
                  </span>
                  {version.current ? <span className="badge badge--ready">Current</span> : null}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </SampleDataPage>
  );
}
