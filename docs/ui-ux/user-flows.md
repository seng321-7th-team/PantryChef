# PantryChef – User Flows

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-30 – User-flow Diagrams
**Owner:** Tuğçe Çevik · **Reviewer:** Ayşe Dural
**Status:** Draft

Frame names (`scr-…`) are the Figma frame names listed in [`docs/ui-ux/figma-links.md`](https://github.com/seng321-7th-team/PantryChef/blob/1a9b1baae5627d7d6cfb16df42bd9b014a1cd916/docs/ui-ux/figma-links.md) (S2-33, PR #71, commit `1a9b1ba`; not on `develop` yet). Rules and error codes come from [`api/openapi.yaml`](../../api/openapi.yaml) (`develop`, version 0.1.0) and [`docs/product-backlog.md`](../product-backlog.md). Where a flow follows API draft PR #62 (current checked head `f061da2`, version 0.2.0, **not merged**), the text says so. Its OpenAPI rules are unchanged from `866122e`/`cb634c3`. Order flow: `PENDING` → `PREPARING` → `READY`. `CANCELLED` is terminal. There is no delivery feature.

Flows only cover what the 31 frames show. Features that the User Stories require but the frames do not show are listed in [`ui-user-story-review.md`](https://github.com/seng321-7th-team/PantryChef/blob/7e4fbde08b14ae2198cc1b865dffe9ec5afe78b4/docs/ui-ux/ui-user-story-review.md) (PR #50, commit `7e4fbde`) and are **not** drawn here.

## Flow list and Figma starting points

The numbers in this document (U1 to U9) are section numbers of this file. They are not the Figma flow numbers. The Figma flow starting points are the ones in [`docs/ui-ux/figma-links.md`](https://github.com/seng321-7th-team/PantryChef/blob/1a9b1baae5627d7d6cfb16df42bd9b014a1cd916/docs/ui-ux/figma-links.md) (PR #71, commit `1a9b1ba`). The eight Mermaid diagrams of the earlier version render on GitHub (checked on 18 Nov). U1a and the revised U2 (added in commit `0e57700`, unchanged since) also render on GitHub with their boxes and arrows (verified manually by Tuğçe on 18 November 2026).

| Section | Flow | Figma flow starting point |
|---|---|---|
| U1 | Waiter creates an order | Flow 1 (login, role button Waiter) |
| U1a | Sign-in errors | Flow 1 starts at `scr-01-login`; `scr-01b` and `scr-01c` are drawn states (see U1a) |
| U2 | Waiter cancels, and late cancel | Flow 1 (login, role button Waiter), then Orders |
| U3 | Chef prepares an order | Flow 2 (`scr-03a-kitchen-board`) |
| U4 | Chef: order already started | Flow 6: kitchen conflict (`scr-03d-kitchen-conflict`) |
| U5 | Manager manages inventory and creates an ingredient | Flow 3 (`scr-04a-inventory`) |
| U6 | Manager: ingredient lifecycle (edit, deactivate, reactivate) | Flow 9: ingredient lifecycle (`scr-04g-inventory-edit-ingredient`) |
| U7 | Manager cancels orders and reads the audit log | Flow 4 (`scr-05a-orders-and-audit`) |
| U8 | Manager edits a recipe | Flow 5 (`scr-06a-recipes`) |
| U9 | Common states | Flow 8: common states (`scr-07a-states`) |

Flow 7: duplicate ingredient (`scr-04f-new-ingredient-duplicate`) is part of U5.

For the general demo, start at `scr-01-login` (Flow 1) and choose a role.

## U1 – Waiter creates an order (US-06, US-07)

Only the waiter creates orders in the prototype. There is no manager screen for this. API draft #62 restricts `createOrder` to WAITER; `develop` (0.1.0) still lists WAITER and MANAGER (open item, see [`docs/ui-ux/ui-prototype.md`](https://github.com/seng321-7th-team/PantryChef/blob/1a9b1baae5627d7d6cfb16df42bd9b014a1cd916/docs/ui-ux/ui-prototype.md), PR #71, commit `1a9b1ba`).

```mermaid
flowchart TD
    A([Login, role Waiter<br/>scr-01-login]) --> B[New order screen<br/>scr-02a-waiter-default]
    B --> C[Choose table and add dishes<br/>portions available are shown]
    C --> D{Send to kitchen}
    D -->|Every dish can be made| E[Order created as PENDING<br/>ingredients reserved<br/>scr-02c-waiter-order-sent]
    D -->|Stock changed while ordering| F[Order not sent: INSUFFICIENT_STOCK<br/>no reservation, no order<br/>scr-02b-waiter-insufficient-stock]
    F --> C
```

A dish that was closed to orders returns `422 MENU_ITEM_UNAVAILABLE` (state card in `scr-07a-states`).

**Retry after a network error:** "Send to kitchen" sends `POST /orders` with a required `Idempotency-Key`. A network error does not prove whether the server committed the request. Retrying the same logical order reuses the same key and body. If the first request completed and its result is stored, the server replays that result (`Idempotent-Replayed: true`); if no successful request was committed, the request can be processed once. Reusing a stored key with a different body returns `422 IDEMPOTENCY_KEY_REUSED`. A genuinely new order uses a new key. This rule is within the API's 24-hour key retention (`api/openapi.yaml`; ADR-005 in PR #64, Proposed). The connection-error card in `scr-07a-states` (U9) is drawn; the retry itself is not. Status requests may also use the optional key: a matching completed replay does not repeat effects; otherwise an invalid repeat transition returns `409 INVALID_STATUS_TRANSITION`.

## U1a – Sign-in errors (US-01)

```mermaid
flowchart TD
    A([Sign-in screen<br/>scr-01-login]) -->|Sign in, POST /auth/login| B{Credentials valid<br/>and account active?}
    B -->|Yes| C([Start screen of the role<br/>for example scr-02a-waiter-default])
    B -.->|No, 401 INVALID_CREDENTIALS| D[Sign-in failed<br/>scr-01b-login-error]
    D -.->|Retry| A
    E[Any signed-in screen] -.->|Token missing or expired, 401 UNAUTHENTICATED| F[Your session has expired<br/>scr-01c-session-expired]
    F -.->|Sign in again| A
```

`scr-01b-login-error` ("Sign-in failed", `INVALID_CREDENTIALS`) and `scr-01c-session-expired` ("Your session has expired", `UNAUTHENTICATED`) are drawn states. The dashed arrows show API behaviour (`POST /auth/login` returns `401` for wrong credentials or an inactive account; any protected request returns `401` when the token is missing, invalid or expired). This document does not rely on a clickable prototype link to or from these two frames. In the prototype, the role buttons on `scr-01-login` open the role screens without checking credentials.

## U2 – Waiter cancels, and late cancel (US-11, US-12, US-01)

```mermaid
flowchart TD
    A[My open orders<br/>scr-02a-waiter-default] --> B{Order status}
    B -->|PENDING| C[Cancel order #1042<br/>scr-02d-waiter-cancel-dialog]
    C -->|Cancel order| D([Order CANCELLED<br/>reservations released, physical stock unchanged<br/>back to scr-02a-waiter-default])
    C -->|Keep order| A
    B -->|PREPARING or READY| E[Late cancel needs ORDER_LATE_CANCEL<br/>without it: Ask a manager to cancel<br/>scr-02a-waiter-default]
    A -.->|Late-cancel attempt on a PREPARING or READY order, waiter without ORDER_LATE_CANCEL| F[403 LATE_CANCEL_NOT_PERMITTED, order unchanged<br/>server-side check, also when the button is disabled<br/>scr-05c-not-permitted-403]
    F --> G([Manager cancels - U7])
    E --> G
    F -->|Prototype only: Preview as Authorized waiter| H[Orders, waiter with ORDER_LATE_CANCEL<br/>scr-05g-authorized-waiter-orders]
    H --> I[Late cancel #1041, reason required 3-500 characters<br/>scr-05f-authorized-waiter-late-cancel]
    I -->|Cancel order| J([#1041 Cancelled, stock not restored<br/>scr-05h-authorized-waiter-late-cancelled])
    I -->|Keep order| H
```

Opening the Orders tab is allowed for waiters (`GET /orders`, roles MANAGER, CHEF, WAITER). `403 LATE_CANCEL_NOT_PERMITTED` comes only from a late-cancel request (`PATCH /orders/{orderId}/status` to `CANCELLED`) on a `PREPARING` or `READY` order by a waiter without `ORDER_LATE_CANCEL`. The same rule applies to both statuses: in `scr-05c-not-permitted-403` the Late cancel buttons of #1041 (Preparing) and #1039 (Ready) are disabled, and the banner shows the server's answer to such a request. The server checks the permission even if the request is sent anyway. In the prototype the Orders tab opens `scr-05c` directly; the diagram does not show a click on the disabled button (dashed arrow). A `PENDING` cancellation releases the reservations and leaves physical stock unchanged. The prototype returns to a reused list frame; it does not demonstrate a persisted Cancelled result for this path.

"Preview as" exists only in the prototype; in the real application the permission comes from the account.

## U3 – Chef prepares an order (US-08, US-09, US-10)

```mermaid
flowchart TD
    A([Login, role Chef<br/>scr-01-login]) --> B[Kitchen board<br/>scr-03a-kitchen-board]
    B --> C[Start preparing on a PENDING order]
    C --> D[Deducting stock...<br/>only this order is locked<br/>scr-03b-kitchen-deducting]
    D --> E[Order is PREPARING<br/>stock deducted once<br/>scr-03c-kitchen-preparing]
    E --> F[Mark as ready<br/>button on the Preparing card]
    F --> G([Order is READY<br/>no second stock deduction])
```

The "Mark as ready" button is visible on the Preparing cards (`scr-03a`, `scr-03c`). In the prototype it has no link to another frame; the READY result is described here from the Ready column on the board. The last two arrows in U3 describe the expected API behavior, not a tested clickable prototype transition. The board says "Updates automatically"; the team decision is polling `GET /orders` every 15–30 seconds (O-01 in `ui-user-story-review.md`).

## U4 – Chef: order already started (Figma Flow 6)

```mermaid
flowchart TD
    A[Kitchen board<br/>scr-03a-kitchen-board] --> B[Another chef already started #1042]
    B --> C[Message: Order #1042 was already started<br/>Code INVALID_STATUS_TRANSITION<br/>board refreshed<br/>scr-03d-kitchen-conflict]
    C --> A
```

This frame is a separate starting point. It is not linked from `scr-03a` on purpose.

## U5 – Manager manages inventory and creates an ingredient (US-02, US-03, US-04, US-14)

```mermaid
flowchart TD
    A([Login, role Manager<br/>scr-01-login]) --> B[Inventory<br/>on hand, reserved, available, threshold<br/>scr-04a-inventory]
    B --> C[Low stock only filter / low-stock banner]
    B --> D[Adjust]
    D --> E[Enter change and required reason<br/>scr-04b-inventory-adjust-dialog]
    E --> F{Save adjustment}
    F -->|on hand stays at or above reserved| G([STOCK_ADJUSTED recorded])
    F -->|on hand would drop below reserved| H[NEGATIVE_AVAILABLE_STOCK<br/>scr-04c-inventory-adjust-error]
    H --> E
    B --> I[New ingredient<br/>name, unit, threshold, starts with 0 stock<br/>scr-04d-inventory-new-ingredient]
    I -->|name empty| J[Name is required<br/>scr-04e-new-ingredient-validation]
    I -->|name already exists, also inactive| K[409 DUPLICATE_RESOURCE<br/>scr-04f-new-ingredient-duplicate]
    I -->|Create| L([Ingredient created<br/>stock starts at 0<br/>opening stock via Adjust, reason INITIAL_STOCK])
```

Since the 18 Nov re-export, `scr-04d` to `scr-04f` have no Initial stock field (helper text "Starts with 0 stock. Add stock using Adjust."). An ingredient is created with zero stock and the opening stock is entered with Adjust (reason `INITIAL_STOCK`), as in the SRS and backlog drafts and API draft #62 (`initialQuantity` removed in `866122e`; `api/openapi.yaml` unchanged in `cb634c3`). None of these drafts is merged (D-9b in `ui-user-story-review.md`).

## U6 – Manager: ingredient lifecycle (Figma Flow 9)

Follows API draft #62.

```mermaid
flowchart TD
    A[Inventory<br/>scr-04a-inventory] -->|Edit on Rice| B[Edit ingredient<br/>unit locked, status Active<br/>scr-04g-inventory-edit-ingredient]
    B -->|Save changes| A
    B -->|Deactivate ingredient| C[Deactivate Rice?<br/>scr-04h-deactivate-confirm]
    C -->|Cancel| B
    C -->|Deactivate| D[Ingredient Inactive<br/>Inactive badge, Reactivate ingredient<br/>scr-04i-inventory-inactive-ingredient]
    D -->|Reactivate ingredient| B
    D -->|Save changes| A
```

Notes:

- **Deactivate and Reactivate are separate actions from Save changes.** In the prototype they change the state immediately. In the API draft they are their own requests (`DELETE /ingredients/{id}` soft delete returning `200`, or `PUT` with `active: true`).
- Edit never changes stock. Unit cannot be changed while the ingredient has stock or active reservations (`409 RESOURCE_IN_USE`).
- An inactive ingredient keeps history and existing pending orders, cannot be used in new recipes (`422 INGREDIENT_INACTIVE`), closes menu items that use it to new orders (`422 MENU_ITEM_UNAVAILABLE`, `availablePortions` 0), and raises no low-stock alert. Its stock stays visible and adjustable.
- Stock **Out** (available 0) and ingredient **Inactive** are different states.
- Audit (API draft #62): deactivation is recorded as `INGREDIENT_DEACTIVATED` and reactivation as `INGREDIENT_REACTIVATED`. No frame shows these audit entries (not drawn; API behaviour).

## U7 – Manager cancels orders and reads the audit log (US-11, US-12, US-13)

```mermaid
flowchart TD
    A[Orders and audit<br/>scr-05a-orders-and-audit] --> B{Order status}
    B -->|PENDING| C[Cancel...<br/>reservations released, physical stock unchanged<br/>reason optional<br/>scr-05d-pending-cancel-dialog]
    C --> D([ORDER_CANCELLED in audit log])
    B -->|PREPARING or READY| E[Late cancel...<br/>consumed ingredients not returned to stock<br/>reason required, 3-500 characters<br/>scr-05b-late-cancel-dialog]
    E --> F([ORDER_LATE_CANCELLED in audit log<br/>scr-05e-late-cancel-audit])
    F --> G[Optional: separate stock adjustment<br/>reason Late cancellation correction]
```

## U8 – Manager edits a recipe (US-05)

```mermaid
flowchart TD
    A[Recipes<br/>scr-06a-recipes] --> B[Select menu item<br/>current recipe and version history]
    B --> C[Edit recipe<br/>scr-06b-recipes-edit-dialog]
    C --> D[Change quantities per portion<br/>Publish new version]
    D --> E([RECIPE_UPDATED in audit log<br/>new orders use the new version<br/>existing orders keep theirs])
```

Not drawn (API behaviour, draft #62): publishing a recipe version that uses an inactive ingredient is rejected with `422 INGREDIENT_INACTIVE`. No frame shows this error.

## U9 – Common states (Figma Flow 8)

`scr-07a-states` is one static frame with six cards: loading, empty waiter orders, empty kitchen board, `500 INTERNAL_ERROR`, connection error and `422 MENU_ITEM_UNAVAILABLE`. It has no clickable path. For the retry rule behind the connection-error card, see U1.

## Role and screen overview

| Role | Screens |
|---|---|
| Waiter | New order, My open orders, Orders |
| Chef | Kitchen board |
| Manager | Inventory, Recipes, Orders & audit |

## Current cross-document alignment

SRS [#54 `0ad80b3`](https://github.com/seng321-7th-team/PantryChef/blob/0ad80b38ee696db5e7d8ffc47ef00eebad8a4b12/docs/srs.md) FR-01–FR-14 and backlog [#55 `ec1911a`](https://github.com/seng321-7th-team/PantryChef/blob/ec1911a24554d8cfafa3330c80a5bd1bc8080329/docs/product-backlog.md) US-01–US-14 (MVP; US-15 and US-16 are P1, post-MVP) are the current reviewed requirement drafts. API/diagrams [#62 `f061da2`](https://github.com/seng321-7th-team/PantryChef/blob/f061da27501bf7fc62b39aa278aeb7693259864e/api/openapi.yaml) retain the same OpenAPI rules used above; ADRs [#64 `60d1a8b`](https://github.com/seng321-7th-team/PantryChef/blob/60d1a8ba08c21d8e07f873a4fe218c15c36dfae7/docs/architecture/architecture-decisions.md) and schema [#66 `fa446c1`](https://github.com/seng321-7th-team/PantryChef/blob/fa446c1eb6ad0d075c8fbd85e9b7974021bee9d1/docs/architecture/database-schema.md) match the core UI behaviors. They are not merged. The original version notes above are historical evidence, not claims that older PR heads are still current.

The current FR/NFR mapping and open scope decisions are maintained by PR #50; its existing pinned link identifies the earlier committed review until that PR is updated. No backend/NFR pass is inferred from these diagrams.

## Not drawn (no frame)

Stock movements and reservations view, new menu item with its first recipe, staff and permission management (granting the late-cancel permission), "Show inactive" filter. These depend on Burcu's decisions listed in `ui-user-story-review.md`. A manager order-creation screen is not drawn on purpose (waiter-only order creation).
