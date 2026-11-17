# PantryChef — Software Requirements Specification (SRS)

**Course:** BM321 — Software Engineering  
**Team:** 7  
**Sprint:** 2 — Requirements & Architecture  
**Version:** 1.0 — Draft for peer review  
**Date:** 17 November 2026  
**Owner:** Burcu Ücük — Product Owner & Requirements Engineer  
**Reviewer:** Ayşe Dural — Lead Software Architect  
**Tracking:** [S2-01 / Issue #44](https://github.com/seng321-7th-team/PantryChef/issues/44)  
**Target:** `docs/srs.md` on `feature/44-sprint2-srs`, followed by a reviewed PR into `develop`

## 1. Introduction

### 1.1 Purpose
This SRS specifies the verifiable functional requirements, system boundaries, interfaces, data rules, and acceptance conditions for PantryChef's restaurant order and ingredient inventory management MVP. It refines the Sprint 1 project proposal, system vision, product backlog, and OpenAPI 3.1 draft. It is a requirements baseline for UI/UX, architecture, implementation, and QA, not evidence that the product has already been implemented.

### 1.2 Intended readers
Product Owner, Restaurant Manager stakeholder, software architect, implementation team, QA engineer, DevOps engineer, UI/UX designer, Scrum Master, and course instructor.

### 1.3 Source of truth and change control
- `docs/project-proposal.md` — objectives, feasibility, scope, and cancellation policy.
- `docs/system-vision.md` — actors, system boundary, inventory model, state transitions.
- `docs/product-backlog.md` — EP-01–EP-08 and US-01–US-16 (Sprint 1 baseline; refinement is tracked separately as S2-02).
- `api/openapi.yaml` — Sprint 1 API contract and operation identifiers.
- `docs/sprint2-raci.md` and `docs/sprint2-task-board.md` — ownership and review workflow.
- Separate Sprint 2 NFR/quality specifications and QA test traceability are complementary deliverables, not replaced by this SRS.

Any change affecting state transitions, authorization, inventory accounting, or API behavior requires a documented issue, impact review, and coordinated updates to the backlog, API, architecture, tests, and this SRS.

### 1.4 Terminology
| Term | Meaning |
|---|---|
| MVP | Minimum Viable Product |
| `onHand` | Recorded physical stock quantity |
| `reserved` | Quantity committed to active reservations for Pending orders |
| `available` | `onHand - reserved` |
| Atomic | Entire operation succeeds or none of its changes persist |
| Idempotency | Replaying an eligible request does not repeat its business side effects |
| RBAC | Role-based access control |
| SRS | Software Requirements Specification |
| NFR | Non-functional requirement |

## 2. Overall Description

### 2.1 Product perspective and goals
PantryChef is a web-based internal restaurant staff application. It centralizes orders, recipe-based ingredient availability, kitchen preparation states, low-stock alerts, and auditable inventory actions. It aims to prevent duplicate submissions, ingredient over-allocation, and duplicate physical-stock deductions.

### 2.2 Primary actors and permissions
| Actor | Main authorized activities |
|---|---|
| Waiter (`WAITER`) | Create orders, view order status, cancel Pending orders; late cancellation only with explicit `ORDER_LATE_CANCEL` permission |
| Chef / Kitchen Staff (`CHEF`) | View kitchen orders, move Pending → Preparing and Preparing → Ready |
| Restaurant Manager (`MANAGER`) | Manage staff, ingredients, menu items, recipes, inventory adjustments, thresholds, alerts, audit records, and permitted order cancellations; may create orders |

Customers and suppliers are external stakeholders, **not** authenticated MVP actors. A specially authorized waiter is still a Waiter, not a fourth actor.

### 2.3 MVP boundary
**Included:** authentication and RBAC; staff management; ingredient/menu/recipe records; recipe version history; physical/reserved/available inventory; atomic order reservation; kitchen queue and transitions; cancellation and audit; stock adjustments; low-stock alerts; duplicate-request protection; operational history.

**Excluded:** customer-facing ordering, payment/billing, table reservations, delivery tracking or a `DELIVERED` state, third-party supplier integrations, purchase orders and goods receipt, automated procurement, advanced forecasting, multi-branch operations, hardware inventory sensing, and advanced accounting. Backlog US-15 and US-16 remain future/P1 items and are **not** MVP acceptance requirements.

### 2.4 Assumptions, dependencies, and constraints
- Restaurant staff use authenticated web clients with access to a central application and database.
- Recipe ingredient quantities and physical-stock records are entered and maintained by authorized staff; software cannot independently verify physical supplies.
- Ingredient units are consistent with stored recipe quantities; changing units must not silently corrupt historical values.
- The application follows the existing OpenAPI `/v1` REST contract; architecture and deployment technology are to be documented by the architect and DevOps owners.
- Sprint 2 documents define expected behavior; implementation and operational performance evidence belong to later sprint/test deliverables.

## 3. Business Rules and State Model

### 3.1 Inventory invariant
For each ingredient, `available = onHand - reserved`; `onHand >= 0`, `reserved >= 0`, and `available >= 0` after successful operations. Active reservations count toward `reserved`. A Pending order reserves but does **not** deduct `onHand`.

**Example:** `onHand=20`, `reserved=0`, `available=20`. Creating a Pending order requiring 5 gives `onHand=20`, `reserved=5`, `available=15`. Starting preparation consumes the reservation and gives `onHand=15`, `reserved=0`, `available=15`. Ready adds no deduction.

### 3.2 Permitted order transitions
| From | To | Authorized actor | Stock/reservation effect |
|---|---|---|---|
| New | `PENDING` | Waiter or Manager | Atomically create all ACTIVE ingredient reservations; `onHand` unchanged |
| `PENDING` | `PREPARING` | Chef | Atomically consume active reservations and deduct `onHand` exactly once |
| `PREPARING` | `READY` | Chef | None |
| `PENDING` | `CANCELLED` | Waiter or Manager | Release active reservations; `onHand` unchanged |
| `PREPARING` or `READY` | `CANCELLED` | Manager or Waiter with `ORDER_LATE_CANCEL` | Reason and audit required; no stock restoration |

`CANCELLED` is terminal; `READY` is the normal terminal state unless an authorized late cancellation occurs. Unsupported transitions are rejected with `409 INVALID_STATUS_TRANSITION`. There is no `DELIVERED` state.

### 3.3 Core business rules
- **BR-01:** Every accepted order has valid menu items, quantities, and recipe-version references.
- **BR-02:** Reserve every required ingredient in one atomic operation; insufficient availability for any ingredient rejects the whole order with `409 INSUFFICIENT_STOCK` and no partial writes.
- **BR-03:** `PENDING` changes logical reservations only.
- **BR-04:** `PREPARING` consumes reservations and deducts physical stock once, atomically.
- **BR-05:** `READY` causes no additional stock change.
- **BR-06:** Pending cancellation releases reservations without changing physical stock.
- **BR-07:** Late cancellation requires elevated authorization and a reason; consumed stock is never automatically restored.
- **BR-08:** Concurrent operations must preserve stock invariants and prevent oversubscription.
- **BR-09:** Order items retain the recipe version used at creation even after later recipe edits.
- **BR-10:** Sensitive state, stock, and authorization changes are traceable.

## 4. Functional Requirements

Each `FR` is normative: **shall** means mandatory for the stated MVP scope. Acceptance criteria describe observable tests; API references are operation identifiers in `api/openapi.yaml`.

### 4.1 Authentication and access control (EP-01 / US-01)

**FR-001 — Staff login.** The system shall authenticate active staff accounts using supplied credentials and issue an access token on success. **Acceptance:** Valid active credentials return a token and staff role; invalid credentials or inactive accounts return an authentication failure. **API:** `login`.

**FR-002 — Current-user identity.** The system shall return the authenticated user's identity, role, and permissions. **Acceptance:** A valid bearer token retrieves its owner's profile; missing/invalid credentials are rejected. **API:** `getCurrentUser`.

**FR-003 — Role enforcement.** The system shall authorize each protected operation according to Manager, Waiter, Chef, and explicit additional permissions. **Acceptance:** Allowed actions succeed; disallowed actions fail without modifying records. **API:** All protected operations.

**FR-004 — Staff account administration.** Only Managers shall create, view, update, and deactivate staff accounts, including optional late-cancellation permission. **Acceptance:** Manager actions persist; non-manager attempts are rejected; deactivation preserves historical audit references. **API:** `listUsers`, `createUser`, `getUser`, `updateUser`.

### 4.2 Ingredients and inventory (EP-02 / US-02–US-04)

**FR-005 — Ingredient catalogue.** Managers shall create and maintain ingredients with names, units, active status, and low-stock thresholds; authorized staff may read ingredient records. **Acceptance:** Required fields are validated; unauthorized writes are rejected; ingredient deletion follows API resource-in-use constraints. **API:** `listIngredients`, `createIngredient`, `getIngredient`, `updateIngredient`, `deleteIngredient`.

**FR-006 — Stock visibility.** The system shall show `onHand`, `reserved`, and computed `available` for ingredients. **Acceptance:** Each returned `available` equals `onHand - reserved`, including after all order transitions. **API:** `listInventory`, `getInventoryItem`.

**FR-007 — Controlled stock adjustments.** Managers shall adjust physical quantities using a signed delta and reason, with actor/time traceability. **Acceptance:** Changes that would make `onHand` negative or less than outstanding reservations are rejected; accepted adjustments create movement records. **API:** `createStockAdjustment`, `listStockMovements`.

**FR-008 — Inventory invariants under concurrency.** The system shall prevent concurrent orders or adjustments from creating negative available stock or partial reservations. **Acceptance:** Concurrent requests competing for the last units yield only stock-consistent successful transactions. **API:** `createOrder`, `createStockAdjustment`.

### 4.3 Menu and recipe management (EP-03 / US-05)

**FR-009 — Menu items.** Managers shall create, update, and archive menu items; authorized staff shall view the catalogue. **Acceptance:** A menu item has a valid recipe on creation; archived items cannot be newly ordered, while historical references remain readable. **API:** `listMenuItems`, `createMenuItem`, `getMenuItem`, `updateMenuItem`, `deleteMenuItem`.

**FR-010 — Versioned recipes.** Managers shall define ingredient quantities for menu-item recipes; every replacement creates a new version and retains old versions. **Acceptance:** New orders use the current recipe version; existing order-item snapshots remain unchanged after edits. **API:** `listRecipes`, `getRecipe`, `replaceRecipe`, `listRecipeVersions`.

**FR-011 — Menu availability.** The system shall derive the number of portions currently available from ingredient availability and recipe requirements. **Acceptance:** Available portions reflect limiting ingredient quantities and cannot imply more portions than the stock permits. **API:** `listMenuItems`.

### 4.4 Order creation and reservations (EP-04 / US-06–US-07)

**FR-012 — Create order.** A Waiter or Manager shall submit a valid order containing menu items and positive quantities. **Acceptance:** Successful creation returns a `PENDING` order and its associated recipe-version information. **API:** `createOrder`.

**FR-013 — Atomic reservation.** On order creation, the system shall calculate aggregate ingredient requirements and reserve all required quantities together. **Acceptance:** When one ingredient is insufficient, `409 INSUFFICIENT_STOCK` is returned and no order, reservation, or inventory mutation persists. **API:** `createOrder`.

**FR-014 — Idempotent order creation.** Order creation shall require `Idempotency-Key`. Repeating the same key with the same body shall return the original result without creating another order or reservations. **Acceptance:** Replays preserve order count and stock and indicate replay per API contract. **API:** `createOrder`.

**FR-015 — Order lookup.** Authorized staff shall list and retrieve orders and their statuses. **Acceptance:** Staff can retrieve valid orders and filter the list using supported API query parameters. **API:** `listOrders`, `getOrder`.

### 4.5 Kitchen workflow (EP-05 / US-08–US-10)

**FR-016 — Kitchen queue.** The Chef shall be able to view Pending orders in creation-time order. **Acceptance:** The queue can request `status=PENDING&sort=createdAt` and shows accepted Pending orders. **API:** `listOrders`.

**FR-017 — Begin preparation.** A Chef shall move a Pending order to Preparing and atomically consume its ACTIVE reservations while deducting physical stock once. **Acceptance:** After success, reservation status is CONSUMED; stock matches the reserved amounts; repeated attempts cannot deduct stock again. **API:** `updateOrderStatus`.

**FR-018 — Mark ready.** A Chef shall move a Preparing order to Ready without any further inventory deduction. **Acceptance:** The status changes and inventory totals remain unchanged. **API:** `updateOrderStatus`.

**FR-019 — Reject invalid transitions.** The system shall enforce the permitted transition matrix and return `409 INVALID_STATUS_TRANSITION` for invalid state changes. **Acceptance:** Direct Pending → Ready, transitions out of Cancelled, and unauthorized transitions do not modify state or stock. **API:** `updateOrderStatus`.

### 4.6 Cancellation and audit (EP-06 / US-11–US-13)

**FR-020 — Pending cancellation.** A Waiter or Manager shall be able to cancel a Pending order, releasing all its active reservations without changing physical stock. **Acceptance:** The order becomes Cancelled, reserved quantity falls by its allocation, and `onHand` is unchanged. **API:** `updateOrderStatus`.

**FR-021 — Late cancellation.** Only a Manager or a Waiter explicitly granted `ORDER_LATE_CANCEL` shall cancel Preparing or Ready orders; a nonempty reason shall be recorded. **Acceptance:** Unauthorized or reasonless requests fail; authorized requests record actor, time, reason, and previous status; consumed stock is not restored. **API:** `updateOrderStatus`, `listAuditLogs`.

**FR-022 — Reservation inspection.** Authorized Manager/Chef users shall inspect reservation status and its related order/ingredient. **Acceptance:** ACTIVE reservations are visible for Pending orders; CONSUMED/RELEASED states reflect transitions. **API:** `listReservations`, `getReservation`.

**FR-023 — Audit and movement history.** The system shall maintain traceable, immutable records for sensitive operations and stock movements. **Acceptance:** Authorized Manager queries show recorded changes with actor, timestamp, and relevant business context. **API:** `listAuditLogs`, `listStockMovements`.

### 4.7 Low-stock alerts (EP-07 / US-14)

**FR-024 — Low-stock detection.** The system shall identify ingredients whose `available` quantity is less than or equal to their configured low-stock threshold. **Acceptance:** Manager alert results include qualifying ingredients and exclude those above threshold. **API:** `listLowStockAlerts`.

**FR-025 — Threshold maintenance.** Managers shall configure ingredient low-stock thresholds through ingredient management. **Acceptance:** Updating a threshold changes the subsequent alert result without changing physical or reserved quantities. **API:** `updateIngredient`, `listLowStockAlerts`.

### 4.8 System interface and errors

**FR-026 — Standard API errors.** The API shall return structured `application/problem+json` errors with a machine-readable `code` where defined by the OpenAPI contract. **Acceptance:** Invalid input, unauthorized access, insufficient stock, and invalid transitions produce contract-consistent error responses. **API:** Relevant error responses.

**FR-027 — Health endpoint.** The API shall expose a public health/readiness endpoint reporting service and database status. **Acceptance:** A healthy service returns the documented health response; an unavailable dependency returns the documented failure response. **API:** `getHealth`.

## 5. External Interface Requirements

### 5.1 Staff web UI
The web interface shall support role-appropriate login, Waiter order entry and status, Chef kitchen queue and status updates, and Manager inventory/recipe/alert operations. UI layout and navigational flows are specified in Tuğçe's Sprint 2 Figma and user-flow deliverables; their final links and screenshots must be cross-checked during S2-04/S2-31 reviews. This SRS does not claim those prototypes are complete.

### 5.2 REST API
The existing API contract uses OpenAPI 3.1, a `/v1` base path, JSON requests/responses, bearer authentication for protected operations, and RFC 9457-style problem responses. Detailed schemas, field constraints, parameters, and exact HTTP responses are governed by `api/openapi.yaml`; this SRS must be updated if the API contract changes.

### 5.3 External systems
Supplier software, customer apps, payment gateways, and delivery platforms have no direct MVP interface. Database/deployment topology will be specified in the C4 and infrastructure deliverables.

## 6. Logical Data Requirements

| Entity | Minimum purpose and relationships |
|---|---|
| User | Identity, active status, role, permissions; references for audit actions |
| Ingredient | Name, unit, active state, low-stock threshold |
| Inventory | Per-ingredient physical, reserved, and available quantities |
| MenuItem | Orderable dish and current recipe reference |
| RecipeVersion / RecipeLine | Immutable versioned ingredient quantities per menu item |
| Order / OrderItem | Order status, creation metadata, item quantities, recipe-version snapshots |
| Reservation | Ingredient/order allocation, quantity, ACTIVE/CONSUMED/RELEASED state |
| StockMovement | Append-only reservation/release/consumption/adjustment history |
| AuditLog | Actor, time, operation, previous/new context and required cancellation reason |

Precise attributes, cardinalities, database constraints, and ER diagram are owned by the architecture/database schema deliverables; they must preserve the invariants and history defined here.

## 7. Non-functional Requirements and Quality Verification

The **separate** Sprint 2 NFR and quality-measure documents own measurable targets, test environments, verification procedures, and evidence. The following are requirement categories and cross-document references, **not invented approved numeric targets**:

| ID | Quality concern | Required verification direction | Coordinating owner |
|---|---|---|---|
| NFR-REF-01 | Performance | Define and measure order creation, kitchen list, and status-transition response times under a documented workload | Beyzanur / Emre |
| NFR-REF-02 | Reliability and consistency | Concurrent reservation, exactly-once consumption, recovery and idempotency tests | Beyzanur |
| NFR-REF-03 | Security | Authentication, RBAC, permission escalation, input validation and audit tests | Beyzanur / Emre |
| NFR-REF-04 | Availability and recoverability | Health/readiness, backup and restore, documented recovery test | Emre / Beyzanur |
| NFR-REF-05 | Usability and accessibility | Role-based task-flow evaluation using Figma prototypes and documented criteria | Tuğçe / Beyzanur |
| NFR-REF-06 | Maintainability and testability | Modular C4/UML alignment, API contract checks, CI and unit-test coverage evidence | Ayşe / Beyzanur / Emre |

**Action before sign-off:** link the final `docs/non-functional-requirements.md` and `docs/testing/quality-metrics.md` (or team-approved equivalent paths), and replace reference-only entries with approved requirement IDs/targets. The course's ≥50% unit-test coverage requirement applies to the later CI deliverable, not a claim of current Sprint 2 test execution.

## 8. Requirements Traceability

### 8.1 Backlog-to-SRS-to-API mapping
| Backlog | SRS requirements | Principal OpenAPI operations |
|---|---|---|
| US-01 | FR-001–FR-004 | `login`, `getCurrentUser`, `createUser`, `updateUser` |
| US-02 | FR-005 | `listIngredients`, `createIngredient`, `updateIngredient`, `deleteIngredient` |
| US-03 | FR-006, FR-008 | `listInventory`, `getInventoryItem` |
| US-04 | FR-007–FR-008 | `createStockAdjustment`, `listStockMovements` |
| US-05 | FR-009–FR-011 | `createMenuItem`, `replaceRecipe`, `listRecipeVersions` |
| US-06 | FR-012, FR-014–FR-015 | `createOrder`, `listOrders`, `getOrder` |
| US-07 | FR-013–FR-014 | `createOrder` |
| US-08 | FR-015–FR-016 | `listOrders` |
| US-09 | FR-017, FR-019 | `updateOrderStatus` |
| US-10 | FR-018–FR-019 | `updateOrderStatus` |
| US-11 | FR-020 | `updateOrderStatus` |
| US-12 | FR-021 | `updateOrderStatus`, `listAuditLogs` |
| US-13 | FR-022–FR-023 | `listReservations`, `listStockMovements`, `listAuditLogs` |
| US-14 | FR-024–FR-025 | `listLowStockAlerts`, `updateIngredient` |
| US-15–US-16 (future/P1) | Out of MVP scope | No MVP API required |

FR-026 and FR-027 are cross-cutting contract and operational requirements. The refined Sprint 2 backlog (S2-02) and QA requirements–test matrix (S2-22) must retain or update these links with approved story/test identifiers.

### 8.2 Critical acceptance scenarios
| Scenario | Preconditions / action | Expected outcome |
|---|---|---|
| AT-01 | `onHand=20`, reserve 5 in a new order | Pending; `onHand=20`, `reserved=5`, `available=15` |
| AT-02 | AT-01 order moves Pending → Preparing | `onHand=15`, `reserved=0`, `available=15`; reservation consumed |
| AT-03 | Repeat AT-02 transition/request | No second physical deduction |
| AT-04 | Pending order reserves 5, then cancels | Reservation released; `onHand` unchanged |
| AT-05 | Required ingredient unavailable | `409 INSUFFICIENT_STOCK`; no order/partial reservation |
| AT-06 | Two concurrent orders compete for limited stock | No over-reservation; invariants hold |
| AT-07 | Preparing order cancelled by ordinary Waiter | Rejected; no changes |
| AT-08 | Manager cancels Preparing with reason | Cancelled and audited; consumed stock not restored |
| AT-09 | Same `Idempotency-Key` and identical create-order body replayed | Original result; no duplicate order or stock effect |
| AT-10 | Recipe edited after Pending order creation | Historical order retains original recipe version |
| AT-11 | Pending → Ready attempted directly | `409 INVALID_STATUS_TRANSITION`; no changes |
| AT-12 | Available quantity equals low-stock threshold | Ingredient appears in Manager alert results |

## 9. Validation, Review and Acceptance

1. Burcu checks this SRS against the Sprint 1 proposal, system vision, backlog, and OpenAPI contract.
2. Ayşe reviews architecture and API consistency through a GitHub PR targeting `develop`.
3. Beyzanur checks testability and aligns test cases and the requirements–test traceability matrix.
4. Tuğçe checks Waiter/Chef/Manager journeys and the Figma user flows.
5. Bilgesu records review, issue, PR, and completion evidence in the Sprint 2 task board.
6. Only after the required approvals and merge should Issue #44's acceptance criteria be marked complete and its Project status updated to Done.

### S2-01 acceptance checklist
- [ ] All normative functional requirements have unique IDs, clear behavior, and observable acceptance conditions.
- [ ] Roles, MVP boundary, stock rules, and cancellation policy match Sprint 1 sources.
- [ ] Requirements link to applicable user stories and actual OpenAPI operation IDs.
- [ ] Separate NFR and QA deliverables are linked and reconciled when approved.
- [ ] Architecture and Figma reviewers confirm no material contradiction.
- [ ] Ayşe reviews the PR; approved changes are merged into `develop` with Issue #44 linked.

## 10. Open Questions for Team Confirmation

| ID | Question | Owner / resolution |
|---|---|---|
| OQ-01 | Confirm the final approved numeric performance, availability, security, usability, and recovery targets and their measurement methods. | Beyzanur / Emre; NFR/quality documents |
| OQ-02 | Confirm Figma screen/user-flow coverage against FR-001–FR-025 and add stable prototype links. | Tuğçe / Burcu |
| OQ-03 | Confirm architecture ER schema and concurrency/transaction strategy implement reservation and consumption invariants. | Ayşe / Emre |
| OQ-04 | Reconcile the refined Sprint 2 backlog's story IDs, priorities, points, and acceptance criteria with this traceability table. | Burcu / Beyzanur |
| OQ-05 | Confirm that the final API contract and implementation preserve all documented error cases, idempotency semantics, and role permissions. | Ayşe / Burcu |

## 11. Approval Record

**Status:** Draft — pending peer review and merge.  
**Prepared by:** Burcu Ücük  
**Designated reviewer:** Ayşe Dural  
**Review PR:** To be linked after creation  
**Approval date:** Pending  
**Merge commit:** Pending
