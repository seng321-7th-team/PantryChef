# PantryChef — Product Backlog (Sprint 3 Refinement)

**Project:** PantryChef — Restaurant Order and Inventory Management System  
**Course:** BM 321 / SENG 321 — Software Engineering  
**Baseline:** Sprint 2 — Requirements & Architecture (PR #55)  
**Current Sprint:** Sprint 3 — MVP & CI/CD  
**Document:** Product Backlog — Sprint 3 Refinement  
**File:** `docs/product-backlog.md`  
**Responsible:** Burcu Ücük — Product Owner / Requirements Engineer  
**QA Reviewer:** Beyzanur Alpay  
**API Reviewer:** Ayşe  
**Scope Reviewer:** Tuğçe  
**Version:** 3.0 — Proposed Sprint 3 refinement  
**Date:** 25 November 2026  
**Tracking:** [S3-02 — Issue #125](https://github.com/seng321-7th-team/PantryChef/issues/125)  
**Status:** Draft — Pending QA, API, scope, and team review

---

## 1. Purpose

This document refines the Sprint 2 product backlog for Sprint 3 (MVP & CI/CD). It retains the agreed Epics, Features, User Stories, implementation Tasks, Acceptance Criteria, priorities, Story Points, dependencies, and proposed responsible roles, while improving testability and traceability. It is a requirements-planning artifact, not evidence that the features have been implemented.

The Sprint 1 Project Proposal and System Vision & Boundary are the scope baseline. The Sprint 2 SRS (`docs/srs.md`) and OpenAPI draft (`api/openapi.yaml`) are cross-check references; discrepancies must be resolved through team review rather than silently changing the approved behavior.

The backlog represents product requirements and planned implementation work. Story Points and proposed owners are preliminary and may be revised by the development team. No team approval or implementation completion is implied by this draft.

## 2. Product Overview

PantryChef is a restaurant order and ingredient inventory management system designed to reduce duplicate order entry, prevent ingredient over-allocation, and improve coordination between waiters, kitchen staff, and restaurant managers.

### 2.1 Primary Actors

- **Waiter:** Creates orders, views order status, and cancels eligible orders.
- **Chef / Kitchen Staff:** Views incoming orders, starts preparation, and marks orders as ready.
- **Restaurant Manager:** Manages ingredients, recipes, inventory, alerts, and authorized cancellations.
- **Supplier:** External stakeholder for future purchasing and goods receipt workflows.

### 2.2 MVP Scope

The MVP includes:

1. Role-based access to essential operations.
2. Ingredient inventory and recipe management.
3. Waiter order creation and validation.
4. Atomic ingredient reservation when an order is created.
5. Kitchen order queue and preparation status updates.
6. Physical stock deduction exactly once when preparation begins.
7. Order cancellation according to role and preparation status.
8. Low-stock monitoring and alerts.
9. Basic order and inventory traceability.

### 2.3 Out of Scope for MVP

The following features are deferred:

- Delivery and delivery-status management.
- Online payment and billing integration.
- Customer-facing ordering applications.
- Supplier integration.
- Automated purchase orders.
- Goods receipt processing.
- Advanced analytics and demand forecasting.
- Table reservations (ingredient reservations remain in scope).

Staff account administration remains pending the S3-01 decision (#124); authentication and role authorization remain in scope.

The `Delivered` order status is not part of the MVP. The Supplier is an external stakeholder, not an MVP application actor.

## 3. Core Business Rules

**BR-01 — Order States**

The MVP order states are `Pending`, `Preparing`, `Ready`, and `Cancelled`.

**BR-02 — Atomic Reservation**

When a waiter creates an order, the system checks all required ingredients. If any ingredient is insufficient, the entire order is rejected without creating partial reservations or changing inventory quantities.

**BR-03 — Available Inventory**

Available quantity is calculated as:

`Available Quantity = Physical Quantity - Reserved Quantity`

**BR-04 — Pending Order**

When an order is successfully created, its required ingredients are reserved and its status becomes `Pending`. Physical stock is not deducted.

**BR-05 — Start Preparation**

When the chef starts preparation, the order changes from `Pending` to `Preparing`. Active ingredient reservations transition to `CONSUMED`, reserved quantities decrease, and physical inventory is deducted exactly once in the same atomic transaction.

**BR-06 — Ready Order**

When preparation finishes, the chef changes the order from `Preparing` to `Ready`. No additional stock deduction occurs.

**BR-07 — Cancellation Before Preparation**

A waiter or restaurant manager may cancel a `Pending` order. Its reservations are released, and physical stock remains unchanged.

**BR-08 — Cancellation After Preparation Starts**

Only a restaurant manager or a specifically authorized waiter may cancel a `Preparing` or `Ready` order. A cancellation reason and audit record are required. Consumed physical stock is not automatically restored.

**BR-09 — Inventory Consistency**

Concurrent order operations must not cause negative available inventory, duplicate reservations, or duplicate stock deductions.

**BR-10 — Authorization and Traceability**

Unauthorized operations must be rejected. Significant inventory and order changes must be traceable.

## 4. Prioritization and Estimation

| Priority | Meaning |
|---|---|
| P0 | Essential for MVP functionality |
| P1 | Important enhancement or post-MVP functionality |

Story Points use a relative estimation scale: 1, 2, 3, 5, 8, and 13.

Story Points indicate estimated implementation complexity, not hours or guaranteed delivery commitments.

## 5. Epic Overview

| Epic ID | Epic | Priority |
|---|---|---|
| EP-01 | Access Control and Roles | P0 |
| EP-02 | Ingredient Inventory Management | P0 |
| EP-03 | Recipe Management | P0 |
| EP-04 | Order Creation and Atomic Reservation | P0 |
| EP-05 | Kitchen Workflow and Stock Consumption | P0 |
| EP-06 | Order Cancellation and Auditability | P0 |
| EP-07 | Low-Stock Alerts | P0 |
| EP-08 | Purchase Orders and Goods Receipt | P1 |

---

## 6. Detailed Product Backlog

### EP-01 — Access Control and Roles

**Feature:** Role-based operation permissions.

#### US-01 — Role-Based Authorization

**As a** restaurant manager,  
**I want** system operations to be restricted according to staff roles,  
**so that** only authorized employees can perform sensitive actions.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Backend / API Team
- **Dependencies:** None

**Acceptance Criteria**

**Given** a staff account with a defined role and permissions,  
**When** the account attempts the relevant protected operation, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** The system recognizes the Waiter, Chef, and Restaurant Manager roles.
2. **Then:** Waiters can create orders and cancel eligible orders.
3. **Then:** Chefs can view kitchen orders and update preparation states.
4. **Then:** Restaurant Managers can manage inventory and recipes.
5. **Then:** Unauthorized operations are rejected without changing data.
6. **Then:** Authorized cancellation after preparation begins requires the appropriate permission.

**Implementation Tasks**

- Define role identifiers and permissions.
- Implement authorization checks.
- Protect order and inventory operations.
- Write positive and negative authorization tests.

### EP-02 — Ingredient Inventory Management

**Feature:** Ingredient records and inventory quantities.

#### US-02 — Manage Ingredients

**As a** restaurant manager,  
**I want** to create, view, update, and deactivate ingredient records,  
**so that** restaurant inventory information remains accurate.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Backend / Inventory Team
- **Dependencies:** US-01

**Acceptance Criteria**

**Given** an ingredient management request and the relevant actor,  
**When** the request is submitted or the resulting record is inspected, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** A manager can create an ingredient with a name, unit, and low-stock threshold.
2. **Then:** Newly created ingredients have onHand = 0 and reserved = 0.
3. **Then:** Initial physical stock is recorded separately through an authorized INITIAL_STOCK inventory adjustment.
4. **Then:** The initial stock adjustment records the responsible actor, timestamp, and reason.
5. **Then:** Required fields are validated.
6. **Then:** Physical quantity cannot be negative.
7. **Then:** Existing ingredient records can be updated by authorized managers; unauthorized users cannot modify ingredients.
8. **Then:** Deactivation does not invalidate historical order records.

**Implementation Tasks**

- Define ingredient data model.
- Implement ingredient management operations.
- Validate input fields.
- Implement authorization and tests.
- Initialize new ingredients with zero physical and reserved stock.
- Record initial stock through an audited INITIAL_STOCK adjustment.

#### US-03 — View Available Stock

**As a** restaurant manager,  
**I want** to see physical, reserved, and available ingredient quantities,  
**so that** I can understand current inventory availability.

- **Priority:** P0
- **Story Points:** 3
- **Proposed Owner:** Backend / Inventory Team
- **Dependencies:** US-02

**Acceptance Criteria**

**Given** an ingredient with physical and reserved quantities,  
**When** inventory is retrieved or an order operation occurs, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Physical and reserved quantities are stored or reliably derived.
2. **Then:** Available quantity equals physical quantity minus reserved quantity.
3. **Then:** Available quantity cannot become negative through normal order operations.
4. **Then:** Inventory values are updated consistently after reservation, consumption, and cancellation.

**Implementation Tasks**

- Define physical and reserved quantity handling.
- Implement available-stock calculation.
- Test quantity changes across order transitions.

#### US-04 — Record Inventory Adjustments

**As a** restaurant manager,  
**I want** to correct inventory quantities with an explanation,  
**so that** stock discrepancies can be recorded transparently.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Backend / Inventory Team
- **Dependencies:** US-01, US-02, US-03

**Acceptance Criteria**

**Given** an inventory adjustment request and existing reservations,  
**When** the adjustment is submitted, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Only authorized managers can adjust physical stock.
2. **Then:** Every adjustment includes a quantity change and reason.
3. **Then:** The system records the responsible user and timestamp.
4. **Then:** Adjustments that would make physical quantity lower than reserved quantity are rejected.
5. **Then:** Adjustments do not silently remove existing reservations.

**Implementation Tasks**

- Implement adjustment operation.
- Add inventory adjustment audit records.
- Validate quantity constraints.
- Test authorized and unauthorized adjustments.

### EP-03 — Recipe Management

**Feature:** Recipe ingredient requirements.

#### US-05 — Manage Recipes

**As a** restaurant manager,  
**I want** to define ingredient quantities required for menu items,  
**so that** the system can calculate inventory requirements automatically.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Backend / Inventory Team
- **Dependencies:** US-02

**Acceptance Criteria**

**Given** a recipe or recipe update request,  
**When** the recipe is saved or an existing order is inspected, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** A manager can create and update recipes.
2. **Then:** Each recipe contains ingredient references and quantities per portion.
3. **Then:** Ingredient quantities must be positive.
4. **Then:** A recipe cannot reference an unavailable or invalid ingredient.
5. **Then:** Only authorized users can modify recipes.
6. **Then:** Existing orders retain their original ingredient requirements when recipes are updated.

**Implementation Tasks**

- Define recipe and recipe-ingredient models.
- Implement recipe management.
- Validate recipe quantities.
- Preserve order ingredient snapshots.
- Test recipe updates and invalid references.

### EP-04 — Order Creation and Atomic Reservation

**Feature:** Waiter order entry and ingredient reservation.

#### US-06 — Create an Order

**As a** waiter,  
**I want** to create an order containing menu items and portion quantities,  
**so that** the kitchen receives accurate order information.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Order / API Team
- **Dependencies:** US-01, US-05

**Acceptance Criteria**

**Given** an order creation request with an actor and menu items,  
**When** the request is submitted, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Only an authorized Waiter can create an order by selecting valid menu items and positive portion quantities. Managers and Chefs are not permitted to create orders.
2. **Then:** Invalid or empty orders are rejected.
3. **Then:** A successfully created order receives a unique identifier.
4. **Then:** Its initial state is `Pending`.
5. **Then:** The system stores the order's required ingredient quantities.
6. **Then:** The order is created only if its complete ingredient reservation succeeds.

**Implementation Tasks**

- Define order and order-item models.
- Implement order creation.
- Validate quantities and menu items.
- Connect order creation to atomic reservation.
- Test valid and invalid orders.

#### US-07 — Reserve Ingredients Atomically

**As a** waiter,  
**I want** the system to reserve all required ingredients when I create an order,  
**so that** accepted orders have sufficient inventory available.

- **Priority:** P0
- **Story Points:** 8
- **Proposed Owner:** Backend / Inventory and Order Teams
- **Dependencies:** US-03, US-05, US-06

**Acceptance Criteria**

**Given** an order request and current ingredient availability,  
**When** reservation is attempted or the request is retried, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Ingredient requirements are calculated using recipes and ordered portions.
2. **Then:** The system checks available quantities for all required ingredients.
3. **Then:** If every ingredient is sufficient, all required quantities are reserved.
4. **Then:** Physical stock does not decrease at reservation time.
5. **Then:** If any ingredient is insufficient, the entire operation is rejected.
6. **Then:** Failed operations create no order and no partial reservations.
7. **Then:** Concurrent requests cannot reserve more than the available stock.
8. **Then:** Retrying the same logical request must not create duplicate orders or reservations.

**Implementation Tasks**

- Calculate total ingredient requirements.
- Implement transactional stock validation.
- Implement atomic reservation.
- Handle concurrent order requests.
- Add duplicate-request protection.
- Write insufficient-stock and concurrency tests.

### EP-05 — Kitchen Workflow and Stock Consumption

**Feature:** Kitchen order processing.

#### US-08 — View Pending Orders

**As a** chef,  
**I want** to view incoming orders and their details,  
**so that** I can prepare the correct menu items.

- **Priority:** P0
- **Story Points:** 3
- **Proposed Owner:** Kitchen / API Team
- **Dependencies:** US-06, US-07

**Acceptance Criteria**

**Given** orders in the system and a staff actor,  
**When** the kitchen queue is retrieved or a kitchen action is attempted, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Authorized kitchen staff can view pending orders.
2. **Then:** Each order displays its identifier, items, portions, and status.
3. **Then:** Cancelled orders are not presented as active preparation tasks.
4. **Then:** Unauthorized users cannot perform kitchen-only status updates.

**Implementation Tasks**

- Implement kitchen order retrieval.
- Define kitchen order response data.
- Test visibility and authorization.

#### US-09 — Start Preparation and Consume Stock

**As a** chef,  
**I want** to start preparing a pending order,  
**so that** the system accurately reflects ingredient consumption.

- **Priority:** P0
- **Story Points:** 8
- **Proposed Owner:** Backend / Kitchen and Inventory Teams
- **Dependencies:** US-03, US-07, US-08

**Acceptance Criteria**

**Given** an order and its reservations,  
**When** start preparation is requested, including retries or failures, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Only an authorized chef can start preparation.
2. **Then:** The operation is valid only for an order in `Pending`.
3. **Then:** The order transitions to `Preparing`.
4. **Then:** The order's active ingredient reservations transition to `CONSUMED`, and the corresponding reserved quantities decrease.
5. **Then:** Corresponding physical quantities are deducted exactly once.
6. **Then:** Status transition and inventory changes are atomic.
7. **Then:** Repeated requests cannot deduct physical inventory again.
8. **Then:** Failed transactions do not leave partially updated order or inventory records.

**Implementation Tasks**

- Implement `Pending` to `Preparing` transition.
- Implement atomic reservation consumption.
- Prevent duplicate deductions.
- Add transaction rollback handling.
- Write transition and idempotency tests.

#### US-10 — Mark an Order as Ready

**As a** chef,  
**I want** to mark a prepared order as ready,  
**so that** the waiter can identify completed kitchen work.

- **Priority:** P0
- **Story Points:** 3
- **Proposed Owner:** Kitchen / API Team
- **Dependencies:** US-09

**Acceptance Criteria**

**Given** an order and a staff actor,  
**When** mark ready is requested or the resulting state is inspected, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Only authorized kitchen staff can mark an order as `Ready`.
2. **Then:** The transition is allowed only from `Preparing`.
3. **Then:** The transition does not change physical or reserved stock.
4. **Then:** Invalid state transitions are rejected.
5. **Then:** The updated order status is visible to authorized staff.

**Implementation Tasks**

- Implement `Preparing` to `Ready` transition.
- Validate state and role permissions.
- Test inventory invariance.

### EP-06 — Order Cancellation and Auditability

**Feature:** Controlled order cancellation.

#### US-11 — Cancel an Order Before Preparation

**As a** waiter,  
**I want** to cancel an order before preparation begins,  
**so that** its reserved ingredients become available again.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Order / Inventory Team
- **Dependencies:** US-07

**Acceptance Criteria**

**Given** an order and its reservations,  
**When** early cancellation is requested or retried, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** A waiter or manager can cancel a `Pending` order.
2. **Then:** The order status changes to `Cancelled`.
3. **Then:** All reservations associated with the order are released atomically.
4. **Then:** Physical stock remains unchanged.
5. **Then:** Repeated cancellation requests do not release reservations more than once.
6. **Then:** A cancelled order cannot return to an active preparation state.

**Implementation Tasks**

- Implement pending-order cancellation.
- Release reservations transactionally.
- Prevent repeated reservation release.
- Test cancellation and invalid transitions.

#### US-12 — Authorized Cancellation After Preparation

**As a** restaurant manager,  
**I want** to cancel an order after preparation has started with a recorded reason,  
**so that** exceptional situations are handled with accountability.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Order / API Team
- **Dependencies:** US-01, US-09, US-10

**Acceptance Criteria**

**Given** an order after preparation and an actor with or without permission,  
**When** late cancellation is requested or retried, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** A restaurant manager may cancel an order in `Preparing` or `Ready`.
2. **Then:** A waiter may perform this action only with specific authorization.
3. **Then:** A cancellation reason is mandatory.
4. **Then:** The system records the actor, timestamp, order, previous status, and reason.
5. **Then:** The order changes to `Cancelled`.
6. **Then:** Consumed physical stock is not automatically restored.
7. **Then:** Repeated cancellation requests do not change inventory quantities.
8. **Then:** Unauthorized requests are rejected without modifying the order.

**Implementation Tasks**

- Implement privileged cancellation permissions.
- Validate cancellation reasons.
- Record cancellation audit events.
- Prevent stock restoration and duplicate effects.
- Test role-based cancellation.

#### US-13 — View Order and Inventory History

**As a** restaurant manager,  
**I want** to review significant order and inventory events,  
**so that** operational changes can be traced.

- **Priority:** P0
- **Story Points:** 5
- **Proposed Owner:** Backend / Audit Team
- **Dependencies:** US-04, US-09, US-11, US-12

**Acceptance Criteria**

**Given** order and inventory events and a staff actor,  
**When** events occur or history access is attempted, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Significant order transitions are recorded.
2. **Then:** Reservation, consumption, cancellation, and inventory adjustment events are traceable.
3. **Then:** Audit records include actor, timestamp, event type, and relevant identifiers.
4. **Then:** Authorized managers can view audit history.
5. **Then:** Unauthorized users cannot modify audit records through ordinary application operations.

**Implementation Tasks**

- Define audit event model.
- Record order and inventory events.
- Implement authorized history retrieval.
- Test event completeness and access control.

### EP-07 — Low-Stock Alerts

**Feature:** Inventory threshold monitoring.

#### US-14 — Receive Low-Stock Alerts

**As a** restaurant manager,  
**I want** to identify ingredients with low available quantities,  
**so that** I can plan replenishment.

- **Priority:** P0
- **Story Points:** 3
- **Proposed Owner:** Backend / Inventory Team
- **Dependencies:** US-02, US-03

**Acceptance Criteria**

**Given** an ingredient with a threshold and current availability,  
**When** stock changes or alerts are retrieved, the following expected outcomes apply to the relevant positive or negative scenario:

1. **Then:** Each ingredient has a configurable low-stock threshold.
2. **Then:** An ingredient is flagged when its available quantity is less than or equal to its threshold.
3. **Then:** Alerts reflect reservations, consumption, cancellation, and inventory adjustments.
4. **Then:** Authorized managers can view current low-stock items.
5. **Then:** The system does not automatically create purchase orders in the MVP.

**Implementation Tasks**

- Implement threshold comparison.
- Implement low-stock list retrieval.
- Test alerts after inventory changes.

### EP-08 — Purchase Orders and Goods Receipt

**Feature:** Future procurement workflow.

**Release Classification:** P1 — Post-MVP

#### US-15 — Create Purchase Orders

**As a** restaurant manager,  
**I want** to create purchase orders for ingredients,  
**so that** replenishment can be planned and documented.

- **Priority:** P1
- **Story Points:** 5
- **Proposed Owner:** Backend / Procurement Team
- **Dependencies:** US-02

**Acceptance Criteria**

1. Authorized managers can create purchase orders.
2. Each purchase order contains supplier information and ingredient quantities.
3. Quantities must be positive.
4. Each purchase order receives a unique identifier.
5. Creating a purchase order does not increase physical inventory.

**Implementation Tasks**

- Define purchase order model.
- Implement purchase order creation.
- Validate order contents.
- Test authorization and stock invariance.

#### US-16 — Receive Goods Without Duplicate Stock Updates

**As a** restaurant manager,  
**I want** to record received goods only once,  
**so that** repeated receipt requests cannot inflate inventory.

- **Priority:** P1
- **Story Points:** 8
- **Proposed Owner:** Backend / Procurement and Inventory Teams
- **Dependencies:** US-02, US-15

**Acceptance Criteria**

1. Goods receipt is linked to a valid purchase order.
2. Only authorized managers can confirm receipt.
3. Accepted quantities are validated.
4. A successful receipt increases physical inventory by the accepted quantities.
5. Repeating the same receipt operation cannot increase stock a second time.
6. The receipt status and inventory changes are committed atomically.
7. Failed receipt operations do not partially increase stock.
8. Receipt events are recorded for traceability.

**Implementation Tasks**

- Define goods receipt model.
- Implement receipt validation.
- Implement transactional stock updates.
- Add duplicate-receipt protection.
- Test repeated and failed receipt operations.

---

## 7. Backlog Summary

| Story | Description | Priority | Points | Main Dependencies |
|---|---|---|---:|---|
| US-01 | Role-Based Authorization | P0 | 5 | None |
| US-02 | Manage Ingredients | P0 | 5 | US-01 |
| US-03 | View Available Stock | P0 | 3 | US-02 |
| US-04 | Record Inventory Adjustments | P0 | 5 | US-01, US-02, US-03 |
| US-05 | Manage Recipes | P0 | 5 | US-02 |
| US-06 | Create an Order | P0 | 5 | US-01, US-05 |
| US-07 | Reserve Ingredients Atomically | P0 | 8 | US-03, US-05, US-06 |
| US-08 | View Pending Orders | P0 | 3 | US-06, US-07 |
| US-09 | Start Preparation and Consume Stock | P0 | 8 | US-03, US-07, US-08 |
| US-10 | Mark an Order as Ready | P0 | 3 | US-09 |
| US-11 | Cancel an Order Before Preparation | P0 | 5 | US-07 |
| US-12 | Authorized Cancellation After Preparation | P0 | 5 | US-01, US-09, US-10 |
| US-13 | View Order and Inventory History | P0 | 5 | US-04, US-09, US-11, US-12 |
| US-14 | Receive Low-Stock Alerts | P0 | 3 | US-02, US-03 |
| US-15 | Create Purchase Orders | P1 | 5 | US-02 |
| US-16 | Receive Goods Without Duplicate Stock Updates | P1 | 8 | US-02, US-15 |

**Estimated P0 Total:** 68 Story Points  
**Estimated P1 Total:** 13 Story Points  
**Estimated Overall Total:** 81 Story Points

These estimates are preliminary and require team review. They represent the planned backlog, not a confirmed Sprint 3 capacity commitment. Existing estimates and priorities are retained pending team review.

## 8. Suggested Implementation Order

The recommended order of implementation is:

1. Establish role permissions and ingredient models.
2. Implement inventory availability and recipe management.
3. Implement order creation and atomic reservations.
4. Implement kitchen order retrieval.
5. Implement preparation transitions and exactly-once stock consumption.
6. Implement cancellation rules and auditability.
7. Implement low-stock alerts.
8. Implement P1 procurement features in a later iteration.

Dependencies may be refined during sprint planning.

## 9. Sprint Baseline and Sprint 2 Refinement Deliverables

Sprint 1 established the project foundation rather than implementing the entire product backlog. Its approved scope and business rules remain the baseline for Sprint 2.

Sprint 1 baseline documentation activities included:

- Preparing and reviewing the Project Proposal.
- Preparing the System Vision & Boundary specification.
- Creating the Initial Product Backlog.
- Reviewing User Stories and Acceptance Criteria with QA.
- Verifying API-related requirements against the OpenAPI draft.
- Checking consistency with the approved RACI Matrix and Sprint Task Board.
- Reviewing priorities, dependencies, and estimates with the team.

Sprint 2 backlog refinement deliverables for Issue #46 are:

1. Review each existing story against `docs/project-proposal.md`, `docs/system-vision.md`, `docs/srs.md`, and `api/openapi.yaml`.
2. Confirm each story has a clear actor, goal, business value, unique ID, priority, estimate, dependencies, and testable acceptance criteria.
3. Check all state transitions and inventory effects against BR-01 through BR-10.
4. Record unresolved scope, permission, API, or terminology differences for review; do not assume they are approved.
5. Submit changes in a feature branch, link the pull request to Issue #46, obtain peer review, and merge into `develop` only after approval.

**Completion evidence:** A reviewed and merged update to `docs/product-backlog.md` on `develop`. Sprint 2 baseline: PR #55. Sprint 3 completion requires separate review and merge.

## 10. Sprint 3 Review and Validation Checklist

- [ ] Product scope verified with Tuğçe.
- [ ] Acceptance Criteria reviewed with Beyzanur (QA).
- [ ] API-related requirements reviewed with Ayşe.
- [ ] Story Points and priorities reviewed by the development team.
- [ ] Backlog verified against the latest Project Proposal.
- [ ] Backlog verified against the latest System Vision & Boundary.
- [ ] RACI and task ownership confirmed.
- [ ] Every P0 story checked for unique ID, actor, goal, value, priority, dependencies, and testable acceptance criteria.
- [ ] Requirements traceability and API operation mappings confirmed with SRS and API owners.
- [ ] Any unresolved questions recorded and assigned for review.
- [ ] Product Backlog Pull Request reviewed, approved, and merged into `develop`.

## 11. Definition of Ready

A User Story is ready for implementation when:

1. The business objective is understandable.
2. The responsible actor is identified.
3. Acceptance Criteria are specific and testable.
4. Dependencies are documented.
5. Priority and Story Points have been reviewed.
6. Required API or data model considerations are understood.
7. No unresolved contradiction exists with the approved product scope.

## 12. Sprint 3 Traceability and Review Matrix

The following is a **proposed topic-level mapping**, not a verified mapping to specific SRS requirement IDs or OpenAPI operation IDs. Exact identifiers must be checked in the latest SRS and API draft before the related acceptance criteria are marked complete.

| Story IDs | Business Rules / Scope | SRS / API Verification Topic | Review Focus |
|---|---|---|---|
| US-01 | BR-08, BR-10 | Roles and authorization | Waiter, Chef, Manager permissions; privileged cancellation |
| US-02, US-03, US-04 | BR-03, BR-09, BR-10 | Ingredients, inventory quantities, adjustments | Available = physical − reserved; audit and quantity invariants |
| US-05 | Recipe and order snapshots | Recipes and recipe versioning | Existing orders retain original ingredient requirements |
| US-06, US-07 | BR-02, BR-04, BR-09 | Order creation and atomic reservation | All-or-nothing validation, concurrency, duplicate requests |
| US-08, US-09, US-10 | BR-01, BR-05, BR-06 | Kitchen queue and order status changes | Pending → Preparing → Ready; exactly-once consumption |
| US-11, US-12 | BR-07, BR-08, BR-10 | Cancellation and authorization | Pending releases reservations; post-start cancellation never restores consumed stock |
| US-13 | BR-10 | Audit trail and history | Actor, timestamp, event and related entity IDs |
| US-14 | MVP low-stock monitoring | Low-stock threshold and alert retrieval | Available-stock threshold, no automatic purchase order |
| US-15, US-16 | P1, post-MVP | Future procurement and goods receipt | Not a Sprint 3 or MVP delivery commitment |

### 12.1 Open Questions for Team Review

- **API alignment — order creation:** The supplied Sprint 3 baseline OpenAPI `createOrder` description specifies `WAITER` only. Preserve US-06 AC1 and verify rejection of Manager and Chef requests in tests.
- Confirm exact SRS requirement IDs and API paths/operation IDs for each applicable story; do not invent missing identifiers.
- Confirm whether the API draft supports idempotency for order creation and preparation transitions as required by US-07 and US-09.
- Confirm how authorized waiter cancellation after preparation starts is represented and audited.
- Confirm how recipe snapshots/versioning and low-stock thresholds are represented in the data model.
- Confirm story points, proposed owners, priorities, and dependencies with the development team.
- Keep P1 procurement explicitly outside the MVP unless a formally approved scope change is recorded.

### 12.2 Sprint 3 implementation and test traceability (working mapping)

Task IDs follow the Sprint 3 team plan v2.4. GitHub issue numbers are included only where visible in the supplied issue list; #119 and #120 mappings are provisional pending issue-body review. API operation IDs are present in the supplied OpenAPI baseline; this is not evidence of implementation. QA task S3-24 will supply criterion-level test links. PR and test evidence remain pending for every row.

| Story | SRS | Planned tasks / known issues | API operations (examples) | PR / test evidence |
|---|---|---|---|---|
| US-01 | FR-01 | S3-40, S3-31 | login, getCurrentUser | Pending |
| US-02 | FR-02 | S3-37A, S3-34 | createIngredient, listIngredients, updateIngredient, deactivateIngredient | Pending |
| US-03 | FR-03 | S3-37A, S3-34 | listInventory, getInventoryItem | Pending |
| US-04 | FR-04 | S3-37B (#119), S3-34, S3-05 | createStockAdjustment | Pending |
| US-05 | FR-05 | S3-37B (#119), S3-37A, S3-34, S3-05 | replaceRecipe, listRecipeVersions, getRecipe | Pending |
| US-06 | FR-06 | S3-16, S3-32 | createOrder | Pending |
| US-07 | FR-07 | S3-16, S3-32 | createOrder, listReservations | Pending |
| US-08 | FR-08 | S3-33 | listOrders, getOrder | Pending |
| US-09 | FR-09 | S3-17, S3-33 | updateOrderStatus | Pending |
| US-10 | FR-10 | S3-17, S3-33 | updateOrderStatus | Pending |
| US-11 | FR-11 | S3-18, S3-32 | updateOrderStatus | Pending |
| US-12 | FR-12 | S3-18, S3-32 | updateOrderStatus | Pending |
| US-13 | FR-13 | S3-38 (#120), S3-34 | listAuditLogs, listStockMovements | Pending |
| US-14 | FR-14 | S3-38 (#120), S3-34 | listLowStockAlerts | Pending |

US-15 and US-16 remain post-MVP. Menu item management and authentication details require a final story-coverage check with SRS/API owners; do not treat the existing recipe and authorization stories as complete coverage without review. Staff administration is pending #124. QA coordination: S3-20 through S3-25; CI: S3-26 and S3-27. No test or PR completion is claimed.

## 13. Final Scope Confirmation

The agreed MVP order workflow is:

- `Pending`: Ingredients are reserved; physical stock is unchanged.
- `Preparing`: Reserved ingredients are consumed; physical stock is deducted once.
- `Ready`: Preparation is complete; no further stock deduction.
- `Cancelled`: Cancellation follows the applicable authorization and inventory rules.

`Delivered` is explicitly excluded from the MVP.

Purchase orders and goods receipt are included in the initial backlog for future development but are not MVP commitments.

**Document Owner:** Burcu Ücük  
**Deliverable:** `docs/product-backlog.md`  
**Review Status:** Pending QA, API, scope, and team approval.  
**Change Tracking:** [Issue #125](https://github.com/seng321-7th-team/PantryChef/issues/125); Sprint 3 review and merge pending.
