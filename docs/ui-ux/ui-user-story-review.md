# PantryChef – UI Design ↔ User Story Consistency Review (S2-31)

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-31 – UI Design–User Story Consistency Review
**Owner:** Tuğçe Çevik · **Reviewer:** Burcu Ücük
**Status:** Draft – waiting for Burcu's decisions D-2, D-3, D-4 and D-6. No requirement has been changed by this review.

## 1. Scope, sources and limits

Compared in this review:

| Source | Version used |
|---|---|
| `docs/product-backlog.md` (User Stories and Acceptance Criteria) | `develop` at `0c3e244`. The file is titled "Initial Product Backlog" (Sprint 1 version). |
| `api/openapi.yaml` | `develop` at `0c3e244`, API version 0.1.0 (draft) |
| `docs/sprint2-task-board.md`, `docs/sprint2-raci.md` | `develop` at `0c3e244` |
| `docs/srs.md` | PR #45 draft (d34389a), not merged; FR numbers may change. |
| Figma prototype, 18 frames | Exported PNG frames, listed in `docs/ui-ux/figma-links.md`. The Figma file itself was not opened by the reviewer. |

Rules followed:

- A missing screen is **not** treated as "out of scope". All User Stories below are P0 in the backlog, so a scope change needs Burcu's decision (section 7).
- This file records findings and options only. It does not change the backlog, the OpenAPI file or the Figma design.

Limits of the evidence:

- `docs/diagrams/` only contains `.gitkeep`. The C4, UML and ER diagrams (S2-12 to S2-15, S2-35) and `docs/architecture/architecture-decisions.md` (S2-16) are not in the repository yet. Ayşe's local draft diagrams exist as draw.io files (`PantryChef_C4.drawio`, `PantryChef_ER.drawio`, `PantryChef_UML_SEQUENCE_STATE_CLASS.drawio`). They are **not in the repository**, not reviewed and not final. They are mentioned only where they help a question for Ayşe (C-01, O-01) and are not used as evidence for any finding.
- As of 17 Nov, before issue #48 was opened, no issues or pull requests for S2-28 to S2-33 were found (PR #45 and Issue #44 were read as the SRS source).

## 2. What matches

| Area | Evidence in Figma | Source |
|---|---|---|
| `PENDING` reserves, does not deduct | Kitchen board: "Reserved · stock not deducted yet" | US-07, OpenAPI `/orders/{orderId}/status` |
| `PREPARING` deducts once | Kitchen board: "Stock deducted once"; 03b "Deducting stock…" with a lock on one order | US-09, OpenAPI (`Idempotency-Key`, `409 INVALID_STATUS_TRANSITION`) |
| `PENDING` cancel releases reservations, physical stock unchanged | 05d dialog | US-11 AC3–4, OpenAPI transition table |
| Late cancel: manager or waiter with permission, reason required, stock not restored | 05b dialog, 05c 403, 05e result | US-12 AC1–3, 6, OpenAPI (`LATE_CANCEL_NOT_PERMITTED`, `CANCELLATION_REASON_REQUIRED`) |
| `NEGATIVE_AVAILABLE_STOCK` on adjustment | 04c | OpenAPI `/inventory/adjustments` |
| `INSUFFICIENT_STOCK` blocks the whole order | 02b | US-06, US-07 |
| Recipe versions kept by existing orders | 06a, 06b, audit entry `RECIPE_UPDATED` | US-05 AC6, OpenAPI `/recipes/{menuItemId}` |
| Low-stock banner and threshold status | 04a | US-14 AC2, 4 |
| No delivery feature | No delivery screen or status in any frame | Backlog section 2.3 |

## 2a. SRS cross-reference (draft)

Source: `docs/srs.md` in PR #45 (Issue #44), **not merged yet**. FR numbers may change before merge. This table answers OQ-02 ("confirm Figma screen/user-flow coverage against FR-001–FR-025").

| FR | Requirement | Frames | Coverage |
|---|---|---|---|
| FR-001 | Staff login | `scr-01-login` | Success path shown; error state not drawn yet |
| FR-002 | Current-user identity | "Signed in as" in every role screen | Covered (role only; username and permissions are not shown) |
| FR-003 | Role enforcement | role-based navigation, `scr-05c-not-permitted-403` | Covered |
| FR-004 | Staff account administration | none | **Gap** (D-6) |
| FR-005 | Ingredient catalogue | `scr-04a`, `scr-04d` | **Partial**: list and create only; edit, active status and delete missing (D-1, D-2) |
| FR-006 | Stock visibility | `scr-04a` | Covered |
| FR-007 | Controlled stock adjustments | `scr-04b`, `scr-04c` | Covered |
| FR-008 | Inventory invariants under concurrency | `scr-02b` (stock changed while ordering) | Indirect |
| FR-009 | Menu items | `scr-06a` (list) | **Partial**: create, update and archive missing (D-4) |
| FR-010 | Versioned recipes | `scr-06a`, `scr-06b` | Covered |
| FR-011 | Menu availability | `scr-02a` (portions available) | Covered |
| FR-012 | Create order | `scr-02a`, `scr-02c` | Covered for Waiter; Manager order entry not shown (see O-04) |
| FR-013 | Atomic reservation | `scr-02b` | Covered |
| FR-014 | Idempotent order creation | none (client behavior) | Not a screen |
| FR-015 | Order lookup | `scr-02a` ("My open orders"), `scr-05a` | Covered; open API question: filter for "my orders" |
| FR-016 | Kitchen queue | `scr-03a` | Covered |
| FR-017 | Begin preparation | `scr-03a`, `scr-03b`, `scr-03c` | Covered |
| FR-018 | Mark ready | `scr-03c` | Covered |
| FR-019 | Reject invalid transitions | none | Not drawn yet (conflict frame planned) |
| FR-020 | Pending cancellation | `scr-02a`, `scr-05d` | Covered |
| FR-021 | Late cancellation | `scr-05b`, `scr-05c`, `scr-05e` | Covered |
| FR-022 | Reservation inspection | none | **Gap** (D-3) |
| FR-023 | Audit and movement history | `scr-05a`, `scr-05e` (audit log only) | **Partial**: movements missing (D-3) |
| FR-024 | Low-stock detection | `scr-04a` (banner, "Low stock only") | Covered |
| FR-025 | Threshold maintenance | `scr-04d` (create only) | **Partial**: edit missing (D-1) |
| FR-026 | Standard API errors | `scr-02b`, `scr-04c`, `scr-05c` | **Partial**: other error states not drawn yet |
| FR-027 | Health endpoint | none | Not a screen |

SRS §5.1 lists these UI areas: login, Waiter order entry and status, Chef kitchen queue and status updates, and Manager inventory, recipe and alert operations. Staff administration (FR-004), menu-item management (FR-009), and reservation and movement history (FR-022, FR-023) are API requirements but are not named in §5.1.

## 3. Findings

Each finding lists the User Story, the OpenAPI endpoint, the Figma frame, the gap and the options. Options are proposals, not decisions.

### F-01 – No screen to edit an existing ingredient or its threshold

| | |
|---|---|
| User Story | US-02 AC5 "Existing ingredient records can be updated"; US-14 AC1 "Each ingredient has a configurable low-stock threshold" |
| OpenAPI | `PUT /ingredients/{ingredientId}` (`updateIngredient`, Manager) |
| Figma | 04a Inventory has only "Adjust" per row (changes on-hand quantity, 04b). 04d is "New ingredient" only. |
| Gap | The threshold can be set when creating an ingredient, but not changed afterwards. "Adjust" does not change name, unit or threshold. |
| Options | A) Add an "Edit" action and dialog to Inventory (fields as in `IngredientInput`). Resolved by the SRS draft (FR-005, FR-025): an Edit screen will be added to the prototype. |

### F-02 – Ingredient "deactivation" differs between backlog and API, and has no screen

| | |
|---|---|
| User Story | US-02 AC6 "Deactivation does not invalidate historical order records" |
| OpenAPI | `DELETE /ingredients/{ingredientId}` (`deleteIngredient`) is a delete, not a deactivation. It returns `409 RESOURCE_IN_USE` if the ingredient is in any recipe or has active reservations. The ingredient schema in `IngredientInput` has no `active` field. (Users do have `active`.) |
| Figma | No delete or deactivate action in 04a–04d. |
| Gap | Two separate issues: (1) the backlog says "deactivate", the API offers "delete only if unused"; (2) no screen exposes either. |
| Options | A) Burcu and Ayşe align the wording (backlog or API). B) Add the action and the `RESOURCE_IN_USE` error state to Inventory after that (see D-2). |

### F-03 – Reservation and consumption events are not visible in the UI

| | |
|---|---|
| User Story | US-13 AC2 "Reservation, consumption, cancellation, and inventory adjustment events are traceable"; AC4 "Authorized managers can view audit history" |
| OpenAPI | `GET /audit-logs` (Manager; actions `ORDER_CANCELLED`, `ORDER_LATE_CANCELLED`, `STOCK_ADJUSTED`, `RECIPE_UPDATED`, `USER_PERMISSIONS_CHANGED`). `GET /inventory/movements` (Manager; types `RESERVE`, `RELEASE`, `CONSUME`, `ADJUSTMENT`). `GET /reservations` (Manager, Chef). |
| Figma | 05a and 05e show only the audit log (cancel, stock adjustment, recipe update). The log has no filter (the API supports `action`, `entityId`, `from`, `to`). No frame shows stock movements or reservations. |
| Gap | In the API, reservation and consumption are recorded as **stock movements**, not as audit-log actions. The UI shows only the audit log, so AC2 is covered by the API but not by any screen. |
| Options | A) Add a "Stock movements" view (own tab or section) next to the audit log. B) Burcu decides that AC2 is verified through the API only in the MVP (see D-3). |

### F-04 – No screen to create a new recipe

| | |
|---|---|
| User Story | US-05 AC1 "A manager can create and update recipes" |
| OpenAPI | `PUT /recipes/{menuItemId}` (`replaceRecipe`) updates. `POST /menu-items` (`createMenuItem`) creates a menu item **together with** its recipe ("A menu item cannot be created without a recipe", version starts at 1). |
| Figma | 06a lists the existing menu items. 06b is "Edit recipe" with "+ Add ingredient". No "new menu item / new recipe" action. |
| Gap | Recipe creation is only possible through creating a menu item. The prototype has neither. The backlog does not list menu-item management as a User Story. |
| Options | A) Add "New menu item" with its first recipe to Recipes. B) Burcu decides (see D-4). |

### F-05 – Ingredient creation: "quantity" in the backlog, not in the API

| | |
|---|---|
| User Story | US-02 AC1 "A manager can create an ingredient with a name, unit, quantity, and low-stock threshold" |
| OpenAPI | `IngredientInput` requires only `name`, `unit`, `lowStockThreshold`. Initial stock is entered with `POST /inventory/adjustments` and reason `INITIAL_STOCK`. |
| Figma | 04d matches the API: no quantity field; the hint says "Starts with 0 on hand. Add stock with an adjustment (reason: Initial stock)." |
| Gap | Backlog and API disagree. The Figma screen follows the API. This is not a Figma defect. |
| Options | Resolved by the SRS draft: FR-005 has no quantity, same as the API. Backlog US-02 AC1 is to be reconciled under OQ-04. |

### F-06 – No screen to grant the late-cancel permission to a waiter

| | |
|---|---|
| User Story | US-01 AC6 "Authorized cancellation after preparation begins requires the appropriate permission"; US-12 AC2 "A waiter may perform this action only with specific authorization" |
| OpenAPI | `POST /users` and `PUT /users/{userId}` (Manager) set `permissions` (`ORDER_LATE_CANCEL`). Permission changes are audited as `USER_PERMISSIONS_CHANGED`. |
| Figma | 05a–05e have a "Preview as: Manager / Authorized waiter / Waiter" switch. The switch is a prototype aid only (the login frame says so for roles); no frame lets a manager grant or remove the permission. |
| Gap | The permission can be exercised in the UI but not assigned. No User Story explicitly requires a user-management screen. |
| Options | A) Add a staff-permissions screen. B) Treat it as outside the UI for the MVP and say so in the SRS (see D-6). |

## 4. Cancellation records

What the repository defines today (all from `api/openapi.yaml` unless stated):

| Case | Allowed by | Stock effect | Records in the API |
|---|---|---|---|
| `PENDING` → `CANCELLED` | Waiter, Manager | `ACTIVE` reservations become `RELEASED`; `onHand` unchanged. A `RELEASE` stock movement is recorded. | `Order.statusHistory` entry; `Order.cancellation` (`late: false`); audit action `ORDER_CANCELLED`. Reason optional. |
| `PREPARING` / `READY` → `CANCELLED` | Manager, or Waiter with `ORDER_LATE_CANCEL` | None. Consumed stock is not restored and reservations are not released again. Corrections only via `POST /inventory/adjustments` (reason `LATE_CANCELLATION_CORRECTION`). | `Order.statusHistory` entry; `Order.cancellation` (`late: true`, `previousStatus`, `reason`, `cancelledBy`, `cancelledAt`); audit action `ORDER_LATE_CANCELLED` (actor, time, reason, previous status). Reason required (`422 CANCELLATION_REASON_REQUIRED`). |
| Any repeat | – | `CANCELLED` is terminal; a repeat is not in the transition table, so it returns `409 INVALID_STATUS_TRANSITION`. | – |

Findings:

- **C-01. `cancellation_audit` and `order_status_history` do not exist in any current document.** A search of `docs/`, `api/`, `README.md` and `CONTRIBUTIONS.md` finds neither name. The only related text is "Record cancellation audit events" (backlog US-12 implementation tasks). The ER diagram (S2-15) is not in the repository. Their relationship to `ORDER_CANCELLED` / `ORDER_LATE_CANCELLED` therefore **cannot be verified yet**. The API has three related records: `Order.statusHistory`, `Order.cancellation` and the `/audit-logs` entries. Which database table stores each of them is an open question for the ER diagram (D-7). **Ayşe's draft — not yet in the repository, not final:** her local ER draft (`PantryChef_ER.drawio`) has an `order_status_history` table and no `cancellation_audit` table; cancellation data is stored as columns of `orders` (`cancelled_by`, `cancelled_at`, `cancel_reason`, `previous_status`, `late_cancellation`), next to an `audit_logs` table. D-7 stays open until Ayşe confirms this against her draft.
- **C-02. Late cancel has its own action.** The API uses `ORDER_LATE_CANCELLED`, separate from `ORDER_CANCELLED`. Figma 05e shows `ORDER_LATE_CANCELLED` and 05a shows `ORDER_CANCELLED`, so UI and API agree. The backlog (US-13 AC1–3) does not name the actions.
- **C-03. Late cancellation leaves no stock movement.** `StockMovementType` has no entry for it, which matches "stock not restored". The cancellation is traceable only through the audit log and `Order.cancellation`. Any new Stock movements view (F-03) must not show a restore for late cancels.
- **C-04. Rules in the UI are consistent with the API:** waiter sees "Ask a manager to cancel" on `PREPARING` (02a), a disabled "Late cancel…" without permission (05c), the stock warning and mandatory reason in 05b, and optional reason for `PENDING` in 05d. The audit entry in 05e shows "Preparing → Cancelled · stock not restored" with the reason.
- **C-05. Repeated cancellation (US-11 AC5, US-12 AC7).** The API covers this through the terminal state. No frame shows the `409` state; this is a possible extra error frame, not a gap in the rules.

## 5. ADR notes (kept separate from the audit log)

An **audit log** is a runtime record of what users did (`/audit-logs`). An **ADR** is a design-time record of why the team chose an architecture. They are not the same document.

Evidence:

- ADRs are task S2-16 (owner Ayşe Dural, reviewer Emre Boz), deliverable `docs/architecture/architecture-decisions.md`. Status in the board is "To Do (provisional)". The file does not exist yet.
- `docs/team-roles-raci.md` assigns ADRs to the architect role. No document states what the ADR content must be.

Therefore this review **cannot check ADR requirements**: there are none written in the repository and no ADR to compare against.

Decisions that are already in the OpenAPI draft and could be recorded as ADRs (candidates for Ayşe to accept or reject, not decisions):

1. Late cancellation does not restore stock; corrections use a separate adjustment.
2. Each order keeps the recipe version used at creation.
3. Exactly-once stock deduction using `Idempotency-Key`.
4. Audit entries are immutable and read-only through the API.
5. How cancellation data is stored (see C-01).

## 6. Other observations

- **O-01. "Updates automatically" (kitchen board).** Team decision: the board polls `GET /orders` every 15–30 seconds. The OpenAPI file does not describe this behavior; Ayşe is to reflect the decision in the architecture documents.
- **O-02. Login placeholder contrast.** The username placeholder ("e.g. waiter01") has low contrast in the login frame. Figma fix, Tuğçe.
- **O-03. Backlog version.** US-02 and others may change when S2-02 (refined backlog) is delivered; this review should be re-checked against that version.
- **O-04. Manager creating orders.** In `api/openapi.yaml`, `POST /orders` (`createOrder`) allows the roles WAITER and MANAGER, and `GET /orders` (`listOrders`) allows MANAGER, CHEF and WAITER. The prototype shows order creation only on the waiter screen (SCR-02); the manager screens have no New order tab. Not a rule conflict; `docs/ui-ux/ui-prototype.md` (Section 1) notes it as not shown in the prototype.

## 7. Decisions needed from Burcu

| ID | Question | Related |
|---|---|---|
| D-1 | **Resolved by the SRS draft:** FR-005 and FR-025 require ingredient and threshold maintenance; an Edit screen will be added. | F-01 |
| D-2 | FR-005 lists "active status" for ingredients, but the API `Ingredient` schema has no `active` field and only offers `DELETE` (`409 RESOURCE_IN_USE`). Backlog US-02 AC6 says "deactivation". Which is correct? (Needs Ayşe for the API side.) | F-02 |
| D-3 | FR-022 and FR-023 exist as API requirements; SRS §5.1 does not list them as UI. Must the UI show reservations and stock movements, or is API access enough for the MVP? | F-03 |
| D-4 | FR-009 includes creating and archiving menu items; SRS §5.1 does not list a menu-management screen. Is it part of the MVP UI? | F-04 |
| D-5 | **Resolved by the SRS draft:** FR-005 has no quantity at creation (same as the API). Backlog US-02 AC1 is to be reconciled under OQ-04. | F-05 |
| D-6 | FR-004 includes staff administration and the `ORDER_LATE_CANCEL` permission; SRS §5.1 does not list a staff screen. Is it part of the MVP UI? | F-06 |
| D-7 | (For Ayşe, with S2-15/S2-16) Which records and tables back `Order.statusHistory`, `Order.cancellation` and the audit log, and are `cancellation_audit` and `order_status_history` the intended names? **Open:** Ayşe to confirm against her ER draft (see C-01). | C-01 |
| D-8 | (For Ayşe) Reflect the team's 15–30 s polling decision in the architecture documents. | O-01 |

Until these are answered, none of the screens above is declared out of scope, and no P0 item is changed.

## 8. Next steps (proposal)

1. Burcu answers D-2, D-3, D-4 and D-6; Ayşe answers D-2, D-7 and D-8.
2. Tuğçe adds the Edit ingredient screen (D-1, resolved) and updates the frames for F-03, F-04 and F-06 as decided.
3. This record is updated with the decisions and re-reviewed against the refined backlog (S2-02).
