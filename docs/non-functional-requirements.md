# PantryChef — Functional and Non-Functional Requirements

**Project:** PantryChef — Restaurant Order and Inventory Management System  
**Course:** BM 321 / SENG 321 — Software Engineering  
**Team:** Team 7  
**Sprint:** Sprint 2 — Requirements and Architecture  
**Responsible:** Burcu Ücük — Product Owner and Requirements Engineer  
**Reviewer:** Beyzanur Alpay — QA Engineer  
**Related Issue:** #49 — S2-03  
**Document Status:** Draft — Pending Team Review

---

## 1. Purpose

This document defines the functional and non-functional requirements of PantryChef for the approved Minimum Viable Product (MVP).

It refines the high-level requirements established in Sprint 1 and provides a testable foundation for the Software Requirements Specification (SRS), architecture design, implementation, and quality assurance.

The requirements are aligned with the Project Proposal, System Vision and Boundary, and Product Backlog.

## 2. System Scope

PantryChef is a web-based restaurant order and ingredient inventory management system.

The system supports three primary actors:

- **Waiter:** Creates orders, monitors order status, and performs permitted cancellations.
- **Chef / Kitchen Staff:** Views incoming orders and updates preparation status.
- **Restaurant Manager:** Manages ingredients, recipes, inventory adjustments, low-stock alerts, and authorized cancellations.

Customers and suppliers are external stakeholders, not authenticated MVP actors.

The MVP excludes online payments, delivery management, supplier integration, automated purchasing, advanced analytics, and multi-branch management.

The supported order states are `Pending`, `Preparing`, `Ready`, and `Cancelled`. A separate `Delivered` state is excluded.

## 3. Functional Requirements

Functional requirements describe the operations that the system must perform.

### 3.1 Access Control

**FR-01 — Role-Based Authorization**

The system shall recognize the Waiter, Chef/Kitchen Staff, and Restaurant Manager roles and enforce permissions for protected operations.

**Acceptance Criteria:**
- Authorized users can perform operations permitted for their roles.
- Unauthorized operations are rejected without modifying application data.
- Exceptional cancellation permissions are explicitly checked.

**Related Story:** US-01

### 3.2 Ingredient and Recipe Management

**FR-02 — Ingredient Management**

The system shall allow authorized Restaurant Managers to create, view, update, and deactivate ingredient records.

Each ingredient shall have a name, measurement unit, physical quantity, and low-stock threshold.

**Related Story:** US-02

**FR-03 — Available Inventory**

The system shall maintain or reliably derive physical, reserved, and available ingredient quantities.

`Available Stock = Physical Stock - Reserved Stock`

Available stock shall not become negative through valid order operations.

**Related Story:** US-03

**FR-04 — Inventory Adjustments**

The system shall allow authorized managers to adjust physical inventory with a recorded reason, actor, and timestamp.

Adjustments that would reduce physical stock below reserved stock shall be rejected.

**Related Story:** US-04

**FR-05 — Recipe Management**

The system shall allow authorized managers to maintain recipes containing ingredient references and positive quantities per portion.

Existing orders shall preserve their original ingredient requirements after recipe changes.

**Related Story:** US-05

### 3.3 Order Creation and Reservation

**FR-06 — Order Creation**

The system shall allow authorized Waiters to create orders containing valid menu items and positive portion quantities.

Successfully created orders shall receive unique identifiers and enter the `Pending` state.

**Related Story:** US-06

**FR-07 — Atomic Ingredient Reservation**

The system shall calculate all required ingredient quantities and verify availability before accepting an order.

If all ingredients are sufficient, the system shall reserve the complete required quantities atomically.

If any ingredient is insufficient, the system shall reject the entire operation without creating an order or partial reservation.

Physical stock shall remain unchanged during reservation.

Concurrent requests shall not over-reserve available inventory, and repeated logical submissions shall not create duplicate orders or reservations.

**Related Story:** US-07

### 3.4 Kitchen Operations

**FR-08 — Kitchen Order Visibility**

The system shall allow authorized kitchen staff to view incoming `Pending` orders, including order identifiers, menu items, quantities, and statuses.

Cancelled orders shall not appear as active preparation tasks.

**Related Story:** US-08

**FR-09 — Preparation and Stock Consumption**

The system shall allow authorized Chefs to change an order from `Pending` to `Preparing`.

During this transition, the system shall atomically release the order's ingredient reservations and deduct the corresponding physical stock exactly once.

Repeated requests shall not cause duplicate deductions.

**Related Story:** US-09

**FR-10 — Order Completion**

The system shall allow authorized kitchen staff to change an order from `Preparing` to `Ready`.

This transition shall not change physical or reserved inventory quantities.

**Related Story:** US-10

### 3.5 Cancellation and Auditability

**FR-11 — Pending Order Cancellation**

The system shall allow a Waiter or Restaurant Manager to cancel a `Pending` order.

Cancellation shall release its ingredient reservations atomically without changing physical stock.

Repeated cancellation requests shall not release the same reservation more than once.

**Related Story:** US-11

**FR-12 — Exceptional Cancellation**

The system shall allow a Restaurant Manager or specifically authorized Waiter to cancel an order in `Preparing` or `Ready`.

The operation shall require a cancellation reason and record the responsible user, timestamp, previous state, and order identifier.

Previously consumed physical stock shall not be automatically restored.

**Related Story:** US-12

**FR-13 — Operation History**

The system shall maintain traceable records of significant order transitions, reservations, stock consumption, cancellations, and inventory adjustments.

Authorized managers shall be able to review these records.

**Related Story:** US-13

### 3.6 Low-Stock Monitoring

**FR-14 — Low-Stock Alerts**

The system shall identify an ingredient as low-stock when:

`Available Stock <= Low-Stock Threshold`

Alerts shall reflect relevant reservations, consumption, cancellations, and inventory adjustments.

Authorized Restaurant Managers shall be able to view current low-stock items.

The MVP shall not automatically create purchase orders.

**Related Story:** US-14

## 4. Non-Functional Requirements

Non-functional requirements describe quality attributes and constraints.

The measurable targets below are **proposed Sprint 2 acceptance targets**, not verified implementation results or previously approved performance commitments. They require review by the technical lead and QA engineer.

### 4.1 Performance

**NFR-01 — Response Time**

Under a proposed test workload of 20 concurrent users, 95% of ordinary order-list and inventory-read requests should complete within 2 seconds in the agreed test environment.

**Verification:** Automated API response-time testing.

**NFR-02 — Transaction Performance**

Under the same proposed workload, 95% of valid order creation and reservation transactions should complete within 3 seconds.

**Verification:** Integration and performance testing.

### 4.2 Reliability and Data Integrity

**NFR-03 — Atomic Transactions**

Order creation, ingredient reservation, preparation-related stock consumption, and cancellation-related reservation release shall use all-or-nothing transaction behavior.

**Verification:** Transaction rollback and failure-injection tests.

**NFR-04 — Inventory Consistency**

Valid system operations shall preserve the relationship between physical, reserved, and available stock.

No successful operation shall cause negative available inventory.

**Verification:** Inventory invariant and concurrent-request tests.

**NFR-05 — Duplicate Operation Protection**

Repeated logical order submissions, preparation requests, and cancellation requests shall not produce duplicate inventory effects.

**Verification:** Idempotency and repeated-request tests.

### 4.3 Security

**NFR-06 — Authorization Enforcement**

Protected operations shall enforce role-based permissions on the server side.

Unauthorized requests shall not change protected application data.

**Verification:** Positive and negative authorization tests.

**NFR-07 — Input Validation**

The system shall validate required fields, ingredient quantities, order quantities, identifiers, and cancellation reasons before processing protected operations.

Invalid input shall be rejected without unintended data changes.

**Verification:** Input validation and negative test cases.

**NFR-08 — Sensitive Operation Traceability**

Significant inventory adjustments and exceptional cancellations shall be associated with the responsible user and timestamp.

Audit records shall not be modifiable through ordinary unauthorized application operations.

**Verification:** Audit-record inspection and access-control tests.

### 4.4 Usability

**NFR-09 — Clear Operational Feedback**

The user interface shall display understandable feedback for successful operations, invalid inputs, insufficient inventory, unauthorized actions, and invalid state transitions.

**Verification:** Scenario-based UI acceptance testing.

**NFR-10 — Role-Appropriate Interface**

The interface shall present the relevant operational functions for each supported role and clearly distinguish order status and inventory quantities.

**Verification:** Role-based interface review and usability testing.

### 4.5 Maintainability and Compatibility

**NFR-11 — Modular Design**

The system should separate order management, inventory management, recipe management, authorization, and audit responsibilities into maintainable components.

**Verification:** Architecture and code review.

**NFR-12 — API Contract Consistency**

Implemented API operations shall remain consistent with the reviewed OpenAPI contract and approved business rules.

Changes affecting the API contract shall be documented and reviewed.

**Verification:** API contract review and integration tests.

**NFR-13 — Web Application Compatibility**

The system should support current stable versions of Chrome and Firefox in the agreed test environment.

**Verification:** Cross-browser functional testing.

### 4.6 Testability and Recovery

**NFR-14 — Automated Verification**

Critical business rules shall be covered by automated tests, particularly atomic reservation, concurrent requests, preparation consumption, cancellation, and authorization.

**Verification:** Test execution and CI reports.

**NFR-15 — Failure Recovery**

A failed inventory-related transaction shall not leave partially committed order states or inventory quantities.

**Verification:** Simulated transaction failure and rollback tests.

## 5. Business Rules and Invariants

The following rules are mandatory for MVP consistency:

| ID | Business Rule |
|---|---|
| BR-01 | Supported states are Pending, Preparing, Ready, and Cancelled. |
| BR-02 | Ingredient reservation is atomic. |
| BR-03 | Available Stock = Physical Stock - Reserved Stock. |
| BR-04 | Pending reserves ingredients without reducing physical stock. |
| BR-05 | Preparing consumes reservations and deducts physical stock exactly once. |
| BR-06 | Ready causes no additional stock deduction. |
| BR-07 | Pending cancellation releases reservations without changing physical stock. |
| BR-08 | Preparing/Ready cancellation requires elevated authorization and a recorded reason. |
| BR-09 | Late cancellation does not automatically restore consumed stock. |
| BR-10 | Unauthorized operations and invalid transitions are rejected. |
| BR-11 | Duplicate requests must not create duplicate inventory effects. |
| BR-12 | Significant order and inventory operations must be traceable. |

## 6. Requirements Traceability Matrix

| Functional Requirement | Backlog Story | Related Quality Requirements |
|---|---|---|
| FR-01 | US-01 | NFR-06, NFR-07 |
| FR-02 | US-02 | NFR-07, NFR-08 |
| FR-03 | US-03 | NFR-04 |
| FR-04 | US-04 | NFR-03, NFR-08 |
| FR-05 | US-05 | NFR-07, NFR-11 |
| FR-06 | US-06 | NFR-01, NFR-07 |
| FR-07 | US-07 | NFR-02, NFR-03, NFR-04, NFR-05 |
| FR-08 | US-08 | NFR-01, NFR-10 |
| FR-09 | US-09 | NFR-03, NFR-04, NFR-05 |
| FR-10 | US-10 | NFR-04, NFR-09 |
| FR-11 | US-11 | NFR-03, NFR-05 |
| FR-12 | US-12 | NFR-06, NFR-08 |
| FR-13 | US-13 | NFR-08 |
| FR-14 | US-14 | NFR-04, NFR-09 |

## 7. Acceptance and Verification Scenarios

The following scenarios shall guide requirements validation:

1. **Successful order:** A valid order creates a Pending record and reserves all required ingredients.
2. **Insufficient stock:** An order requiring an unavailable ingredient is rejected without partial changes.
3. **Concurrent orders:** Competing orders cannot reserve more stock than is available.
4. **Preparation:** Starting preparation deducts physical stock exactly once and releases the reservation.
5. **Repeated preparation:** Repeating a preparation request causes no additional stock deduction.
6. **Ready transition:** Marking an order Ready does not change inventory quantities.
7. **Pending cancellation:** Cancelling a Pending order releases reservations and preserves physical stock.
8. **Late cancellation:** Authorized cancellation records the reason without automatically restoring consumed ingredients.
9. **Unauthorized action:** A user without permission cannot modify protected data.
10. **Low-stock threshold:** An ingredient is flagged when available stock reaches or falls below its threshold.
11. **Invalid transition:** An unsupported order state transition is rejected.
12. **Transaction failure:** A failed operation leaves no partial inventory or order updates.

## 8. Dependencies and Assumptions

- The system initially supports one restaurant.
- Ingredient quantities and recipes are maintained by authorized staff.
- Restaurant employees are responsible for physical inventory verification.
- Reservations are logical allocations rather than separate physical storage.
- Detailed API paths and schemas are maintained in `api/openapi.yaml`.
- The SRS document and architecture artifacts must follow the same approved business rules.
- Proposed quantitative quality targets require technical and QA approval before being treated as baselines.
- Procurement and goods-receipt stories US-15 and US-16 are P1 post-MVP features and are excluded from these MVP requirements.

## 9. Review and Completion Checklist

- [ ] Functional requirements reviewed against the Project Proposal.
- [ ] Requirements verified against the System Vision.
- [ ] Backlog story references reviewed.
- [ ] Functional requirements checked against the SRS.
- [ ] API-related requirements reviewed against the OpenAPI draft.
- [ ] Proposed performance targets reviewed by the technical lead.
- [ ] Testability and verification scenarios reviewed by Beyzanur.
- [ ] MVP scope and business rules confirmed.
- [ ] Pull request linked to Issue #49.
- [ ] Changes reviewed and merged into `develop`.

## 10. Related Documents

- `docs/project-proposal.md`
- `docs/system-vision.md`
- `docs/product-backlog.md`
- `docs/srs.md` — referenced by the Sprint 2 requirements task; availability to be confirmed
- `api/openapi.yaml`
- `docs/sprint2-task-board.md`
- `docs/sprint2-raci.md`

## 11. Conclusion

This document establishes a structured and testable requirements baseline for the PantryChef MVP.

It preserves the approved order lifecycle, atomic ingredient reservation, exactly-once physical stock consumption, controlled cancellation, role-based authorization, and low-stock monitoring rules.

The requirements will support Sprint 2 SRS refinement, architecture design, API consistency review, and future implementation and testing.

**Document Owner:** Burcu Ücük  
**Review Status:** Pending Technical and QA Review  
**Related Issue:** #49 — S2-03
