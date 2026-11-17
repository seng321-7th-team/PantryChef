# PantryChef – UI Design ↔ User Story Consistency Review (S2-31)

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-31 – UI Design–User Story Consistency Review
**Owner:** Tuğçe Çevik · **Reviewer:** Burcu Ücük
**Status:** Draft – updated 18 Nov 2026 for the 31-frame prototype. Waiting for Burcu's decisions D-2, D-3, D-4 and D-6 and for the team's decision on API draft #62. No requirement has been changed by this review.

## 1. Scope, sources and limits

Compared in this review:

| Source | Version used |
|---|---|
| `docs/product-backlog.md` (User Stories and Acceptance Criteria) | `develop` at `0c3e244` (historical source; the file is identical at `5dd8253`, checked 18 Nov). The file is titled "Initial Product Backlog" (Sprint 1 version). |
| `api/openapi.yaml` | `develop` at `0c3e244` (historical source; the file is identical at `5dd8253`, checked 18 Nov), API version 0.1.0 (draft) |
| `docs/sprint2-task-board.md`, `docs/sprint2-raci.md` | `develop` at `0c3e244` (historical source; the file is identical at `5dd8253`, checked 18 Nov) |
| `docs/srs.md` | PR #45 draft (d34389a), not merged; FR numbers may change. |
| `api/openapi.yaml` in PR #62 | Head `866122e` (API version 0.2.0 draft, **not merged**; checked 18 Nov). Head `dbb06be` still had an optional `initialQuantity`; `866122e` removed it. Used only for the ingredient and order-creation items marked "API draft #62". |
| `docs/srs.md` in PR #54 and `docs/product-backlog.md` in PR #55 | Heads `0ad80b3` and `ec1911a` (drafts, **not merged**). Used for the initial-stock item (F-05). |
| `docs/architecture/architecture-decisions.md` in PR #64 | Head `07fd074` (**not merged**; earlier head `e304bbf`). Only the ADR index and the ADR-009 status were read (ADR-006, -008, -009, -010); no ADR is treated as team-approved unless its status says "Accepted". |
| Figma prototype, **31 frames** | Page "03 Screens v2", checked against the live file on 18 Nov 2026 (frame count, frame names, prototype links). Frame list and PNG/PDF export: `docs/ui-ux/figma-links.md`. The reviewer (Burcu) has not checked it yet. |

Rules followed:

- A missing screen is **not** treated as "out of scope". All User Stories below are P0 in the backlog, so a scope change needs Burcu's decision (section 7).
- This file records findings and options only. It does not change the backlog, the OpenAPI file or the Figma design.

Limits of the evidence:

- On `develop` (`5dd8253`, checked 18 Nov) `docs/diagrams/` and `docs/architecture/` contain only `.gitkeep`. The C4, UML and ER diagrams are in open PR #62 (head `866122e`), the ADRs (S2-16) in open PR #64 (head `07fd074`) and the database schema (S2-15) in open PR #66 (head `5475872`); none of them is merged. They are mentioned only where they help a question for Ayşe (C-01, O-01) and are not used as evidence for any finding.
- As of 17 Nov, before issue #48 was opened, no issues or pull requests for S2-28 to S2-33 were found (PR #45 and Issue #44 were read as the SRS source). On 18 Nov, the repository branches and pull request heads still hold no branch for S2-28 to S2-30 or S2-33 apart from PR #50. Issue and pull request comments could not be read for the 18 Nov update, so no team confirmation of API draft #62 is recorded here.

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
| FR-001 | Staff login | `scr-01-login`, `scr-01b-login-error`, `scr-01c-session-expired` | Covered: success path, `INVALID_CREDENTIALS` and `UNAUTHENTICATED` shown |
| FR-002 | Current-user identity | "Signed in as" in every role screen | Covered (role only; username and permissions are not shown) |
| FR-003 | Role enforcement | role-based navigation, `scr-05c-not-permitted-403` | Covered |
| FR-004 | Staff account administration | none | **Gap** (D-6) |
| FR-005 | Ingredient catalogue | `scr-04a`, `scr-04d` to `scr-04i` | **Applied in Figma**: list, create, edit, active status, deactivate and reactivate are drawn. Deactivate behavior follows API draft #62; decision pending (D-2) |
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
| FR-019 | Reject invalid transitions | `scr-03d-kitchen-conflict` | Covered: `INVALID_STATUS_TRANSITION` shown |
| FR-020 | Pending cancellation | `scr-02a`, `scr-02d`, `scr-05d` | Covered (waiter and manager) |
| FR-021 | Late cancellation | `scr-05b`, `scr-05c`, `scr-05e` | Covered |
| FR-022 | Reservation inspection | none | **Gap** (D-3) |
| FR-023 | Audit and movement history | `scr-05a`, `scr-05e` (audit log only) | **Partial**: movements missing (D-3) |
| FR-024 | Low-stock detection | `scr-04a` (banner, "Low stock only") | Covered |
| FR-025 | Threshold maintenance | `scr-04d`, `scr-04g` | Covered: threshold set at creation and edited in `scr-04g` |
| FR-026 | Standard API errors | `scr-01b`, `scr-01c`, `scr-02b`, `scr-03d`, `scr-04c`, `scr-04f`, `scr-05c`, `scr-07a` | Covered for the main cases (`409`, `403`, `422`, `500`, connection error) |
| FR-027 | Health endpoint | none | Not a screen |

The table above uses the FR numbers of the PR #45 draft. The PR #54 draft uses different numbering (FR-01 to FR-14); which SRS is valid is an open question for Burcu. Scope and roles follow the System Vision and PR #54 where they differ.

SRS §5.1 lists these UI areas: login, Waiter order entry and status, Chef kitchen queue and status updates, and Manager inventory, recipe and alert operations. Staff administration (FR-004), menu-item management (FR-009), and reservation and movement history (FR-022, FR-023) are API requirements but are not named in §5.1.

## 3. Findings

Each finding lists the User Story, the OpenAPI endpoint, the Figma frame, the gap and the options. Options are proposals, not decisions.

### F-01 – No screen to edit an existing ingredient or its threshold

| | |
|---|---|
| User Story | US-02 AC5 "Existing ingredient records can be updated"; US-14 AC1 "Each ingredient has a configurable low-stock threshold" |
| OpenAPI | `PUT /ingredients/{ingredientId}` (`updateIngredient`, Manager) |
| Figma | At the time of the first review, 04a had only "Adjust" per row. **Closed on 18 Nov:** every row of `scr-04a-inventory` now has "Edit" and "Adjust"; Edit on Rice opens `scr-04g-inventory-edit-ingredient` (name, low-stock threshold, locked unit, status). |
| Gap | Closed. Edit never changes stock; stock changes only through Adjust. |
| Options | **Closed:** the Edit action and `scr-04g-inventory-edit-ingredient` exist in Figma (18 Nov). |

### F-02 – Ingredient "deactivation" differs between backlog and API, and has no screen

| | |
|---|---|
| User Story | US-02 AC6 "Deactivation does not invalidate historical order records" |
| OpenAPI | `DELETE /ingredients/{ingredientId}` (`deleteIngredient`) is a delete, not a deactivation. It returns `409 RESOURCE_IN_USE` if the ingredient is in any recipe or has active reservations. The ingredient schema in `IngredientInput` has no `active` field. (Users do have `active`.) |
| Figma | **Updated 18 Nov:** `scr-04g` (Status Active, "Deactivate ingredient"), `scr-04h-deactivate-confirm`, `scr-04i-inventory-inactive-ingredient` (Inactive badge, "Reactivate ingredient"). Follows API draft #62 (head `866122e`; the deactivation part is unchanged since `dbb06be`): `DELETE` is a soft delete returning `200`, `PUT` with `active: true` reactivates, `INGREDIENT_DEACTIVATED` / `INGREDIENT_REACTIVATED` audit actions. Also ADR-008 in PR #64 (Proposed). |
| Gap | (1) `develop` (0.1.0) still offers "delete only if unused"; the draft in PR #62 and the SRS/backlog drafts say "deactivate". Not merged, **decision pending**. (2) The screens now exist in Figma. Deactivate and Reactivate are separate actions from "Save changes" (see `ui-prototype.md`). |
| Options | A) Burcu and Ayşe confirm deactivation (D-9a). B) Otherwise the three frames must be reverted to "delete if unused" with a `RESOURCE_IN_USE` state (see D-2). |

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
| Figma | **Updated 18 Nov:** `scr-04d`, `scr-04e` and `scr-04f` have an optional "Initial stock" field (blank = 0; helper text "Leave blank to start at 0. You can add stock later."). The old hint "Starts with 0 on hand…" was removed. |
| Gap | **Open (Figma only).** SRS FR-02 (PR #54) and backlog US-02 AC1 (PR #55) describe one way: create with zero stock, then record stock through a separate adjustment. API draft #62 now follows the same rule: `866122e` removed the optional `initialQuantity` that `dbb06be` had; ADR-009 is "Rejected" in PR #64 (`07fd074`) and the schema in PR #66 (`5475872`) says the same. None of these is merged. The frames `scr-04d` to `scr-04f`, their PNGs and the PDF still show the optional Initial stock field; removing it and re-exporting is still open. |
| Options | Remove the Initial stock field from `scr-04d` to `scr-04f`, re-export the PNGs and the PDF, and update the related documents together. Until then the frames and exports still show the field. (See D-5, D-9b.) |

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

- **C-01. `cancellation_audit` and `order_status_history` do not exist in any current document.** A search of `docs/`, `api/`, `README.md` and `CONTRIBUTIONS.md` finds neither name. The only related text is "Record cancellation audit events" (backlog US-12 implementation tasks). The ER diagram and the database schema are not on `develop`; they are in open PRs #62 and #66. Their relationship to `ORDER_CANCELLED` / `ORDER_LATE_CANCELLED` therefore **cannot be verified on `develop` yet**. The API has three related records: `Order.statusHistory`, `Order.cancellation` and the `/audit-logs` entries. Which database table stores each of them is an open question for the ER diagram (D-7). **Open PRs, not merged:** the ER diagram in PR #62 (`docs/architecture/database/PantryChef_ER.drawio`) and the schema in PR #66 (`docs/architecture/database-schema.md`) have an `order_status_history` table and no `cancellation_audit` table; cancellation data is stored as columns of `orders` (`cancelled_by`, `cancelled_at`, `cancel_reason`, `previous_status`, `late_cancellation`), next to an `audit_logs` table. D-7 stays open until Ayşe confirms this and the PRs are merged.
- **C-02. Late cancel has its own action.** The API uses `ORDER_LATE_CANCELLED`, separate from `ORDER_CANCELLED`. Figma 05e shows `ORDER_LATE_CANCELLED` and 05a shows `ORDER_CANCELLED`, so UI and API agree. The backlog (US-13 AC1–3) does not name the actions.
- **C-03. Late cancellation leaves no stock movement.** `StockMovementType` has no entry for it, which matches "stock not restored". The cancellation is traceable only through the audit log and `Order.cancellation`. Any new Stock movements view (F-03) must not show a restore for late cancels.
- **C-04. Rules in the UI are consistent with the API:** waiter sees "Ask a manager to cancel" on `PREPARING` (02a), a disabled "Late cancel…" without permission (05c), the stock warning and mandatory reason in 05b, and optional reason for `PENDING` in 05d. The audit entry in 05e shows "Preparing → Cancelled · stock not restored" with the reason.
- **C-05. Repeated cancellation (US-11 AC5, US-12 AC7).** The API covers this through the terminal state. No frame shows the `409` state; this is a possible extra error frame, not a gap in the rules.

## 5. ADR notes (kept separate from the audit log)

An **audit log** is a runtime record of what users did (`/audit-logs`). An **ADR** is a design-time record of why the team chose an architecture. They are not the same document.

Evidence:

- ADRs are task S2-16 (owner Ayşe Dural, reviewer Emre Boz), deliverable `docs/architecture/architecture-decisions.md`. Status in the board is "To Do (provisional)". The file is not on `develop`; it is added in open PR #64 (see below).
- `docs/team-roles-raci.md` assigns ADRs to the architect role. No document states what the ADR content must be.

Therefore this review **cannot check ADR requirements**: there are none written in the repository and no ADR to compare against.

Update 18 Nov: PR #64 (head `07fd074`, not merged) adds `docs/architecture/architecture-decisions.md`. Its index lists ADR-006 (roles and late cancellation; order creation by WAITER only is "Proposed (PR #62)"), ADR-008 (no hard deletes, Proposed), ADR-009 (initial stock at creation, Rejected since `07fd074`) and ADR-010 (polling, Accepted). This review has not checked the ADR texts against the screens or against the cancellation requirements; that check is still open.

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
- **O-04. Manager creating orders.** In `api/openapi.yaml`, `POST /orders` (`createOrder`) allows the roles WAITER and MANAGER, and `GET /orders` (`listOrders`) allows MANAGER, CHEF and WAITER. The prototype shows order creation only on the waiter screen (SCR-02); the manager screens have no New order tab. API draft #62 (head `dbb06be`) restricts `createOrder` to WAITER, in line with the System Vision and Burcu's decision. `develop` (0.1.0) still lists both roles, so hiding the manager screen does not settle it: the API, API README and UML must agree. **Decision pending.** `docs/ui-ux/ui-prototype.md` (Section 1) describes the prototype.

## 7. Decisions needed from Burcu

| ID | Question | Related |
|---|---|---|
| D-1 | **Closed:** FR-005 and FR-025 require ingredient and threshold maintenance; the Edit screen exists as `scr-04g-inventory-edit-ingredient` (18 Nov). | F-01 |
| D-2 | `develop` (0.1.0) has no `active` field on ingredients and only offers `DELETE` (`409 RESOURCE_IN_USE`). Backlog US-02 AC6 and API draft #62 say deactivation. **Open:** confirm deactivation and merge PR #62, or revert the three Figma frames. (Needs Ayşe for the API side.) | F-02 |
| D-3 | FR-022 and FR-023 exist as API requirements; SRS §5.1 does not list them as UI. Must the UI show reservations and stock movements, or is API access enough for the MVP? | F-03 |
| D-4 | FR-009 includes creating and archiving menu items; SRS §5.1 does not list a menu-management screen. Is it part of the MVP UI? | F-04 |
| D-5 | **Open (Figma only):** SRS FR-02, backlog US-02 AC1 and API draft #62 (`866122e`) now all describe "start at zero, then adjust" (none merged); `scr-04d` to `scr-04f` still show an optional initial quantity. See D-9b. | F-05 |
| D-6 | FR-004 includes staff administration and the `ORDER_LATE_CANCEL` permission; SRS §5.1 does not list a staff screen. Is it part of the MVP UI? | F-06 |
| D-7 | (For Ayşe, with S2-15/S2-16) Which records and tables back `Order.statusHistory`, `Order.cancellation` and the audit log, and are `cancellation_audit` and `order_status_history` the intended names? **Open:** Ayşe to confirm against her ER draft (see C-01). | C-01 |
| D-8 | (For Ayşe) Reflect the team's 15–30 s polling decision in the architecture documents. | O-01 |

Until these are answered, none of the screens above is declared out of scope, and no P0 item is changed.

Added 18 Nov: **D-9** (for Ayşe and the team) – three separate decisions on API draft #62, each accepted or rejected on its own: **D-9a** ingredient deactivation (soft delete; F-02, D-2), **D-9b** initial stock at creation (F-05, D-5): API draft #62 removed `initialQuantity` in `866122e` and ADR-009 is Rejected in PR #64 (`07fd074`), both not merged; the frames `scr-04d` to `scr-04f`, their PNGs and the PDF still show the optional Initial stock field; removing it and re-exporting is still open, **D-9c** order creation by WAITER only (O-04).

## 7a. Closed findings and update log (18 Nov 2026)

| Item | Status |
|---|---|
| "Edit ingredient missing" (F-01) | **Closed in Figma.** Edit on every row of `scr-04a`, dialog `scr-04g`. |
| "Login error and session-expired states missing" | **Closed in Figma.** `scr-01b-login-error`, `scr-01c-session-expired`. |
| "Kitchen conflict error missing" (FR-019) | **Closed in Figma.** `scr-03d-kitchen-conflict`. |
| Waiter cancel dialog and authorized-waiter late cancel had no frames | **Closed in Figma.** `scr-02d`, `scr-05f`, `scr-05g`, `scr-05h`. |
| General error text in `scr-07a-states` ("Nothing was changed") | **Closed.** The 500 card now reads "We couldn't confirm the result. Refresh to check the latest status." Checked on a screenshot on 18 Nov. |
| Frame count "18" | Replaced by 31 (live check, 18 Nov). |
| `MENU_ITEM_UNAVAILABLE` shown as 409 | Corrected to 422 in `scr-07a-states` (matches the OpenAPI file). |
| Flow 9 transitions (04g → 04h → 04g, 04h → 04i, 04i → 04g) | Verified in the live prototype in a browser by Codex on 18 Nov. Prototype only; no backend involved. Not recorded as broken or missing. |

Status words: **Matches API draft** (follows PR #62, not merged), **Decision pending** (no team confirmation recorded), **Applied in Figma** (exists in the live file and was checked on a screenshot).

## 8. Next steps (proposal)

1. Burcu answers D-2, D-3, D-4 and D-6; Ayşe answers D-2, D-7 and D-8.
2. Tuğçe updates the frames for F-03, F-04 and F-06 as decided. The Edit ingredient screen (D-1) is done.
3. The team decides D-9a, D-9b and D-9c separately. If D-9a is rejected, the deactivation frames (`scr-04g` to `scr-04i`) are revised. For D-9b, the Initial stock field is removed from `scr-04d` to `scr-04f`, and the PNGs, the PDF and the related documents are updated together (the API draft already removed `initialQuantity` in `866122e`). D-9c relates to O-04.
4. This record is updated with the decisions and re-reviewed against the refined backlog (S2-02).
