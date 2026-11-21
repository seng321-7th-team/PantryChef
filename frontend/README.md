# PantryChef Frontend – UI Skeleton

**Task:** S2-32 – Frontend UI Skeleton (stretch goal) · **Owner:** Tuğçe Çevik · **Reviewer:** Ayşe Dural
**Status:** Draft for team review (issue #100). Not merged.

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
| Manager | Inventory | `#/manager/inventory` | `scr-04a` | Stock table, low-stock banner, Low stock only filter. History, New ingredient, Edit and Adjust are disabled. |
| Manager | Recipes | `#/manager/recipes` | `scr-06a` | Menu items, current recipe, version history; selecting a menu item works. New menu item and Edit recipe are disabled. |
| Manager | Orders & audit | `#/manager/orders` | `scr-05a` | Today's orders with recipe versions and the audit log. Cancel and Late cancel are disabled. |
| Manager | Staff permissions | `#/manager/staff` | `scr-08a` (start state) | Active waiters and the late-cancel setting of Deniz Yilmaz. The toggle is disabled; nothing is saved. |

An unknown address shows "Page not found" with a link to the role choice. Dialogs, error and result frames of Figma (for example `scr-04b`, `scr-05d`, `scr-06c`, `scr-04j`) are states of these screens and are not built yet.

**Demo role preview.** The role is read from the address. It is not a sign-in: no account, password or permission is checked, and nothing is stored. "Change role" returns to the role choice. Hiding a screen in the UI is not access control; the API checks every request (ADR-006).

**Shared parts.** One header with the role menu (64 px bar, 44 px items, light-blue selected item, from the Figma navigation component), shared panels, tables, badges and buttons. Colors, spacing and type sizes are taken from the Figma frames and kept in `src/styles/tokens.css`. Inter is not bundled; the system font is used when Inter is not installed.

## Data modes

| Mode | Setting | Kitchen board | Waiter and manager screens |
|---|---|---|---|
| `mock` (default) | `VITE_ORDERS_MODE=mock` | In-memory sample orders #1039–#1043 (Pending 3 / Preparing 1 / Ready 1). `?mock=empty`, `?mock=many` (130 extra Pending orders) and `?mock=list-error` select other data sets. | Read-only sample data from the Figma frames (`src/api/mock/sampleScreens.ts`, `todaysSampleOrders()`). |
| `http` | `VITE_ORDERS_MODE=http`, `VITE_API_BASE_URL=/v1` | Calls the API. The bearer token comes from `getDemoAccessToken()`, which returns no token in this build, so a real API is expected to answer `401`. This was not tested: no API runs yet. | "This screen is not connected to the API yet." No fallback to sample data. |

Copy `.env.example` to `.env.local` to change the mode. An unknown mode or scenario shows a configuration error; http mode never falls back to mock data.

The sample screens are independent, like the Figma scenarios: a change on the kitchen board does not change the order lists of the waiter or manager screens.

The mock service follows the status transitions and error shapes of the API contract. It does not model stock, reservations, transactions or concurrency. Passing tests in mock mode are not evidence for backend stock, transaction, concurrency or exactly-once behavior.

## API contract comparison

Compared with `api/openapi.yaml` 0.2.1 on `develop` at `7270d63` (20 Nov 2026), field by field. The API folder is unchanged on `develop` at `4227056` (21 Nov 2026).

- **Requests used:** `GET /orders` (`status`, `sort`, `page`, `size`) and `PATCH /orders/{orderId}/status` with an `Idempotency-Key` header and `OrderStatusUpdate` body. Parameters, body, response schemas and error format match the contract. The header is optional on this operation in the contract; the board always sends it.
- **Changed in `src/api/types.ts`:** `Order` now has the optional `preparationStartedAt` and `readyAt`; `Problem` has the optional `shortages` (`StockShortage[]`). The board does not use them yet.
- **Kept on purpose:** `Problem.code` is a string, not the `ErrorCode` union, so an unknown code is still shown.
- **Sample-data types** (`User`, `MenuItem`, `Recipe`, `RecipeLine`, `InventoryItem`, `AuditLogEntry`) use the contract's names and required fields. No request for them exists yet.
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
- A failed refresh keeps the cards and shows the time of the last successful update.

## Checks of this delivery (20–21 Nov 2026)

- `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` (49 tests: 38 kitchen board and service tests, 11 for routes, role menus, page changes and the sample screens) and `npm run build` pass after the retry fix (21 Nov). Before the fix, the same checks passed with 42 tests, also after merging `develop` at `4227056`.
- The retry tests use the HTTP adapter with stubbed `fetch` responses and the in-memory mock service. They check how the client classifies results and which key and body it sends; they do not test a real backend, stock changes or concurrency.
- The eight screens were opened in Chrome at 1280 × 800 and at 390 px width (no page-level horizontal scroll) and compared with the Figma exports. No browser console errors.
- Manual check by the task owner in the browser (mock mode): Waiter, Chef and Manager screens; no issues found.
- These checks cover the UI in mock mode only. No API, authentication, authorization, concurrency or performance test was run.

## Limits of this delivery

- Only the kitchen board sends requests. Waiter and manager screens are read-only sample data; their actions are disabled and say so.
- Only the first page of each kitchen column is loaded; there is no paging.
- The Ready column shows all READY orders from the first page, newest created first. Which Ready orders the board should show is an open product question.
- No sign-in, sign-out, session or token storage (demo role preview only). Real authentication (`POST /auth/login`, bearer token) and the backend do not exist yet; in http mode the kitchen board sends no token, so a real API is expected to answer `401` (not tested).
- Not built yet: dialogs and results (adjust stock, new ingredient, edit ingredient, deactivate, cancel, late cancel, publish recipe, new menu item), inventory history (`scr-04j`, `scr-04k`), the common states of `scr-07a` outside the kitchen board, and the "Preview as" switch of the prototype.
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
