# PantryChef – UI Design ↔ User Story Consistency Review (S2-31)

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-31 – UI Design–User Story Consistency Review
**Owner:** Tuğçe Çevik · **Reviewer:** Burcu Ücük
**Status:** Draft. Reviews the 39-frame prototype (Figma export of 20 Nov 2026) as a design against the SRS, refined backlog and API merged into `develop` (checked at `7270d63`, 20 Nov; API 0.2.1, wording-only change from 0.2.0). Status update of 21 Nov (`develop` at `46f918d`): this review (#50), the user flows (#70), the UI documents and 39-frame export (#71), the schema (#66) and the ADR status update (#87) are merged; ADR-006 and ADR-008 are Accepted. D-3, D-4 and D-6: PO decision given; frames added to the Sprint 2 prototype (39-frame export of 20 Nov) and reviewed as described in section 7; the API questions in section 7b stay open for Sprint 3 ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Open: O-06, O-08. F-07 / D-9c (order creation role) is resolved in the merged sources. The inactive low-stock rule (CR-03, O-07) is stated in SRS FR-14; #68 records CR-03 as resolved. No requirement or MVP scope is changed by this review.

## 1. Scope, sources and limits

Compared in this review:

| Source | Version used and purpose |
|---|---|
| SRS, `docs/srs.md` | [`develop` at `e197628`](https://github.com/seng321-7th-team/PantryChef/blob/e1976288f9cebfa80073159096ad625aef466f6b/docs/srs.md); FR-01 to FR-14, used for the coverage matrix below. Merged by PR #54 (19 Nov; FR-06 waiter-only wording added in its last commit `422e78d`). FR-14 inactive-ingredient sentence added by PR #89 (merged 20 Nov). Earlier checks used #54 at `0ad80b3`. |
| Refined backlog, `docs/product-backlog.md` | [`develop` at `e197628`](https://github.com/seng321-7th-team/PantryChef/blob/e1976288f9cebfa80073159096ad625aef466f6b/docs/product-backlog.md); US-01 to US-14 and their acceptance criteria. Merged by PR #55 (20 Nov, same content as `986583e`); approved after the earlier changes-requested review on `beba8c6`. Changes since `ec1911a` are in O-03. |
| FR/NFR | `docs/non-functional-requirements.md` on `develop` at `45ae024`; NFR-01 to NFR-15, plus wording differences recorded below. Merged by PR #51 (20 Nov; reviewed at `fc70b81`, merged head `129dc30`). |
| API contract and C4/UML/ER diagrams | [`api/openapi.yaml` on `develop` at `7270d63`](https://github.com/seng321-7th-team/PantryChef/blob/7270d63c6d9e23b87ad46d2d0ea3f5153088af34/api/openapi.yaml), version 0.2.1. Version 0.2.0 was merged by PR #62 (19 Nov; OpenAPI content unchanged since `866122e`, the last PR commits `f061da2`, `1aac5b5` changed diagrams only). Version 0.2.1 (PR #91, 20 Nov) changes wording only, with no schema change; Ayşe confirmed that it does not affect the D-3, D-4 and D-6 screens ([comment](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7039943114)). Earlier checks used `e197628` (API 0.2.0). |
| ADRs | [`architecture-decisions.md` on `develop`](https://github.com/seng321-7th-team/PantryChef/blob/e1976288f9cebfa80073159096ad625aef466f6b/docs/architecture/architecture-decisions.md), merged by PR #64 (18 Nov). ADR-004 to ADR-010 read for the rules relevant to the UI. ADR-006 (including WAITER-only creation) and ADR-008 are Accepted since [PR #87](https://github.com/seng321-7th-team/PantryChef/pull/87) was merged on 20 Nov; earlier checks recorded them as Proposed. |
| Database schema | [PR #66](https://github.com/seng321-7th-team/PantryChef/pull/66), checked at `fa446c1`; cancellation/history mapping and transaction outlines. Proposed DDL, not runtime evidence. Merged by PR #66 (20 Nov). |
| Architecture consistency review | `docs/architecture/consistency-review.md`, merged by [PR #68](https://github.com/seng321-7th-team/PantryChef/pull/68) (20 Nov). CR-01 confirmed by Burcu in [her review of #68](https://github.com/seng321-7th-team/PantryChef/pull/68#pullrequestreview-5957095073) on 18 Nov; CR-01, CR-03, CR-04, CR-05 and CR-07 resolved; CR-02 and CR-06 partly resolved. Earlier checks at `46e8d1c` and `9b4d21b` still listed CR-03 as open. |
| UI deliverables | [PR #70](https://github.com/seng321-7th-team/PantryChef/pull/70) (flows); [PR #71](https://github.com/seng321-7th-team/PantryChef/pull/71) (three documents, 39 PNGs and the 39-page Figma PDF export of 20 Nov). Figma page "03 Screens v2" with 13 flow starting points. Earlier review rounds used the 32-frame export of 18 Nov, 23:47. Both PRs were merged on 20 Nov (#71 as `ca96339`, #70 as `4a462cb`). |
| Historical baseline | `develop` at `5dd8253`: API 0.1.0, Sprint 1 backlog, task board and RACI. The files used from `0c3e244` are identical at `5dd8253`. Superseded on `develop` by PR #54, #55 and #62; kept only to explain earlier findings. |
| Historical SRS | PR #45 at `d34389a`, FR-001 to FR-027. Retained only in section 2b for traceability to the original review. #54 is merged; #45 was closed without merge on 20 Nov. |

Rules followed:

- A missing screen is **not** treated as "out of scope". All User Stories below are P0 in the backlog, so a scope change needs Burcu's decision (section 7).
- This file records findings and options only. It does not change the backlog, the OpenAPI file or the Figma design.

Limits of the evidence:

- No runtime authentication, transactions, inventory effects, concurrency, performance or browser-compatibility tests are claimed from Figma. Role selection and "Preview as" are demo aids.
- The SRS (#54), refined backlog (#55), FR/NFR (#51), API and diagrams (#62, wording update #91), FR-14 clarification (#89), ADRs (#64) the consistency review (#68), the schema (#66), the ADR status update (#87) and the UI deliveries (#50, #70, #71) are merged into `develop`.
- Source documents and diagram notes were compared. This review does not approve or re-review the merged sources.
- The views decided on 20 Nov (D-3, D-4, D-6) are drawn in the 39-frame export. A merged PR does not mean that every addition in it was reviewed separately; the review records are in section 7. Some results in the prototype are Figma variable states (for example the Cancelled #1042, Menemen v4, the Tomatoes 14500 / 14150 result and Bulgur); the PDF and PNG files show start values only. Remaining gaps are not silently removed from P0 requirements.

## 2. What matches

| Area | Evidence in Figma | Source |
|---|---|---|
| `PENDING` reserves, does not deduct | Kitchen board: "Reserved · stock not deducted yet" | US-07, OpenAPI `/orders/{orderId}/status` |
| `PREPARING` deducts once | Kitchen board: "Stock deducted once"; 03b "Deducting stock…" with a lock on one order | US-09, OpenAPI (`Idempotency-Key`, `409 INVALID_STATUS_TRANSITION`) |
| `READY` does not move stock | 03e: "Order #1042 is now Ready. No additional stock was deducted." | US-10 AC3, OpenAPI transition table |
| `PENDING` cancel releases reservations, physical stock unchanged | 05d dialog | US-11 AC3–4, OpenAPI transition table |
| Late cancel: manager or waiter with permission, reason required, stock not restored | 05b dialog, 05c 403, 05e result | US-12 AC1–3, 6, OpenAPI (`LATE_CANCEL_NOT_PERMITTED`, `CANCELLATION_REASON_REQUIRED`) |
| `NEGATIVE_AVAILABLE_STOCK` on adjustment | 04c | OpenAPI `/inventory/adjustments` |
| `INSUFFICIENT_STOCK` blocks the whole order | 02b | US-06, US-07 |
| Recipe versions kept by existing orders | 06a, 06b, audit entry `RECIPE_UPDATED` | US-05 AC6, OpenAPI `/recipes/{menuItemId}` |
| Low-stock banner and threshold status | 04a | US-14 AC2, 4 |
| No delivery feature | No delivery screen or status in any frame | Backlog section 2.3 |

## 2a. Current SRS and backlog coverage (PR #54 / PR #55)

This matrix uses SRS FR-01 to FR-14 and the corresponding US-01 to US-14. Coverage means visible design or described behavior, not implementation acceptance. Both documents are merged into `develop` (PR #54, PR #55); the older SRS PR #45 was closed without merge on 20 Nov and is retained only as a historical reference.

| SRS / story | Requirement | Frames / flow | UI evidence and remaining limit |
|---|---|---|---|
| FR-01 / US-01 | Roles and protected actions | `scr-01`, `scr-01b`, `scr-01c`, `scr-05c`, `scr-05f`–`scr-05h`, `scr-08a`; U1a/U2/U12 | Role screens and authorization/error states are drawn. Real sign-in/server checks are not implemented. Late-cancel permission assignment: `scr-08a` (D-6, frame added 20 Nov; review records in section 7). |
| FR-02 / US-02 | Ingredient maintenance | `scr-04a`, `scr-04d`–`scr-04i`; U5/U6 | Create at zero stock, edit, deactivate and reactivate are drawn. Soft delete follows API 0.2.0 (merged); ADR-008 is Accepted (PR #87). Not a missing-screen finding. |
| FR-03 / US-03 | Physical, reserved and available quantities | `scr-04a`; U5 | Quantities are visible; `available = onHand - reserved` is the rule. Static values do not verify runtime invariants. |
| FR-04 / US-04 | Authorized adjustments with reason | `scr-04b`, `scr-04c`; U5 | Adjustment dialog and negative-available error drawn. Opening stock uses a separate `INITIAL_STOCK` adjustment. No real mutation is performed. |
| FR-05 / US-05 | Recipes and preserved requirements | `scr-06a`, `scr-06b`, `scr-06c`, `scr-06e`, `scr-06f`, `scr-06h`; U8, U11 | Edit/version history shown; existing orders keep their version. Creating a menu item with its initial recipe: `scr-06c`, `scr-06e`, `scr-06f`, `scr-06h` (F-04/D-4, frames added 20 Nov; review records in section 7). |
| FR-06 / US-06 | Waiter order creation | `scr-02a`–`scr-02c`; U1 | Waiter-only creation, Pending result and rejection states drawn. Matches SRS FR-06, backlog US-06 AC1 and API 0.2.0, all merged (F-07). ADR-006 is Accepted (PR #87). |
| FR-07 / US-07 | Atomic reservation and duplicate protection | `scr-02b`, `scr-02c`; U1 | Shortage and accepted-order states drawn; retry key rule described. Concurrency, all-or-nothing behavior and replay need backend tests. |
| FR-08 / US-08 | Kitchen queue | `scr-03a`–`scr-03e`; U3/U4 | Order identifiers/items/quantities/statuses visible. Polling behavior described from ADR-010, not executed by Figma. |
| FR-09 / US-09 | Start preparation and consume once | `scr-03a` → `scr-03b` → `scr-03c`; U3 | Preparation states shown. `ACTIVE → CONSUMED`, equal reduction of onHand/reserved; no runtime proof of exactly-once deduction. |
| FR-10 / US-10 | Mark Ready | `scr-03c` → `scr-03e`, `scr-03d` → `scr-03e`; U3/U4 | Mark as ready on #1042 leads to `scr-03e-kitchen-ready` (#1042 `Ready`, counters 2 / 1 / 2, "No additional stock was deducted"). Demo interactions cover #1042 only; the faded buttons on other orders are a prototype limit, not a product rule. Prototype navigation and displayed counters verified on 18 November 2026; no runtime proof. |
| FR-11 / US-11 | Pending cancellation | `scr-02d`, `scr-05d`; U2/U7 | Dialogs describe `ACTIVE → RELEASED`, onHand unchanged. Since 20 Nov, Cancel order on Pending #1042 shows it as `Cancelled` in the manager list and removes it from the waiter's open orders (Figma variable state, one example; not a persisted backend result). |
| FR-12 / US-12 | Exceptional cancellation | `scr-05b`, `scr-05c`, `scr-05e`–`scr-05h`; U2/U7 | Manager/authorized waiter, 3–500-character reason, rejection and result/audit states drawn; no automatic stock restore. |
| FR-13 / US-13 | Traceable order/inventory history | `scr-05a`, `scr-05e`, `scr-04j`, `scr-04k`; U7, U10 | Audit log, stock movements (`RESERVE`, `RELEASE`, `CONSUME`, `ADJUSTMENT`) and reservations (`ACTIVE`, `RELEASED`, `CONSUMED`) shown with sample records (F-03/D-3, frames added 20 Nov; review records in section 7). Only the All types / RESERVE filter is interactive. |
| FR-14 / US-14 | Low-stock monitoring | `scr-04a`, `scr-04d`, `scr-04g`, `scr-04h`; U5/U6 | Threshold display/edit, banner and low-stock filter drawn. SRS FR-14 (PR #89) and API 0.2.0 exclude deactivated ingredients from alerts; `scr-04h` states it. Backlog US-14 does not mention the exception. No implementation or test (O-07). |

### NFR evidence boundaries

| NFR | Evidence in this prototype/review | Verification still required |
|---|---|---|
| NFR-01 | No measured response-time claim | Agreed workload/environment and performance tests |
| NFR-02 | No measured transaction-time claim | Backend transaction/performance tests |
| NFR-03 | Atomic behavior explained by order/error states | Real rollback/failure-injection tests |
| NFR-04 | Inventory columns and invariant explained | Concurrency and invariant tests |
| NFR-05 | Retry and exactly-once rules documented | Actual idempotency/repeated-request tests |
| NFR-06 | Role navigation and 403 state shown | Server-side positive/negative authorization tests |
| NFR-07 | Required-name, quantity/reason constraints and error states illustrated | Actual validation implementation and boundary tests |
| NFR-08 | Audit example contains actor, time and reason | Actual audit persistence and access controls |
| NFR-09 | Success, validation, stock, permission and error feedback drawn | Reviewer/usability acceptance of the screens |
| NFR-10 | Waiter/Chef/Manager areas, stock/order states distinguished | Reviewer acceptance; demo role selection is not security |
| NFR-11 | No code-level modularity claim | Architecture/code review of the implementation |
| NFR-12 | Compared with pinned OpenAPI versions; draft differences explicit | API implementation/contract tests and reviewed changes |
| NFR-13 | Figma access checks do not verify application compatibility | Actual Chrome/Firefox functional testing |
| NFR-14 | No automated business-rule test claim | Implementation tests and CI reports |
| NFR-15 | Failure behavior illustrated/described only | Real transaction failure and rollback tests |

The numeric performance targets remain proposed in Burcu's drafts; UI review does not approve or demonstrate them.

## 2b. Historical SRS cross-reference (PR #45)

Source: `docs/srs.md` in PR #45 (Issue #44), **closed without merge on 20 Nov**. This table records the original review against OQ-02. It is historical and must not be used as the current Sprint 2 FR mapping.

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

The identifiers above belong only to PR #45. For example, its FR-012 means order creation, while PR #54 FR-12 means exceptional cancellation. The current comparison is section 2a. Old gap IDs remain stable, but their current requirement references are FR-05/US-05 (recipe creation), FR-13/US-13 (history) and SRS §8 question 2 (staff-management scope).

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

### F-02 – Ingredient deactivation: screens present, requirement and API merged

| | |
|---|---|
| User Story | US-02 AC6 "Deactivation does not invalidate historical order records" |
| Historical merged API 0.1.0 | `DELETE /ingredients/{ingredientId}` (`deleteIngredient`) deletes only if unused and may return `409 RESOURCE_IN_USE`; old `IngredientInput` has no `active`. This is the historical difference, not the behavior of draft #62, which uses `deactivateIngredient` and soft delete. |
| Figma | **Updated 18 Nov:** `scr-04g` (Status Active, "Deactivate ingredient"), `scr-04h-deactivate-confirm`, `scr-04i-inventory-inactive-ingredient` (Inactive badge, "Reactivate ingredient"). Follows API 0.2.0 (merged in PR #62; the deactivation part is unchanged since `dbb06be`): `DELETE` is a soft delete returning `200`, `PUT` with `active: true` reactivates, `INGREDIENT_DEACTIVATED` / `INGREDIENT_REACTIVATED` audit actions. ADR-008 was Proposed at that time and is Accepted since PR #87. |
| Gap | SRS FR-02, backlog US-02, API 0.2.0 (all merged) and Figma say deactivate/reactivate. The screen gap is closed, including CR-04 in #68. Deactivate/Reactivate remain separate from Save changes. |
| Options | No Figma change needed. ADR-008 is Accepted since [PR #87](https://github.com/seng321-7th-team/PantryChef/pull/87) was merged. Do not revert or expand Figma unless the team explicitly changes the business rule. |

### F-03 – Reservation and consumption events are not visible in the UI

| | |
|---|---|
| User Story | US-13 AC2 "Reservation, consumption, cancellation, and inventory adjustment events are traceable"; AC4 "Authorized managers can view audit history" |
| OpenAPI | `GET /audit-logs` (Manager; actions `ORDER_CANCELLED`, `ORDER_LATE_CANCELLED`, `STOCK_ADJUSTED`, `RECIPE_UPDATED`, `USER_PERMISSIONS_CHANGED`). `GET /inventory/movements` (Manager; types `RESERVE`, `RELEASE`, `CONSUME`, `ADJUSTMENT`). `GET /reservations` (Manager, Chef). |
| Figma | 05a and 05e show the audit log (cancel, stock adjustment, recipe update); the log has no filter (the API supports `action`, `entityId`, `from`, `to`). **Added 20 Nov:** Inventory history with `scr-04j-stock-movements` (types, change, on hand after, reserved after, performed by, order or reason; filters Ingredient, Order ID, Type, Date range) and `scr-04k-reservations` (status, created, resolved, order item ID). Opened with History on `scr-04a`. |
| Gap | In the API, reservation and consumption are recorded as **stock movements**, not as audit-log actions. Before 20 Nov the UI showed only the audit log. The new frames cover AC2 and AC4 at design level; the review records are in section 7. Open API questions are in section 7b. |
| Options | **Decided:** add a Stock Movements view for managers covering reservation, release, consumption and adjustment events ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Frames `scr-04j` and `scr-04k` added to the Sprint 2 prototype on 20 Nov; review records in section 7. API basis in section 7b. |

### F-04 – No screen to create a new recipe

| | |
|---|---|
| User Story | US-05 AC1 "A manager can create and update recipes" |
| OpenAPI | `PUT /recipes/{menuItemId}` (`replaceRecipe`) updates. `POST /menu-items` (`createMenuItem`) creates a menu item **together with** its recipe ("A menu item cannot be created without a recipe", version starts at 1). |
| Figma | 06a lists the existing menu items. 06b is "Edit recipe" with "+ Add ingredient". **Added 20 Nov:** New menu item on 06a opens `scr-06c-new-menu-item` (name, price, description, active, initial recipe lines); `scr-06f` shows "Quantity per portion must be greater than 0."; Create leads to `scr-06e-menu-item-created` (initial recipe v1) and `scr-06h-recipes-after-create`. |
| Gap | Recipe creation is only possible through creating a menu item. Before 20 Nov the prototype had neither; the new frames cover creation with an initial recipe. Editing or archiving a menu item is still not drawn, and the backlog does not list menu-item management as a User Story. The review records are in section 7. |
| Options | **Decided:** add a New Menu Item flow that creates a menu item together with its initial recipe ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Frames `scr-06c`, `scr-06e`, `scr-06f` and `scr-06h` added to the Sprint 2 prototype on 20 Nov; review records in section 7. API basis in section 7b. |

### F-05 – Initial stock: historical mismatch, resolved in merged sources and Figma

| | |
|---|---|
| User Story | Historical Sprint 1 AC1 included quantity at creation. Backlog US-02 AC2–AC3 (merged, PR #55): "Newly created ingredients have onHand = 0 and reserved = 0"; "Initial physical stock is recorded separately through an authorized INITIAL_STOCK inventory adjustment." SRS FR-02 (merged, PR #54) initializes physical stock to zero. |
| API 0.2.0 (merged, PR #62) | `IngredientCreate` requires `name`, `unit`, `lowStockThreshold`; onHand/reserved start at zero. Opening stock is a separate `POST /inventory/adjustments` with reason `INITIAL_STOCK` (an `ADJUSTMENT` stock movement and an audit entry). Historical API 0.1.0 named the input `IngredientInput`. |
| Figma | **Updated 18 Nov (re-export at about 01:35):** `scr-04d`, `scr-04e` and `scr-04f` have no Initial stock field; helper text "Starts with 0 stock. Add stock using Adjust." The earlier 18 Nov export had an optional "Initial stock" field (helper "Leave blank to start at 0. You can add stock later."). |
| Gap | **Closed.** SRS FR-02, backlog US-02 AC2–AC3 and API 0.2.0 are merged into `develop`; ADR-009 is Rejected; the re-exported frames follow the same rule. Schema PR #66 (merged) describes the same rule. Earlier unmerged checks: #55 at `beba8c6`, #62 at `866122e` (removed the optional `initialQuantity` that `dbb06be` had), schema at `5475872`. |
| Options | No Figma change is left. Burcu confirmed CR-01 on 18 Nov ([review](https://github.com/seng321-7th-team/PantryChef/pull/68#pullrequestreview-5957095073)). (See D-5, D-9b.) |

### F-06 – No screen to grant the late-cancel permission to a waiter

| | |
|---|---|
| User Story | US-01 AC6 "Authorized cancellation after preparation begins requires the appropriate permission"; US-12 AC2 "A waiter may perform this action only with specific authorization" |
| OpenAPI | `POST /users` and `PUT /users/{userId}` (Manager) set `permissions` (`ORDER_LATE_CANCEL`). Permission changes are audited as `USER_PERMISSIONS_CHANGED`. |
| Figma | 05a–05e have a "Preview as: Manager / Authorized waiter / Waiter" switch. The switch is a prototype aid only (the login frame says so for roles). **Added 20 Nov:** `scr-08a-staff-permissions` lists active waiters with their saved late-cancel access and lets the manager grant or remove `ORDER_LATE_CANCEL` for Deniz Yilmaz with Save or Cancel ("Other permissions and account details remain unchanged"). Saving does not change the separate Preview as switch. |
| Gap | Before 20 Nov the permission could be exercised in the UI but not assigned. The new frame covers assignment at design level; the review records are in section 7. No User Story explicitly requires a full user-management screen. |
| Options | **Decided:** add a staff-permissions view where managers assign or revoke `ORDER_LATE_CANCEL` ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Frame `scr-08a` added to the Sprint 2 prototype on 20 Nov; review records in section 7. API basis in section 7b. |

### F-07 – Order creation role: resolved in merged sources

| | |
|---|---|
| User Story | Backlog US-06 AC1 (merged, PR #55): "Only an authorized Waiter can create an order by selecting valid menu items and positive portion quantities. Managers and Chefs are not permitted to create orders." |
| SRS / OpenAPI | SRS FR-06 (merged, PR #54): "The system shall allow only authorized Waiters to create orders … Restaurant Managers and Chefs/Kitchen Staff shall not be permitted to create orders." API 0.2.0 `createOrder` (merged, PR #62): "Roles: WAITER"; the lifecycle table lists Waiter for `POST /orders`. |
| Figma | Order creation exists only on the waiter screen (`scr-02a`–`scr-02c`); there is no manager order screen. |
| Status | Resolved: SRS, backlog and API on `develop` and the Figma design all say WAITER. ADR-006, including WAITER-only creation, is Accepted since [PR #87](https://github.com/seng321-7th-team/PantryChef/pull/87) was merged on 20 Nov. See O-08 for a backlog note that still describes API 0.1.0. |
| History | At `ec1911a` US-06 AC1 read "A waiter can select menu items and positive portion quantities." At `beba8c6` (18 Nov) it read "An authorized Waiter or Manager can create an order …", which conflicted with SRS FR-06 and API #62; changes were requested on #55 for this ([review](https://github.com/seng321-7th-team/PantryChef/pull/55#pullrequestreview-5960692446)). `986583e` (19 Nov) restricted it to Waiter; #55 was approved and merged on 20 Nov. |
| Options | No UI change. The Figma design stays waiter-only. (See D-9c.) |

## 4. Cancellation records

What the repository defines today (all from `api/openapi.yaml` unless stated):

| Case | Allowed by | Stock effect | Records in the API |
|---|---|---|---|
| `PENDING` → `CANCELLED` | Waiter, Manager | `ACTIVE` reservations become `RELEASED`; `onHand` unchanged. A `RELEASE` stock movement is recorded. | `Order.statusHistory` entry; `Order.cancellation` (`late: false`); audit action `ORDER_CANCELLED`. Reason optional. |
| `PREPARING` / `READY` → `CANCELLED` | Manager, or Waiter with `ORDER_LATE_CANCEL` | None. Consumed stock is not restored and reservations are not released again. Corrections only via `POST /inventory/adjustments` (reason `LATE_CANCELLATION_CORRECTION`). | `Order.statusHistory` entry; `Order.cancellation` (`late: true`, `previousStatus`, `reason`, `cancelledBy`, `cancelledAt`); audit action `ORDER_LATE_CANCELLED` (actor, time, reason, previous status). Reason required (`422 CANCELLATION_REASON_REQUIRED`). |
| Repeated cancellation | Same role/permission checks; optional status Idempotency-Key | If a completed request is replayed with the same scoped key/body, return its saved response without new effects. A new/unmatched transition from terminal CANCELLED returns `409 INVALID_STATUS_TRANSITION`. Reusing a key with a different body returns `422 IDEMPOTENCY_KEY_REUSED`. | Replay is not another cancellation event or stock movement. |

Findings:

- **C-01. Cancellation/history storage is specified.** The ER diagram (merged, PR #62) and schema PR #66 (merged 20 Nov; checked at `fa446c1`) define `order_status_history`, cancellation columns on `orders` (`cancelled_by`, `cancelled_at`, `cancel_reason`, `previous_status`, `late_cancellation`) and `audit_logs`; there is no `cancellation_audit` table. These correspond to `Order.statusHistory`, `Order.cancellation` and the audit API. Ayşe records this as resolved in #68 R-03. D-7 is answered at design level; runtime migration checks remain separate. An earlier "no document exists" statement referred only to the older checkout.
- **C-02. Late cancel has its own action.** The API uses `ORDER_LATE_CANCELLED`, separate from `ORDER_CANCELLED`. Figma 05e shows `ORDER_LATE_CANCELLED` and 05a shows `ORDER_CANCELLED`, so UI and API agree. The backlog (US-13 AC1–3) does not name the actions.
- **C-03. Late cancellation leaves no stock movement.** `StockMovementType` has no entry for it, which matches "stock not restored". The cancellation is traceable only through the audit log and `Order.cancellation`. The Stock movements view (`scr-04j`, F-03) states that late cancellation does not restore stock or create a stock movement.
- **C-04. Rules in the UI are consistent with the API:** waiter sees "Ask a manager to cancel" on `PREPARING` (02a), a disabled "Late cancel…" without permission (05c), the stock warning and mandatory reason in 05b, and optional reason for `PENDING` in 05d. The audit entry in 05e shows "Preparing → Cancelled · stock not restored" with the reason.
- **C-05. Repeated cancellation (US-11 AC5, US-12 AC7).** Both a matching idempotent replay and a rejected new transition from CANCELLED leave stock unchanged. No frame demonstrates this network behavior; backend tests are required. The optional replay header must not be omitted from the rule description.

## 5. ADR notes (kept separate from the audit log)

An **audit log** is a runtime record of what users did (`/audit-logs`). An **ADR** is a design-time record of why the team chose an architecture. They are not the same document.

Evidence:

- [ADR document #64 at `60d1a8b`](https://github.com/seng321-7th-team/PantryChef/blob/60d1a8ba08c21d8e07f873a4fe218c15c36dfae7/docs/architecture/architecture-decisions.md) has been read for the UI-related rules and is merged into `develop` (`3688747`). It is an architecture record, not runtime audit evidence. The merge does not make Proposed records Accepted.
- ADR-004 (Proposed): Pending reserves, Preparing consumes once, Ready does not move stock, Pending cancellation releases. Matches the UI descriptions.
- ADR-005 (Proposed): keys are user/operation-scoped, claimed in the business transaction; a completed matching request replays. Network retries do not imply the first request committed. Matches the qualified retry rule in U1.
- ADR-006 (Accepted): cancellation policy (D-12) and WAITER-only creation. The WAITER-only part was Proposed until PR #87 was merged on 20 Nov. SRS, backlog and API 0.2.0 say WAITER only, and the design matches.
- ADR-007 (Proposed): immutable recipe versions and order snapshots. Matches 06a/06b; the initial recipe is drawn as version 1 in `scr-06c`/`scr-06e` (D-4).
- ADR-008 (Accepted since PR #87): ingredient soft delete, retained history and existing Pending orders; matches 04g/04h/04i and the merged API 0.2.0.
- ADR-009 (Rejected): optional stock-at-creation proposal retained as history. Current design starts at zero then adjusts.
- ADR-010 (Accepted in the ADR document): kitchen polling every 15–30 seconds. C4 Container #62 also records it. D-8's architecture-document update is complete; Figma itself does not poll.

No new architecture decision is approved by this UI comparison. ADR-001's written team-choice record and other Proposed decisions remain with their owners. The open UI coverage decisions below are preserved.

## 6. Other observations

- **O-01. "Updates automatically" (kitchen board).** ADR-010 and C4 Container #62 now document polling every 15–30 seconds. OpenAPI describes the request, not a push channel. The UI and architecture descriptions align; live background refresh still needs implementation testing. D-8 is answered at documentation level.
- **O-02. Login placeholder contrast.** Checked; no contrast fix needed. The username placeholder ("e.g. waiter01") in `scr-01-login` is `#6B7280` on `#FFFFFF`, both at 100% opacity. The calculated contrast ratio is 4.83:1, above the WCAG 2.1 AA minimum of 4.5:1 for normal text (checked on 18 November 2026). The frame was not changed.
- **O-03. Backlog version.** The current matrix and gaps have been re-checked against the merged backlog (`develop` at `e197628`, PR #55). Changes since `ec1911a`: US-02 acceptance criteria at `beba8c6` (zero stock at creation and a separate `INITIAL_STOCK` adjustment; matches F-05) and US-06 AC1 (Waiter or Manager at `beba8c6`, Waiter only at `986583e`; F-07). The Sprint 1 backlog remains only a historical baseline.
- **O-04. Manager creating orders.** Historical API 0.1.0 allowed WAITER and MANAGER on createOrder. API 0.2.0 on `develop` (PR #62) restricts creation to WAITER in OpenAPI, README and UML; Ayşe confirmed this in her #62 response and #68 R-02. SRS FR-06, backlog US-06 AC1 and the waiter-only Figma agree (F-07). GET /orders remains available to MANAGER, CHEF and WAITER.

- **O-06. Burcu's consumption terminology is not fully synchronized.** SRS FR-09 and backlog US-09 AC4 (both merged) say `ACTIVE → CONSUMED`, matching the UI/API. On `develop`, SRS §3.2 still says "consumed/released" and §6.3 scenario 4 says "releases"; FR/NFR FR-09 (merged by #51) also says "release". Burcu stated on 20 Nov that she will address the terminology in the requirements documentation. Ask Burcu to use CONSUMED for preparation and RELEASED only for Pending cancellation; do not change the UI to the older wording.
- **O-07. Inactive low-stock rule.** Clarified at requirement level: SRS FR-14 states "Deactivated ingredients shall not raise low-stock alerts." (PR #89, merged 20 Nov), matching API 0.2.0 (`listLowStockAlerts`: "Inactive ingredients are not alerted"). Backlog US-14 does not mention the exception. `scr-04h` states the rule; this review did not check the low-stock banner frames for an inactive ingredient. No implementation or test covers it. #68 (merged 20 Nov) records CR-03 as resolved by #89.
- **O-08. Backlog API note.** The merged backlog keeps an "API alignment action — order creation" note saying that the OpenAPI draft lists `WAITER, MANAGER` for `POST /orders`. API 0.2.0 on `develop` lists WAITER only; the note describes API 0.1.0. Owner: Burcu (backlog). No UI change is needed.

## 7. Product Owner decisions

| ID | Question / disposition | Related |
|---|---|---|
| D-1 | Closed in Figma: ingredient and threshold edit exists in `scr-04g`. | F-01 |
| D-2 | Resolved in merged sources: SRS FR-02, backlog US-02 and API 0.2.0 say deactivation; 04g–04i exist, #68 CR-04 resolved. ADR-008 is Accepted (PR #87). No automatic rollback to hard delete. | F-02, D-9a |
| D-3 | **PO decision given; frames added to the Sprint 2 prototype (39-frame export of 20 Nov); review records below.** Burcu decided to include a Stock Movements view for managers to inspect reservation, release, consumption and adjustment events (SRS FR-13, US-13 AC2/4) ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Frames: `scr-04j`, `scr-04k`. | F-03 |
| D-4 | **PO decision given; frames added to the Sprint 2 prototype (39-frame export of 20 Nov); review records below.** Burcu decided to include a New Menu Item flow that creates a menu item together with its initial recipe (US-05 AC1) ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Frames: `scr-06c`, `scr-06e`, `scr-06f`, `scr-06h`. | F-04 |
| D-5 | Closed: SRS FR-02, backlog US-02 AC2–AC3 and API 0.2.0 (merged) and the Figma frames all create at zero then adjust; ADR-009 is Rejected. Burcu confirmed CR-01 on 18 Nov ([review](https://github.com/seng321-7th-team/PantryChef/pull/68#pullrequestreview-5957095073)). Schema #66 is merged. | F-05, D-9b |
| D-6 | **PO decision given; frames added to the Sprint 2 prototype (39-frame export of 20 Nov); review records below.** Burcu decided to include a staff-permissions view where managers assign or revoke `ORDER_LATE_CANCEL` ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). SRS §8 question 2 (scope of all `/users` operations) is not changed by this decision. Frame: `scr-08a`. | F-06 |
| D-7 | Answered in the merged ER diagram and the schema draft: `order_status_history`, cancellation columns on `orders`, `audit_logs`; #68 R-03 records the mapping. Schema #66 is merged; migration/runtime validation is pending, not the table-name question. | C-01 |
| D-8 | Answered in ADR-010 and C4 Container #62: 15–30 s polling. Frontend implementation/test remains pending. | O-01 |

The requirement decisions for D-3, D-4 and D-6 are recorded, and the matching frames were added to the Sprint 2 prototype in the 39-frame export of 20 Nov. Review records for these frames: Burcu approved PR #50 at `a745b47` after checking the D-3, D-4 and D-6 frames against her decisions (design and requirements consistency, not implementation testing). Bilgesu reviewed the static exports of the seven added frames and found no blocking visual inconsistencies ([PR #71 comment](https://github.com/seng321-7th-team/PantryChef/pull/71#issuecomment-7046524812)). No separate review is recorded for the other changes of the 39-frame export (for example the manager menu on 22 frames) or for the U10–U12 flows in PR #70; the merges of #70 and #71 do not change that. The earlier Chef-path approval at `44ea8c4` covers the 32-frame version. No missing P0 capability is declared out of scope by this review.

**D-9 remains three separate dispositions:** D-9a soft delete is in the merged SRS, backlog and API; ADR-008 is Accepted (PR #87). D-9b zero-stock creation is in the merged SRS, backlog and API and in Figma; CR-01 is confirmed; schema #66 is merged. D-9c WAITER-only creation is in the merged SRS, backlog and API and in Figma (F-07); ADR-006 is Accepted (PR #87). "Merged into `develop`", "Accepted in the ADR record" and "implemented" are different states.

## 7b. API basis for D-3, D-4 and D-6 (`develop` at `e197628`, API 0.2.0)

Source: [`api/openapi.yaml`](https://github.com/seng321-7th-team/PantryChef/blob/e1976288f9cebfa80073159096ad625aef466f6b/api/openapi.yaml). Gaps are listed as questions; no field or endpoint is added here. Ayşe confirmed that this basis is correct for `develop` and that API 0.2.1 (PR #91, wording only) does not affect these screens ([comment](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7039943114)). The frames added on 20 Nov (`scr-04j`, `scr-04k`, `scr-06c`, `scr-06e`, `scr-06f`, `scr-06h`, `scr-08a`) use only the fields below; they do not answer the open questions. API 0.2.1 states one reservation per order item and ingredient, which `scr-04k` also shows.

Status of 21 Nov: the questions below are still open. They are not Sprint 2 release blockers; Ayşe will answer them for Sprint 3 ([PR #96 review](https://github.com/seng321-7th-team/PantryChef/pull/96#pullrequestreview-5999423412)).

| Decision | Endpoints and roles | Data the UI can show or send | Open API questions |
|---|---|---|---|
| D-3 Stock Movements | `GET /inventory/movements` (MANAGER): filters `ingredientId`, `orderId`, `type`, `from`, `to`, `page`, `size` (max 100); newest first. `GET /reservations` (MANAGER, CHEF): filters `orderId`, `ingredientId`, `status`. `GET /ingredients` for names and units. | Movement: `type` (`RESERVE`, `RELEASE`, `CONSUME`, `ADJUSTMENT`), signed `quantity` (change of `reserved` for RESERVE/RELEASE, of `onHand` for CONSUME/ADJUSTMENT), `onHandAfter`, `reservedAfter`, `orderId`/`reservationId` (not for adjustments), `reason` and `note` (adjustments), `performedBy`, `createdAt`. Reservation: `ingredientName`, `unit`, `quantity`, `status` (`ACTIVE`, `RELEASED`, `CONSUMED`), `createdAt`, `resolvedAt`. | Movements return `ingredientId` only, no name or unit; orders appear as `orderId`, not `orderNumber`. Late cancellation creates no movement (C-03). |
| D-4 New Menu Item | `POST /menu-items` (MANAGER), body `MenuItemCreate`; ingredient picker from `GET /ingredients?active=true`. | `name` (required, 1–100), `price` (required, ≥ 0, TRY), `description` (optional, ≤ 500), `active` (optional, default true), `recipe.lines` (required, at least 1): `ingredientId` + `quantity` per portion (> 0, in the ingredient's unit; each ingredient once). Response `201 MenuItem`; recipe version 1. Errors: `400`, `403`, `409`, `422` (`INGREDIENT_INACTIVE`, validation). | Menu-item name uniqueness and the meaning of `409` for this operation are not specified. The error code for a repeated ingredient line is not specified. No audit action exists for menu-item creation. |
| D-6 Staff permissions | `GET /users` (MANAGER): filters `role`, `active`, `page`, `size`. `PUT /users/{userId}` (MANAGER), body `UserUpdate`. | List: `username`, `fullName`, `role`, `permissions`, `active`. `UserUpdate` requires `fullName`, `role`, `permissions` and `active`, so the UI sends the full current values with `ORDER_LATE_CANCEL` added to or removed from the `permissions` array; other values stay as they are. The change is audited as `USER_PERMISSIONS_CHANGED`. The permission is meaningful for waiters; managers can always late-cancel. | No partial update or version check: two managers editing the same user can overwrite each other. Behavior for `ORDER_LATE_CANCEL` on a chef or manager account is not specified. The access token carries role and permissions; when a change reaches an already signed-in waiter is not specified. The `422` codes for `PUT /users/{userId}` are not listed. |

## 7a. Closed findings and changes (18–20 Nov 2026)

| Item | Status |
|---|---|
| Missing frames from the first review: edit ingredient (F-01), login error and session expired, kitchen conflict (FR-019), waiter cancel dialog, authorized-waiter late cancel | **Closed in Figma:** `scr-04g`, `scr-01b`, `scr-01c`, `scr-03d`, `scr-02d`, `scr-05f` to `scr-05h`. |
| Frame count | 18 → 31 → 32 (Figma export of 18 Nov, 23:47, adds `scr-03e-kitchen-ready`) → 39 (Figma export of 20 Nov adds `scr-04j`, `scr-04k`, `scr-06c`, `scr-06e`, `scr-06f`, `scr-06h`, `scr-08a`; the 22 manager frames share one menu). Seven optional frames are outside the delivery. |
| Mark as ready had no prototype target (FR-10/US-10) | **Closed in Figma** for the #1042 demo: `scr-03c` → `scr-03e` and `scr-03d` → `scr-03e`. Prototype navigation and displayed counters verified on 18 November 2026; result screenshots recorded. |
| Optional Initial stock field in `scr-04d` to `scr-04f` (F-05, D-9b) | **Closed in Figma** (re-export of 18 Nov, about 01:35). CR-01 confirmed in the #68 review. |
| Error texts in `scr-07a-states` | 500 card reads "We couldn't confirm the result. Refresh to check the latest status."; `MENU_ITEM_UNAVAILABLE` shown as 422 (matches the OpenAPI file). |
| Login placeholder contrast (O-02) | Checked; no fix needed (4.83:1, see O-02). |
| Flow 9 transitions (04g → 04h → 04g, 04h → 04i, 04i → 04g) | Verified in the live prototype on 18 Nov. Prototype only. |
| Requirement baseline | FR-01–FR-14 / US-01–US-14 matrix from #54/#55; the #45 matrix is kept as history only. |
| Architecture questions D-7/D-8 | Answered by #66/#68 (both merged) and ADR-010/C4. Implementation checks remain separate. |
| Order creation role (D-9c, F-07) | Conflict opened by backlog #55 `beba8c6` (18 Nov); aligned at `986583e` (19 Nov); SRS (#54), backlog (#55) and API (#62) merged by 20 Nov. **Resolved.** ADR-006 Accepted after PR #87 (merged 20 Nov). |
| Inactive low-stock rule (CR-03, O-07) | Stated in SRS FR-14 by PR #89 (merged 20 Nov), matching the API. #68 (merged 20 Nov) records CR-03 as resolved. Implementation and tests pending. |
| UI scope D-3, D-4, D-6 | PO decision given; frames added to the Sprint 2 prototype (39-frame export of 20 Nov) ([PO decision, 20 Nov](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Reviewed by Burcu (#50 approval) and Bilgesu (static exports, #71 comment); no separate review is recorded for the U10–U12 flows (section 7). API questions open for Sprint 3 (7b). |
| Manual prototype check of the 39-frame version (20 Nov) | Done by the task owner in the Figma prototype: manager menus and selected tab; Keep order / Cancel order on Pending #1042; recipe Cancel / Publish v4 and version history; stock adjustment Cancel / Save; Bulgur Cancel / Create and the `INITIAL_STOCK` opening-stock example; unsaved-change message removed when the permission toggle returns to its saved value; grant, cancel and remove the permission with Save; new menu item with Olive oil, return to the list and open the saved detail; Chef #1042 Pending → Preparing → Ready. Navigation and displayed values only. Before it, 14 scenarios were simulated from the Figma reaction definitions (not live browser tests). |

Status words: **Matches API 0.2.0** (merged into `develop` by PR #62; still valid for the wording-only 0.2.1), **Decision pending** (no team confirmation recorded), **Applied in Figma** (exists in the live file and was checked on a screenshot), **Team review pending** (frame exists; no reviewer has checked it yet).

## 8. Next steps (proposal)

1. Ayşe answers the open API questions in 7b for Sprint 3; they are not Sprint 2 release blockers. No separate review is recorded for the U10–U12 flows or the manager menu changes; it can be requested if the team wants one.
2. Done: PR #87 was merged on 20 Nov; ADR-006 and ADR-008 are Accepted.
3. Burcu aligns consumption terminology in SRS §3.2/§6.3 and FR/NFR FR-09 (O-06) and the backlog API note (O-08).
4. Done: #66 was merged on 20 Nov. Re-check against `develop` after later merges; preserve old commit evidence as history. A pending merge alone is not a new business-rule mismatch.
5. Revisit other frames only if an owner explicitly requires a missing UI capability or changes an approved rule. This review adds no API behavior or delivery date.
