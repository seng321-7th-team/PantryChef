# PantryChef Frontend – UI Skeleton

**Task:** S2-32 – Frontend UI Skeleton (stretch goal) · **Owner:** Tuğçe Çevik · **Reviewer:** Bilgesu Nacak
**Status:** Merged into develop via PR #101; issue #100 closed.

React + TypeScript skeleton with a demo role preview, the role menus of the Figma page "03 Screens v2" and one screen per menu entry. The Chef kitchen board works against an orders service (in-memory mock by default, or the API). The waiter and manager screens show read-only Figma sample data. There is no backend, database, sign-in or production security in this build.

## Setup and commands

Requirements: Node.js and npm. This delivery was built and checked with Node.js 24.19.0 and npm 11.17.0. The repository-wide Node.js version is pinned later (`.nvmrc`, ADR-011); this folder does not set it.

```bash
cd frontend
npm ci
npm run dev        # http://127.0.0.1:5173
npm run typecheck
npm run lint
npm test
npm run build      # output in frontend/dist
```

## Screens

Open `http://127.0.0.1:5173/` and choose a role. The address keeps the screen (for example `#/manager/inventory`), so a screen can be opened directly.

| Role | Menu entry | Address | Figma frame | What works in this build |
|---|---|---|---|---|
| – | Demo role preview | `#/` | prototype role buttons of `scr-01-login` | Choose Waiter, Chef or Manager. No sign-in form. |
| Waiter | New order | `#/waiter/new-order` | `scr-02a` | Menu with portions available, current order (add, −, +) kept on the page only, My open orders. Send to kitchen and Cancel are disabled. |
| Waiter | Orders | `#/waiter/orders` | `scr-05c` (without its 403 banner) | Today's orders. Cancel and Late cancel are disabled. |
| Chef | Kitchen | `#/chef/kitchen` | `scr-03a` – `scr-03e` | Kitchen board with the orders service (see "Kitchen board behavior"). |
| Manager | Inventory | `#/manager/inventory` | `scr-04a`, `scr-04d` – `scr-04f` | Stock table, low-stock banner, Low stock only filter. New ingredient works against an in-memory mock (see "New ingredient"). History, Edit and Adjust are disabled. |
| Manager | Recipes | `#/manager/recipes` | `scr-06a` | Menu items, current recipe, version history; selecting a menu item works. New menu item and Edit recipe are disabled. |
| Manager | Orders & audit | `#/manager/orders` | `scr-05a` | Today's orders with recipe versions and the audit log. Cancel and Late cancel are disabled. |
| Manager | Staff permissions | `#/manager/staff` | `scr-08a` (start state) | Active waiters and the late-cancel setting of Deniz Yilmaz. The toggle is disabled; nothing is saved. |

An unknown address shows "Page not found" with a link to the role choice. Dialogs, error and result frames of Figma (for example `scr-04b`, `scr-05d`, `scr-06c`, `scr-04j`) are states of these screens and are not built yet, except New ingredient (`scr-04d` – `scr-04f`).

**Demo role preview.** The role is read from the address. It is not a sign-in: no account, password or permission is checked, and nothing is stored. "Change role" returns to the role choice. Hiding a screen in the UI is not access control; the API checks every request (ADR-006).

**Narrow screens (900 px and below).** The role menu, the role name, the data source and "Change role" move into a panel behind a "Menu" button. The panel closes with Escape (focus returns to the button), when a link is chosen, or on a click outside the header. On New order, the current order becomes a bar at the bottom of the screen with the table and a "Show order (N dishes)" button; the opened list scrolls inside the bar and closes with Escape. The page keeps space for the bar, so the last menu card and its button are not covered. The −, + and Add buttons of the current order are at least 44 × 44 px. Above 900 px the header and the New order layout are unchanged except for these larger buttons. The kitchen board has its own widths (three columns from 1024 px, two from 641 to 1023 px, tabs at 640 px and below), described under "Kitchen board behavior"; the list screens and Recipes are described below.

**Narrow screens: lists and recipes.** The order tables (Waiter Orders, Manager Orders & audit) and the staff table show each row as a labelled card at 640 px and below; the inventory table does so below 820 px. Each card shows the same fields as the table row, with a visible field name, and the inventory amounts also show their unit. The table markup stays the same, with explicit table roles, so screen readers still get the column headers; the visible field names and units are hidden from them to avoid reading them twice. Item lines of an order are listed one per line on cards and joined with commas in the table. The audit log follows the order list. On Recipes, at 900 px and below, the menu item list is replaced by one "Menu item" select, so the selected recipe is directly below it; wider screens keep the list. Disabled actions stay disabled.

**Shared parts.** One header with the role menu (64 px bar, 44 px items, light-blue selected item, from the Figma navigation component), shared panels, tables, badges and buttons. Colors, spacing and type sizes are taken from the Figma frames and kept in `src/styles/tokens.css`. Inter is not bundled; the system font is used when Inter is not installed.

## Data modes

| Mode | Setting | Kitchen board | Waiter and manager screens |
|---|---|---|---|
| `mock` (default) | `VITE_ORDERS_MODE=mock` | In-memory sample orders #1039–#1043 (Pending 3 / Preparing 1 / Ready 1). `?mock=empty`, `?mock=many` (130 extra Pending orders) and `?mock=list-error` select other data sets. | Read-only sample data from the Figma frames (`src/api/mock/sampleScreens.ts`, `todaysSampleOrders()`). New ingredient uses the in-memory ingredients mock, which starts with the same sample ingredients (`sampleIngredients()`). |
| `http` | `VITE_ORDERS_MODE=http`, `VITE_API_BASE_URL=/v1` | Calls the API. The bearer token comes from `getDemoAccessToken()`, which returns no token in this build, so a real API is expected to answer `401`. This was not tested: no API runs yet. | "This screen is not connected to the API yet." No fallback to sample data. There is no ingredients adapter yet, so New ingredient is not offered. |

Copy `.env.example` to `.env.local` to change the mode. An unknown mode or scenario shows a configuration error; http mode never falls back to mock data.

The sample screens are independent, like the Figma scenarios: a change on the kitchen board does not change the order lists of the waiter or manager screens.

The mock service follows the status transitions and error shapes of the API contract. It does not model stock, reservations, transactions or concurrency. Passing tests in mock mode are not evidence for backend stock, transaction, concurrency or exactly-once behavior.

## API contract comparison

Compared with `api/openapi.yaml` 0.2.1 on `develop` at `7270d63` (20 Nov 2026), field by field. The API folder is unchanged on `develop` at `4227056` (21 Nov 2026).

- **Requests used:** `GET /orders` (`status`, `sort`, `page`, `size`) and `PATCH /orders/{orderId}/status` with an `Idempotency-Key` header and `OrderStatusUpdate` body. Parameters, body, response schemas and error format match the contract. The header is optional on this operation in the contract; the board always sends it.
- **Changed in `src/api/types.ts`:** `Order` now has the optional `preparationStartedAt` and `readyAt`; `Problem` has the optional `shortages` (`StockShortage[]`). The board does not use them yet.
- **Kept on purpose:** `Problem.code` is a string, not the `ErrorCode` union, so an unknown code is still shown.
- **Sample-data types** (`User`, `MenuItem`, `Recipe`, `RecipeLine`, `InventoryItem`, `AuditLogEntry`) use the contract's names and required fields. No request for them exists yet.
- **Ingredient types** (`IngredientCreate`, `Ingredient`) were added from `api/openapi.yaml` 0.2.1 on `develop` at `ad4a654` (25 Nov 2026) for `POST /ingredients`. Only the in-memory mock uses them; no ingredient request is sent.
- **Not in the contract, so not invented:** a "created by me" filter for My open orders, the keys of `AuditLogEntry.details` (the audit lines show the Figma text as sample display text), and ingredient lines for recipes other than Menemen (not drawn in Figma).

## Sources

| Source | Version used |
|---|---|
| ADR-001 (React + TypeScript, Accepted), ADR-006 (roles and permissions), ADR-010 (polling), ADR-011 (version pinning, Proposed) | `develop` at `4227056` |
| API contract | `api/openapi.yaml` 0.2.1, compared at `7270d63`; unchanged at `4227056` |
| Figma frames, colors, spacing and copy | Page "03 Screens v2", export of 20 Nov 2026 (PR #71, merged as `ca96339`) |
| Chef flows U3/U4 | PR #70 |
| Scope and evidence limits | PR #50, issue #48 |

**Team decision and development tools.** React with TypeScript is the team decision (ADR-001, Accepted). The other tools of this folder and all exact versions are development choices of this skeleton: Vite 8.3.8, Vitest 5.1.1 with jsdom and Testing Library, ESLint 10.15.0 with typescript-eslint 8.73.0, TypeScript 6.0.3, React 19.3.1, plain CSS. On 21 Nov 2026 the technical lead (Ayşe Dural) replied informally that the task owner may continue with the tools she prefers. The reply did not name or review specific tools or versions, and it is not an ADR or a written team record. Version pinning for the project stays with the Sprint 3 skeleton (ADR-011, Proposed). TypeScript 7 is not used because typescript-eslint 8.73.0 supports TypeScript below 6.1. No router, UI library, CSS framework or state package is used; screen changes use the location hash. Exact versions are in `package.json` and `package-lock.json`.

## Kitchen board behavior

- Each refresh sends three requests: `GET /orders?status=PENDING|PREPARING&sort=createdAt&page=1&size=100` and `GET /orders?status=READY&sort=-createdAt&page=1&size=100`. The three responses are separate reads, not one atomic server snapshot.
- Counters show `page.totalItems` of each response. When a column has more orders than its first page, it shows "Showing X of Y".
- Polling every 20 s (ADR-010 range 15–30 s). At most one refresh group runs at a time; a request made during a refresh runs after it. Timers and requests stop when the board closes, including when another screen is opened.
- Start preparing is offered on every Pending order and Mark as ready on every Preparing order. The Figma demo limit "#1042 only" is not applied. During a change only that card is locked ("Deducting stock…" or "Marking as ready…").
- A successful change moves the card and both counters at once, then the board re-reads the server. A list response that started before the change is discarded.
- Each status change uses a new `Idempotency-Key`. When the result is unknown (no response, a 5xx answer, or a 2xx answer whose body cannot be read as JSON), the card offers a retry that sends the same key and body, and the board refreshes. If the refresh shows that the change was applied, the retry is removed. A 4xx answer is a definite rejection and is not offered as a retry with the same key. There is no automatic retry.
- `409 INVALID_STATUS_TRANSITION` shows a warning ("Order #N was already started", or "could not be marked as ready") and reloads the board.
- A failed refresh keeps the cards and shows the time of the last successful update. A failed first load shows an error state with Retry instead. The "Last updated" time changes only on a successful refresh, and the warning disappears with the next successful refresh.
- After a status change that the server confirms with the requested status, a short message under the title says "Order #N moved to Preparing." or "Order #N moved to Ready." It is a polite live region in the page flow: it does not move focus, change the chosen tab or cover cards. Refreshes and width changes do not set or repeat it; the next status change clears it. A failed, rejected or unknown result, an unreadable 2xx answer, or a 2xx answer with another status shows no such message.
- Keyboard focus after a status change: while the request runs the button is disabled and the browser drops its focus. When the request ends, focus goes back to the card's button if the card is still in its column, otherwise to the next card's button in the same column, the previous one, and then the selected status tab (narrow screens) or the column heading. This happens only after the user's own action and only if focus is still on the page itself; if the user focused or clicked something else, focus stays there. Refreshes and width changes alone do not move focus, and the success message never takes focus.
- Layout by width: from 1024 px the three columns are side by side. From 641 to 1023 px Pending and Preparing are side by side and Ready is below them at full width. At 640 px and below, Pending, Preparing and Ready are tabs (Pending first) and only the chosen column is shown. Each tab shows the same counter as its column (`page.totalItems`). Arrow keys, Home and End move between the tabs. Only the user changes the chosen tab: polling and card actions keep it, and an emptied column shows "No orders". The tabs stay at the top of the screen while the list scrolls. Every width uses the same board data, polling and card actions, so a change of width keeps the cards, the counters and a running status change.

## New ingredient (S3-34, issue #135)

First part of S3-34. It works in mock mode only: the form calls `IngredientsService.createIngredient` with the `POST /ingredients` body, and the only implementation is an in-memory mock (`src/api/mock/mockIngredientsService.ts`). No HTTP request is sent. The HTTP adapter comes after the shared HTTP client (#134).

- **Form** (`scr-04d`): Name, Unit (`g`, `ml`, `piece`; `g` first, as in Figma) and Low-stock threshold, whose label shows the chosen unit. There is no stock field: the contract creates the stock record with on hand 0 and reserved 0, and opening stock is a separate `INITIAL_STOCK` adjustment.
- **Dialog**: a native modal `<dialog>`. Focus starts in Name, the page behind it is inert, and Escape or Cancel closes it without sending anything. Focus then returns to "+ New ingredient", and the next opening starts empty.
- **While the request runs**: the button says "Creating…" and keeps focus, the fields are read-only, and Cancel and Escape do nothing. A second click or Enter sends no second request. A browser may still close a modal dialog on a repeated Escape; if the request then fails, the dialog opens again with the error.
- **Success**: the dialog closes, the returned ingredient is added to the table with 0 on hand, reserved and available (badge Out), "Bulgur created. It starts with 0 stock." is announced, and focus returns to "+ New ingredient". The app keeps the created ingredients for as long as it keeps the mock service, so the row is still listed after going to another screen and back, and the same name gives the duplicate message. Both are cleared when the app is reloaded; nothing is stored in the browser.
- **Errors**: the entered values stay. `409 DUPLICATE_RESOURCE` shows "An ingredient with this name already exists." under Name (`scr-04f`). Field errors in the Problem `errors[]` show under the field when `field` is exactly `name`, `unit` or `lowStockThreshold`; other spellings are listed above the form, because the contract only calls `field` a JSON path. No answer, a 5xx answer or an unreadable answer says the ingredient may have been created, and that a repeat finds out through the duplicate-name message, because `POST /ingredients` has no Idempotency-Key and names are unique in the contract. The inventory list cannot settle this: it is sample data plus this session's results, not `GET /inventory`. Showing the real list after an uncertain create needs the inventory API, which is a later S3-34 step. Other answers (for example 401 or 403) show the server's text and code. The first field with a message gets focus, otherwise the Create button.
- **Mock**: it starts with the sample ingredients, which stay in `sampleScreens.ts`. It does not check the values. It only rejects a name that already exists, compared exactly as typed, because the contract does not say whether case or spaces count. Mock successes are not evidence of server-side validation or of the real API.

**Validation (S3-05, not done yet).** `validateIngredientForm` in `src/features/manager/ingredientForm.ts` is the extension point for Burcu's separate PR, and it returns no errors yet. The form calls it on submit with the raw values (the threshold is the input text). Each returned message is shown under its field, the first invalid field gets focus, and nothing is sent while any message is returned. Server messages use the same place.

**Payload safeguard.** Apart from that hook, the form makes one check of its own, and it is not input validation: the threshold must become a finite JSON number before a body can be built. An empty or non-finite threshold is not turned into 0 or NaN; no request is sent and the field shows "Enter the low-stock threshold as a number." A message from the S3-05 validator for the threshold replaces it. Name and unit are sent as typed, and business rules such as an empty name or a negative threshold are left to S3-05 and the API.

## Checks of this delivery (20–21 Nov 2026)

- `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` (49 tests: 38 kitchen board and service tests, 11 for routes, role menus, page changes and the sample screens) and `npm run build` pass after the retry fix (21 Nov). Before the fix, the same checks passed with 42 tests, also after merging `develop` at `4227056`.
- The retry tests use the HTTP adapter with stubbed `fetch` responses and the in-memory mock service. They check how the client classifies results and which key and body it sends; they do not test a real backend, stock changes or concurrency.
- The eight screens were opened in Chrome at 1280 × 800 and at 390 px width (no page-level horizontal scroll) and compared with the Figma exports. No browser console errors.
- Manual check by the task owner in the browser (mock mode): Waiter, Chef and Manager screens; no issues found. This check was made before the narrow-screen changes below.
- Narrow-screen changes (21 Nov): `npm run typecheck`, `npm run lint`, `npm test` (52 tests: 38 kitchen board and service tests, 14 for routes, role menus, the Menu panel, the current-order bar and the sample screens) and `npm run build` pass. In headless Chrome all eight screens were opened at 320, 360, 390, 430, 768, 1024, 1280 and 1440 px width and at 844 × 390 and 568 × 320: no page-level horizontal scroll, the header is one row up to 900 px, and on New order the bottom bar does not cover the last menu card. The Menu panel and the order bar were used with the keyboard (Enter, Tab, Escape). At 1024, 1280 and 1440 px a pixel comparison with the previous build differed only at the − and + buttons. Safe-area insets were not tested on a real phone. The task owner's later manual check is listed below.
- Kitchen board layout (21 Nov): `npm run typecheck`, `npm run lint`, `npm test` (56 tests: 42 kitchen board and service tests, 14 for routes, role menus, the Menu panel, the current-order bar and the sample screens) and `npm run build` pass. The new tests cover the tabs through the #1042 flow (3/1/1 → 2/2/1 → 2/1/2), the keyboard, an emptied column during polling, and a width change during a running status change; they also check that tab changes and width changes send no extra requests. In headless Chrome (mock mode) the board was opened at 320, 360, 390, 430, 768, 1024, 1280 and 1440 px width and at 844 × 390 and 568 × 320: no page-level horizontal scroll, the tabs are at least 48 px high, and long dish names wrap inside the card. At 390 px the #1042 flow gave 3/1/1 → 2/2/1 → 2/1/2, the chosen tab stayed selected, and #1042 appeared once in its new column. A width change to 1280 px and back during "Deducting stock…" kept the locked card and the chosen tab. With 133 Pending orders (`?mock=many`) the tabs stayed at the top and did not cover the focused button during 25 Tab presses. The error state with Retry (`?mock=list-error`) and the empty state (`?mock=empty`) were shown at 390 px. The menu, the order bar and the desktop side panel were checked again with the same results as above. The task owner's later manual check is listed below.
- List screens and recipes (21 Nov): `npm run typecheck`, `npm run lint`, `npm test` (60 tests: 42 kitchen board and service tests, 18 for routes, role menus, the Menu panel, the current-order bar and the sample screens) and `npm run build` pass. The new tests check that the inventory column headers and plain cell values stay available to screen readers, that order item lines are listed separately with the cancel actions disabled, and that the recipe list (wide) and the recipe select (narrow) both update the recipe details and version history. In headless Chrome (mock mode) Inventory, Waiter Orders, Manager Orders & audit, Staff permissions and Recipes were opened at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440 px: no page-level or panel-level horizontal scroll, and no visible button, link or select under 44 px. At 1024 px and wider the tables keep their columns and widths. At 390 px Low stock only showed the three low-stock rows and showed all eight again when turned off; the recipe select changed the details when an option was chosen and with the arrow keys. Long names, large numbers and an order with eight item lines (added in the page only, not in the sample data) stayed inside the cards at 320 px. The Chrome accessibility tree of the inventory cards still showed table, column headers, row headers and cells. The menu, the order bar and the kitchen board were checked again with the same results as above. Not checked: a real phone or a screen reader.
- Manual visual check by the task owner (21 Nov): the mobile and desktop screenshots of these screens, including the mobile audit log, showed no clear layout problem. This was a visual check of the shared screenshots, not a test on every device or on real phones.
- Empty filter result (21 Nov): when Low stock only matches no ingredient, the Stock panel shows "No ingredients match this filter." instead of the table, and turning the filter off shows all rows again. The sample data always has low-stock rows, so this state is covered by a unit test that reads the same rows with no row below its threshold; it was not opened in the browser. `npm run typecheck`, `npm run lint`, `npm test` (61 tests) and `npm run build` pass.
- Kitchen feedback (21 Nov): `npm run typecheck`, `npm run lint`, `npm test` (68 tests) and `npm run build` pass. The new tests cover the two move messages, no repeat during polls and width changes, no message after a rejected, network-failed or unreadable 2xx change or a 2xx answer with another status, and a refresh failure that keeps the cards and the last update time and clears on recovery. In headless Chrome (mock mode) at 320, 390 and 1280 px the message appeared after Start preparing and Mark as ready on #1042, did not overlap the tabs, cards or buttons, and kept the chosen tab; at 390 px it did not change during a 20 s poll and a width change. The refresh-failure warning was not opened in the browser, because the mock data sets cannot fail a later refresh; it is covered by the unit tests only.
- Kitchen keyboard focus (21 Nov): `npm run typecheck`, `npm run lint`, `npm test` (74 tests) and `npm run build` pass. The new tests cover the next card, the previous card and the column heading (wide), the selected tab (narrow), a failed change that keeps the card, a user who focuses another card or clicks elsewhere during the request, and polls and width changes without a status change. In headless Chrome at 390 and 1280 px, using Enter on the action buttons: #1042 → focus on #1043, then #1040, then the Pending tab (390 px) or the Pending heading (1280 px), with a visible focus ring; a 20 s poll did not move focus; a click on the page title during the request left focus there. Not checked: a real screen reader, and a failed change in the browser (the mock data sets cannot make an update fail).
- Manual check by the task owner (21 Nov, after the narrow-screen changes): a visual check of shared mobile, tablet and desktop screenshots showed no clear layout problem. On the kitchen board, Enter on the focused #1042 button moved focus to the #1043 button when the change ended, and Pending stayed selected. This was not a test on every device, on real phones or with a screen reader.
- These checks cover the UI in mock mode only. No API, authentication, authorization, concurrency or performance test was run.

## Limits of this delivery

- Only the kitchen board sends requests. Waiter and manager screens are read-only sample data; their actions are disabled and say so, except New ingredient, which uses the in-memory mock.
- Only the first page of each kitchen column is loaded; there is no paging.
- The Ready column shows all READY orders from the first page, newest created first. Which Ready orders the board should show is an open product question.
- No sign-in, sign-out, session or token storage (demo role preview only). Real authentication (`POST /auth/login`, bearer token) and the backend do not exist yet; in http mode the kitchen board sends no token, so a real API is expected to answer `401` (not tested).
- Not built yet: dialogs and results (adjust stock, edit ingredient, deactivate, cancel, late cancel, publish recipe, new menu item), inventory history (`scr-04j`, `scr-04k`), the common states of `scr-07a` outside the kitchen board, and the "Preview as" switch of the prototype.
- No Docker, CI job or coverage gate is added.

## Remaining work (proposal)

1. Connect the waiter and manager screens to the API one at a time (orders list, inventory, recipes, audit log, users), each with loading, empty and error states.
2. Build the dialogs and result states as states of the existing screens, starting with stock adjustment and order cancellation.
3. Inventory history (D-3), new menu item (D-4) and saving the late-cancel permission (D-6) after the open API questions in PR #50 section 7b are answered.
4. Sign-in and session handling (`POST /auth/login`) once the backend exists.

## Open decisions

| Decision | Owner |
|---|---|
| Written team record of the frontend tools above (general go-ahead from the technical lead on 21 Nov; tools and versions not reviewed) | Ayşe Dural |
| Ready column scope and the three-request refresh | Burcu Ücük (product), Ayşe Dural (API) |
| Node.js version pin and frontend CI job | Emre Boz (ADR-011, Sprint 3 readiness) |
| Idempotency-Key on status changes (ADR-005 Proposed) | Ayşe Dural |
| "My open orders" filter (no "created by me" filter in the API) | Ayşe Dural |
| Ingredient names: case and surrounding spaces in the unique check, the `FieldError.field` format, and 400 or 422 for invalid values (S3-37A) | Ayşe Dural, Tuğçe Çevik |
| New ingredient input rules, including the default unit and decimal thresholds (S3-05) | Burcu Ücük |
