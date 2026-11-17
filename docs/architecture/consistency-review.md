# PantryChef – Architecture–SRS–OpenAPI Consistency Review

| Field | Value |
|---|---|
| Task | S2-17 Architecture–SRS–OpenAPI Consistency Review |
| Owner | Ayşe Dural – Lead Software Architect and Technical Lead |
| Reviewer | Burcu Ücük (Sprint 2 final task table v2.0) |
| Date | 2026-11-18 |
| Status | Draft – CR-01 fix applied, waiting for Burcu's confirmation |

This record compares the Sprint 2 requirements (SRS, functional and non-functional requirements,
refined backlog) with the API contract and the architecture deliverables (C4, UML, ER, ADR, database
schema). It lists what agrees, what conflicts, what was resolved during the sprint and who has to
decide the open points. It does not change any requirement; changes are made by the document owners.

## 1. Sources

None of the Sprint 2 sources below is merged into `develop` yet. Each is reviewed at the commit shown.
The review has to be repeated once they are merged (section 7).

| Source | Owner | Pull request | Commit reviewed |
|---|---|---|---|
| SRS `docs/srs.md` (S2-01) | Burcu | #54 | `0ad80b3` |
| Functional and non-functional requirements (S2-03) | Burcu | #51 | `fc70b81` |
| Refined product backlog (S2-02) | Burcu | #55 | `ec1911a` |
| System Vision, Sprint 1 backlog, meeting notes | Burcu, Bilgesu | merged | `develop` `0c3e244` |
| OpenAPI v0.2.0, C4, UML and ER diagrams (S2-12 to S2-14, S2-34, S2-35) | Ayşe | #62 | `dbb06be` |
| Architecture decision records (S2-16) | Ayşe | #64 | `e304bbf` |
| Database schema (S2-15) | Ayşe | #66 | `c691206` |
| UI design ↔ user story review (S2-31) | Tuğçe | #50 | `e81b764` |
| Infrastructure and deployment requirements (S2-23) | Emre | #36 | `b112c9e` |

## 2. Summary

| Result | Count |
|---|---|
| Rules that agree across all sources | 13 (section 3) |
| Findings | 7 (section 4): 1 applied and waiting for confirmation (CR-01), 2 resolved (CR-04, CR-05), 4 open (CR-02, CR-03, CR-06, CR-07) |
| Questions resolved during Sprint 2 | 8 (section 5) |

The order lifecycle, the stock model, cancellation rules, recipe versioning and idempotency agree
everywhere. The one real conflict is how the opening stock of a new ingredient is entered (CR-01).

## 3. What agrees

| # | Rule | SRS / requirements | API v0.2.0 | Architecture |
|---|---|---|---|---|
| 1 | Lifecycle `Pending → Preparing → Ready`, or `Cancelled`; no `Delivered` | SRS §3.1, §2.3, BR-01 | `OrderStatus`, `updateOrderStatus` | UML State, ADR-006 |
| 2 | `Available = Physical − Reserved`, never negative | SRS §3.2, FR-03, NFR-04 | `InventoryItem.available` | ER `inventory` checks, schema §6 |
| 3 | Order is accepted only if every ingredient is available; otherwise nothing changes | FR-07, NFR-03 | `createOrder`, `409 INSUFFICIENT_STOCK` | UML Sequence, ADR-004 |
| 4 | Pending reserves and does not touch physical stock | BR-04, FR-07 | `createOrder` | ADR-004, schema §7 |
| 5 | Preparing consumes reservations and deducts stock exactly once, atomically | FR-09, BR-05, NFR-05 | `updateOrderStatus` (`PREPARING`) | UML Sequence and State, ADR-004, `uq_stock_movements_one_consume` |
| 6 | Ready changes no stock | FR-10, BR-06 | `updateOrderStatus` (`READY`) | UML State, ADR-004 |
| 7 | Pending cancellation by Waiter or Manager releases reservations | FR-11, BR-07 | `updateOrderStatus` (`CANCELLED`) | UML State, ADR-006 |
| 8 | Late cancellation by Manager or permitted Waiter, reason required, no stock restore, audited | FR-12, BR-08, BR-09 | `ORDER_LATE_CANCEL`, `Cancellation`, `ORDER_LATE_CANCELLED` | UML Use Case and State, ADR-006, `orders` checks |
| 9 | Orders are created by Waiters | SRS §2.1, FR-06, US-06 | `createOrder` roles: WAITER | UML Use Case and State, ADR-006 |
| 10 | Each order keeps its recipe version | SRS §3.3, FR-05 | `OrderItem.recipeVersion` | UML Class, ER, ADR-007 |
| 11 | Duplicate submissions create no duplicate effects | FR-07, NFR-05, BR-11 | `Idempotency-Key` | ADR-005, `idempotency_records` |
| 12 | Ingredients are deactivated, not deleted; history stays valid | FR-02, US-02 AC 6 | `deactivateIngredient`, `Ingredient.active` | ER, ADR-008, schema |
| 13 | Low stock when `available <= threshold`; no automatic purchase orders | FR-14 | `listLowStockAlerts` | — |

## 4. Findings

| ID | Priority | Finding | Owner / decides | Status |
|---|---|---|---|---|
| CR-01 | High | Initial stock at ingredient creation | Burcu decides; Ayşe updates | Applied in PR #62, #64, #66; waiting for Burcu's confirmation |
| CR-02 | Medium | Three different FR numbering schemes | Burcu; Ayşe and Tuğçe update | Open |
| CR-03 | Low | Low-stock alerts for inactive ingredients not stated in the SRS | Burcu | Open |
| CR-04 | Low | No UI action for ingredient deactivation | Tuğçe | Resolved (Figma frames in PR #71) |
| CR-05 | Low | C4 Context omits Customer and Supplier | Ayşe; Emre reviews | Resolved (PR #62, `cb634c3`) |
| CR-06 | Low | ADR statuses wait for confirmation of D-01 to D-11 | Bilgesu, team | Open |
| CR-07 | Process | Two open PRs each for S2-01 and S2-02 | Burcu, Bilgesu | Open |

### CR-01 – Initial stock at ingredient creation (High)

| Source | Rule |
|---|---|
| SRS FR-02 (PR #54) | "Upon creation, its physical stock shall be initialized to zero. Initial stock shall be recorded through a separate authorized inventory adjustment." |
| Refined backlog US-02 AC 1 (PR #55) | Ingredient is created with name, unit and threshold; initial stock is recorded separately through an adjustment. |
| Figma 04d, UI review F-05 / D-5 (PR #50) | No quantity field; "Starts with 0 on hand. Add stock with an adjustment (reason: Initial stock)." |
| API v0.2.0 (PR #62) | `POST /ingredients` accepts an optional `initialQuantity`, booked as an `ADJUSTMENT` / `INITIAL_STOCK` movement. |
| ADR-009 (PR #64), schema §7 (PR #66) | Follow the API v0.2.0 rule. |

**Why it happened.** PR #62 resolved the gap between the Sprint 1 backlog on `develop` (quantity entered
at creation) and the Sprint 1 API (separate adjustment) by adding `initialQuantity`. The refined
requirements, written in parallel, resolved the same gap the other way.

**Recommendation.** Follow the requirements baseline, because SRS, refined backlog and Figma already
agree: remove `initialQuantity` from PR #62, mark ADR-009 as rejected in PR #64 and update schema §7 in
PR #66. Ingredient creation then starts with `on_hand = 0`, and the opening stock is entered with
`POST /inventory/adjustments` and reason `INITIAL_STOCK`, which the Sprint 1 API already supported. If
Burcu instead wants the quantity at creation, FR-02, US-02 AC 1 and Figma 04d must change.

**Applied (18 Nov).** The recommendation is applied so the three PRs no longer conflict with the
requirements: `initialQuantity` removed from the API in PR #62 (`866122e`), ADR-009 marked Rejected in
PR #64 (`07fd074`), and schema §7 updated in PR #66 (`5475872`). The user flows in PR #70 and the Figma
frames in PR #71 follow the same rule. The finding is closed once Burcu confirms it.

### CR-02 – Three different FR numbering schemes (Medium)

| Document | Numbering | Example |
|---|---|---|
| System Vision §13 (`develop`), used by `api/README.md` §4.1 | FR-01 to FR-20 | FR-12 = managers maintain ingredients and recipes |
| SRS (PR #54) and requirements (PR #51) | FR-01 to FR-14 | FR-12 = exceptional cancellation |
| UI review §2a (PR #50), based on the older SRS draft PR #45 | FR-001 to FR-027 | FR-012 = create order |

The same identifier points to different requirements, so traceability tables can silently be wrong.
**Recommendation:** treat the SRS numbering (FR-01 to FR-14) as the Sprint 2 baseline. After the SRS is
merged, Ayşe updates `api/README.md` §4.1, Tuğçe updates the UI review §2a, and the System Vision list
is marked as the Sprint 1 numbering.

### CR-03 – Low-stock alerts for inactive ingredients (Low)

API v0.2.0 does not raise low-stock alerts for inactive ingredients (`listLowStockAlerts`,
`InventoryItem.lowStock`). SRS FR-14 does not mention deactivated ingredients. Not a conflict, but the
rule exists only in the API. **Recommendation:** add one sentence to FR-14 or FR-02.

### CR-04 – No UI action for ingredient deactivation (Low)

The API side of UI review F-02 / D-2 is resolved (section 5, R-01). Figma 04a–04d had no deactivate or
reactivate action. **Resolved:** frames `scr-04g` (edit ingredient), `scr-04h` (deactivate confirmation)
and `scr-04i` (inactive ingredient with Reactivate) in PR #71 add both actions; the user flow is U6 in
PR #70.

### CR-05 – C4 Context omits Customer and Supplier (Low)

System Vision §6.1 and SRS §2.1 name Customer and Supplier as external stakeholders. The C4 Context
diagram (PR #62) showed only the three staff roles. **Resolved:** the C4 Context page now has a note that
Customer and Supplier only deal with restaurant staff and have no access to PantryChef (PR #62,
`cb634c3`, following Emre's review).

### CR-06 – ADR statuses wait for decision confirmation (Low)

ADR-004 and ADR-007 rely on D-02 to D-07 and D-11, which `docs/sprint1-meeting-notes.md` still lists as
"pending confirmation", although the SRS treats them as mandatory business rules (BR-01 to BR-12).
**Recommendation:** record the team confirmation in the meeting notes; the ADRs then move to Accepted.

### CR-07 – Two open PRs each for S2-01 and S2-02 (Process)

PR #45 and PR #54 both add the SRS; PR #47 and PR #55 both refine the backlog. The UI review read the
older SRS (PR #45), which explains its different FR numbers (CR-02). **Recommendation:** close the
superseded PRs (#45, #47) so that reviews use one version.

## 5. Resolved during Sprint 2

| ID | Question | Raised in | Resolved by |
|---|---|---|---|
| R-01 | Ingredient "delete if unused" vs "deactivate" | UI review F-02 / D-2, US-02 AC 6 | PR #62: soft delete, `Ingredient.active`, MANAGER only |
| R-02 | May managers create orders? | UI review O-04 | PR #62: `createOrder` is WAITER only, matching SRS FR-06 and US-06; UML updated |
| R-03 | Where are status history and cancellation data stored? Is there a `cancellation_audit` table? | UI review C-01 / D-7 | PR #66: `order_status_history` table, cancellation columns on `orders`, `audit_logs`; no `cancellation_audit` table |
| R-04 | Kitchen board refresh | UI review O-01 / D-8 | ADR-010 (PR #64), infrastructure requirements (PR #36): polling every 15–30 s |
| R-05 | No ADR document exists | UI review §5 | PR #64 (ADR-001 to ADR-011) |
| R-06 | Recipe versioning details (SRS open question 3) | SRS §8 | API: `OrderItem.recipeVersion`, `GET /recipes/{menuItemId}/versions`; ADR-007; schema |
| R-07 | Idempotency replay and mismatched body (SRS open question 4) | SRS §3.3, §8 | API: key required on `POST /orders`, optional on status changes; same key and body replays with `Idempotent-Replayed: true`; different body returns `422 IDEMPOTENCY_KEY_REUSED`; ADR-005 |
| R-08 | Recipes must not reference unavailable ingredients | Backlog US-05 AC 4 | PR #62: `422 INGREDIENT_INACTIVE` |

## 6. SRS open questions (§8) from the architecture side

| SRS question | Status |
|---|---|
| 1. Performance targets (20 users, p95 2 s / 3 s) | Open. Architecturally feasible (ADR-002, ADR-004), but only measurable once the backend exists; Beyzanur and Emre to agree the test environment (S2-19, S2-25). |
| 2. Are all `/users` operations needed? | The API keeps them because the late-cancel permission must be assignable; whether the UI shows them is UI review D-6 (Burcu). |
| 3. Recipe versioning | Resolved (R-06). |
| 4. Idempotency behaviour | Resolved (R-07). |
| 5–7. UI validation, testing, document status | Not architecture questions; no change. |

## 7. Next steps and re-review

1. Burcu confirms CR-01; the fix is already applied to PR #62, #64 and #66.
2. Burcu and Bilgesu close the superseded PRs (CR-07).
3. After the SRS (#54), requirements (#51), backlog (#55) and PR #62 are merged, the FR numbers are
   aligned (CR-02) and this review is repeated against `develop`.
4. The remaining low findings (CR-03, CR-06) are fixed by their owners; each fix is recorded here with
   its PR number.

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-11-18 | Ayşe Dural | First consistency review for S2-17 |
| 0.2 | 2026-11-18 | Ayşe Dural | Status column; CR-01 applied, CR-04 and CR-05 resolved |
