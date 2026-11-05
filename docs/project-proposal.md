# PantryChef — Project Proposal

**Course:** BM 321 — Software Engineering  
**Team:** Team 7  
**Project Name:** PantryChef  
**Sprint:** Sprint 1 — Project Foundation  
**Responsible:** Burcu Ücük  
**Role:** Product Owner and Requirements Engineer  
**RACI:** Responsible (R) and Accountable (A)  
**Document:** `docs/project-proposal.md`  
**Status:** Updated — Pending Team Review

---

## 1. Project Overview

PantryChef is a web-based restaurant order management and ingredient inventory tracking system designed to improve coordination between waiters, chefs, and restaurant managers.

The system connects customer orders with recipe-based ingredient reservations and physical inventory consumption. It provides a centralized platform for creating and tracking orders, managing ingredients and recipes, monitoring inventory availability, and coordinating kitchen activities.

PantryChef aims to reduce duplicate order entry, prevent stock inconsistencies, improve ingredient availability visibility, and minimize manual inventory management.

The initial Minimum Viable Product (MVP) focuses on order management, atomic ingredient reservation, physical stock consumption, kitchen workflow tracking, and low-stock monitoring.

## 2. Problem Definition

Restaurants may experience operational difficulties when customer orders and ingredient inventory are managed manually or through disconnected systems.

The main problems include:

- Duplicate or incorrect customer order entries.
- Limited visibility of available ingredient quantities.
- Poor communication between waiters and kitchen staff.
- Acceptance of orders without sufficient available ingredients.
- Inaccurate inventory records caused by manual stock updates.
- Duplicate ingredient consumption during repeated status updates.
- Delayed identification of low-stock ingredients.
- Incorrect inventory restoration after order cancellation.

These problems may result in order delays, unexpected ingredient shortages, operational inefficiency, and customer dissatisfaction.

PantryChef addresses these issues by integrating order management, ingredient reservation, physical stock consumption, and kitchen workflow tracking into a centralized system.

## 3. Project Objectives

The main objectives of PantryChef are:

1. Provide a centralized restaurant order management system.
2. Reduce duplicate and inconsistent customer order records.
3. Allow waiters to create and monitor customer orders.
4. Allow chefs to view incoming orders and update preparation statuses.
5. Reserve required ingredients when orders are successfully created.
6. Separate ingredient reservation from physical stock consumption.
7. Deduct physical inventory exactly once when preparation begins.
8. Prevent partial reservations and inconsistent inventory updates.
9. Support controlled order cancellation and reservation release.
10. Provide restaurant managers with inventory visibility and low-stock alerts.
11. Maintain traceable order and inventory transactions.

## 4. Stakeholders and System Actors

### 4.1 Restaurant Manager

The Restaurant Manager is responsible for:

- Managing ingredient records and recipes.
- Monitoring physical, reserved, and available stock quantities.
- Performing authorized inventory adjustments.
- Configuring and monitoring low-stock thresholds.
- Reviewing restaurant operations.
- Cancelling orders according to the defined authorization and inventory rules.

### 4.2 Waiter

The Waiter is responsible for:

- Creating customer orders.
- Viewing order statuses.
- Cancelling Pending orders when necessary.
- Delivering completed orders to customers as an operational activity.

A Waiter with explicitly granted additional authorization may cancel orders during Preparing or Ready, provided that a cancellation reason and transaction record are maintained.

This additional permission does not create a separate primary system actor.

### 4.3 Chef / Kitchen Staff

The Chef is responsible for:

- Viewing incoming Pending orders.
- Confirming the start of preparation.
- Updating order status to Preparing.
- Marking completed orders as Ready.

### 4.4 External Stakeholders

**Suppliers:** Provide ingredients to the restaurant. Direct supplier system integration is outside the initial MVP.

**Restaurant Customers:** Receive restaurant services but do not directly interact with the initial system.

## 5. Proposed Solution

PantryChef provides a centralized workflow connecting customer order creation, ingredient reservation, kitchen preparation, and inventory monitoring.

When a Waiter creates an order, the system determines the required ingredients from the associated recipes and checks their available quantities.

If all required ingredients are available, the order is accepted with Pending status, and the required quantities are reserved atomically.

If any ingredient is insufficient, the reservation fails entirely without changing inventory quantities.

When the Chef begins preparation, the system converts the active reservation into physical ingredient consumption. Physical stock is deducted exactly once.

When preparation is completed, the Chef marks the order as Ready. No additional stock deduction occurs.

The system also supports controlled cancellation and low-stock monitoring.

### 5.1 Order Lifecycle

The approved order lifecycle consists of the following states:

| Order Status | Description | Inventory Effect |
|---|---|---|
| Pending | Order accepted and waiting for kitchen preparation. | Ingredients are reserved; physical stock remains unchanged. |
| Preparing | Chef has started preparing the order. | Reserved quantities are consumed and physical stock is deducted exactly once. |
| Ready | Kitchen preparation has been completed. | No additional stock deduction occurs. |
| Cancelled | Order has been cancelled according to authorization rules. | Inventory handling depends on whether preparation has started. |

The normal workflow is:

**Order Created → Pending → Preparing → Ready**

An order may transition to Cancelled according to the cancellation policy.

Ready represents the final state of the normal MVP order workflow. A separate Delivered status is not included.

### 5.2 Ingredient Reservation and Physical Stock Consumption

PantryChef distinguishes between three inventory quantities.

**Physical Stock:** The actual recorded quantity of an ingredient in the restaurant's inventory.

**Reserved Stock:** The quantity allocated to accepted Pending orders but not yet physically consumed.

**Available Stock:** The quantity available for new orders.

The relationship is:

**Available Stock = Physical Stock − Reserved Stock**

When an order enters Pending:

- Required ingredient quantities are validated.
- Ingredients are reserved atomically.
- Reserved Stock increases.
- Available Stock decreases.
- Physical Stock remains unchanged.

When an order enters Preparing:

- The active reservation is consumed.
- Reserved Stock decreases.
- Physical Stock decreases by the required ingredient quantities.
- Physical stock deduction occurs exactly once.
- Available Stock does not decrease a second time for the same ingredients.

When an order enters Ready, no additional inventory deduction is performed.

Ingredient reservation is maintained as a system record rather than a separate physical storage location.

### 5.3 Atomic Reservation and Inventory Consistency

Ingredient reservation must be atomic.

If an order requires multiple ingredients, all required quantities must be available before the reservation succeeds.

If any required ingredient is insufficient:

- The entire reservation operation is rejected.
- No partial reservation is performed.
- Physical and reserved stock quantities remain unchanged.
- The system reports the insufficient-stock condition.

Concurrent order requests must not reserve more ingredients than are available.

Repeated requests to start preparation must not cause duplicate physical stock deductions.

### 5.4 Order Cancellation Policy

Cancellation behavior depends on the current order status and user authorization.

**Cancellation During Pending**

A Waiter or Restaurant Manager may cancel a Pending order.

When cancellation succeeds:

- The active ingredient reservation is released.
- Reserved Stock decreases.
- Available Stock increases accordingly.
- Physical Stock remains unchanged.
- The order transitions to Cancelled.

**Cancellation During Preparing or Ready**

Only the Restaurant Manager or a Waiter with explicitly granted cancellation permission may perform this action.

The cancellation must include:

- An authorized user.
- A recorded cancellation reason.
- A traceable cancellation transaction.

Because preparation has already started:

- Previously consumed ingredients are not automatically restored.
- Physical inventory is not increased by cancellation.
- Any necessary inventory correction must be performed through an authorized inventory adjustment.

Cancelled is a terminal order state.

## 6. Minimum Viable Product (MVP) Scope

### 6.1 Order Management

- Customer order creation by Waiters.
- Order validation and duplicate-submission protection.
- Recipe-based ingredient availability checks.
- Order status tracking.
- Pending, Preparing, Ready, and Cancelled states.
- Controlled order cancellation.
- Cancellation reasons and transaction records for authorized post-preparation cancellations.

### 6.2 Kitchen Management

- Display of incoming Pending orders.
- Confirmation of preparation start.
- Order status updates from Pending to Preparing and Ready.
- Prevention of duplicate physical stock deductions.

### 6.3 Ingredient and Recipe Management

- Ingredient record management.
- Recipe creation and maintenance.
- Definition of ingredient quantities required by recipes.
- Physical, Reserved, and Available Stock tracking.
- Atomic ingredient reservation.
- Physical ingredient consumption when preparation begins.
- Authorized inventory adjustments.

### 6.4 Stock Monitoring

- Low-stock threshold configuration.
- Low-stock alerts for Restaurant Managers.
- Inventory quantity visibility.
- Consistent inventory updates during order processing.

### 6.5 Role-Based Access

- Restaurant Manager permissions.
- Waiter permissions.
- Chef permissions.
- Additional authorization for restricted cancellation operations.

### 6.6 Out-of-Scope Features

The following capabilities are excluded from the initial MVP:

- Online payment processing.
- Customer-facing food delivery applications.
- Third-party delivery platform integration.
- Advanced artificial intelligence and sales forecasting.
- Direct supplier system integration.
- Multi-branch restaurant management.
- Advanced accounting and financial modules.
- A separate Delivered order state.

These features may be considered in future development stages.

## 7. Business Value

**Improved Order Accuracy:** Centralized order management reduces duplicate and inconsistent order records.

**Reliable Ingredient Availability:** Reservation-based tracking prevents ingredients allocated to existing orders from being treated as available for new orders.

**Improved Inventory Consistency:** Separating reservation from physical consumption reduces incorrect inventory deductions.

**Better Kitchen Coordination:** Waiters and chefs can follow order progress through a shared workflow.

**Reduced Manual Workload:** Automated reservation, consumption, and stock monitoring reduce manual inventory operations.

**Improved Traceability:** Cancellation reasons, authorization checks, and inventory transaction records support accountability.

**Early Shortage Detection:** Low-stock alerts help restaurant managers identify ingredient shortages.

## 8. Technical Feasibility

PantryChef is planned as a web-based application using open-source development technologies.

The project will follow software engineering practices including:

- GitHub-based version control.
- Git-Flow branching and Pull Request reviews.
- Requirements engineering and backlog prioritization.
- API-first design using an OpenAPI YAML contract.
- Modular software architecture.
- Role-based authorization.
- Automated testing and continuous integration.
- Container-based deployment in later project stages.

The MVP is considered feasible within the academic project timeline because it focuses on a limited number of actors and a clearly defined order and inventory workflow.

The main technical challenges include concurrent reservations, atomic inventory updates, duplicate-request protection, and exactly-once physical stock consumption.

These challenges will be addressed through appropriate transaction handling, consistent state transitions, validation, and testing.

Specific implementation technologies and architecture decisions will be finalized by the responsible technical team members.

## 9. Assumptions and Constraints

### 9.1 Assumptions

1. Restaurant staff have access to an internet-connected device.
2. Ingredient records and recipes are maintained by authorized personnel.
3. Recipe ingredient quantities are accurately defined.
4. The initial system supports a single restaurant location.
5. Restaurant Managers are responsible for authorized inventory corrections.
6. Kitchen staff update preparation statuses when relevant activities occur.
7. Ingredient reservations are maintained as system records rather than a separate physical storage location.

### 9.2 Constraints

- The MVP must remain within the approved project scope.
- The system must support the three primary actor roles.
- Ingredient reservation must be atomic.
- Physical stock must not be deducted during Pending.
- Physical stock must be deducted exactly once when Preparing begins.
- Ready must not trigger additional inventory consumption.
- Unauthorized cancellation operations must be rejected.
- Cancellation after preparation must not automatically restore consumed stock.

## 10. Risks and Mitigation Strategies

| Risk | Mitigation Strategy |
|---|---|
| Duplicate order submission | Implement duplicate-request protection and order validation. |
| Insufficient ingredients | Validate all required quantities before atomic reservation. |
| Concurrent orders exceeding available stock | Use transactional reservation and concurrency control. |
| Partial reservation failures | Enforce all-or-nothing reservation operations. |
| Duplicate physical stock deduction | Ensure repeated Preparing requests cannot consume ingredients more than once. |
| Incorrect reservation release | Release reservations only for eligible Pending cancellations. |
| Unauthorized cancellation | Enforce role-based permission checks. |
| Incorrect post-preparation inventory restoration | Prevent automatic stock restoration and require authorized corrections. |
| Inaccurate recipe quantities | Validate recipe data and allow authorized maintenance. |
| Integration inconsistencies | Align Project Proposal, System Vision, OpenAPI, and Product Backlog. |
| Scope expansion | Maintain approved MVP boundaries and backlog priorities. |
| Limited development time | Prioritize essential features and track sprint progress. |

## 11. Open-Source License

The selected open-source license for PantryChef is the **MIT License**.

The MIT License is a permissive open-source license that allows software to be used, modified, distributed, and reused, including for commercial purposes.

The license requires preservation of the applicable copyright and license notices in copies or substantial portions of the software.

The MIT License is appropriate for PantryChef because:

- It supports academic collaboration.
- It allows future project extension and reuse.
- It has relatively simple compliance requirements.
- It is compatible with common open-source development workflows.

The corresponding `LICENSE` file will be added to the repository using the standard MIT License text and appropriate copyright information.

## 12. Sprint 1 Responsibilities and Collaboration

The Sprint 1 responsibilities follow the updated PantryChef team responsibility distribution.

### 12.1 Product Owner and Requirements Engineer

**Responsible and Accountable: Burcu Ücük**

The Product Owner and Requirements Engineer is responsible for three main Sprint 1 documentation deliverables.

**A. Project Proposal and Open-Source License**

- Define the project problem, objectives, and proposed solution.
- Identify stakeholders and primary system actors.
- Explain the project's business value and technical feasibility.
- Define MVP scope and excluded features.
- Document assumptions, constraints, risks, and mitigation strategies.
- Select and justify the MIT open-source license.

**Deliverable:** `docs/project-proposal.md`

**B. System Vision and Boundary**

- Define the overall system vision and objectives.
- Identify primary actors and external stakeholders.
- Specify the system boundary and external interactions.
- Define in-scope and out-of-scope capabilities.
- Document the approved order lifecycle: Pending, Preparing, Ready, and Cancelled.
- Describe atomic ingredient reservation and physical stock consumption.
- Define cancellation permissions and inventory restoration rules.
- Prepare the system boundary diagram.
- Ensure consistency with the Project Proposal and OpenAPI draft.

**Collaborators:** Ayşe Dural and Tuğçe Çevik.

**C. Initial Product Backlog**

- Define the main product Epics and Features.
- Prepare prioritized User Stories.
- Define implementation Tasks and testable Acceptance Criteria.
- Assign P0/P1 priorities and Story Point estimates.
- Identify dependencies and responsible team members.
- Include order management, ingredient inventory, recipe management, stock reservation, physical consumption, and low-stock alerts.
- Ensure backlog items follow the approved order and cancellation workflow.
- Review acceptance criteria with Beyzanur.
- Verify API-related requirements with Ayşe.
- Maintain consistency with the approved MVP scope.

**Deliverable:** `docs/product-backlog.md`

### 12.2 Collaboration with Other Team Roles

**Beyzanur Alpay — QA Engineer**

Reviews requirement testability, acceptance criteria, and early test scenarios. Provides QA feedback on the Initial Product Backlog.

**Ayşe Dural — Software Architect and Technical Lead**

Prepares the OpenAPI YAML draft and provides technical guidance for system interactions, order status transitions, inventory operations, and API consistency.

**Tuğçe Çevik — Technical Consultation and Integration**

Provides technical consultation on system scope, boundary definitions, feasibility, and integration considerations.

**Bilgesu Nacak — Scrum Master and Agile Process Coach**

Coordinates Sprint 1 planning, task tracking, the RACI Matrix, GitHub Projects Board, and meeting documentation.

**Emre Boz — DevOps and CI/CD Infrastructure Engineer**

Maintains repository infrastructure, Git-Flow documentation, branch protection, and development workflow configuration.

### 12.3 Sprint 1 Documentation Consistency

The Project Proposal, System Vision and Boundary, Initial Product Backlog, and OpenAPI draft must follow the same approved PantryChef scenario.

The approved order lifecycle is:

**Order Created → Pending → Preparing → Ready**

Cancellation follows the defined authorization and inventory rules.

Ingredient reservation occurs during Pending, while physical stock consumption occurs exactly once when preparation begins.

The Product Owner is responsible for maintaining consistency between product scope, requirements, and backlog priorities.

Team responsibilities must remain aligned with the updated Sprint 1 responsibility distribution and RACI Matrix.

## 13. Success Criteria

The PantryChef MVP will be considered successful when:

1. Waiters can create valid customer orders.
2. Duplicate submissions do not unintentionally create duplicate orders.
3. Orders enter Pending only after successful ingredient reservation.
4. Insufficient-stock requests fail without changing inventory quantities.
5. Ingredient reservation is atomic and consistent under concurrent requests.
6. Physical Stock remains unchanged while an order is Pending.
7. Starting preparation consumes the corresponding reservation and deducts physical stock exactly once.
8. Repeated preparation requests do not cause duplicate stock deductions.
9. Chefs can update orders from Pending to Preparing and Ready.
10. Ready does not trigger additional stock deduction.
11. Cancelling a Pending order releases its reservation without reducing physical stock.
12. Cancellation during Preparing or Ready requires appropriate authorization, a reason, and a traceable record.
13. Post-preparation cancellation does not automatically restore consumed ingredients.
14. Restaurant Managers can manage recipes, ingredients, and authorized inventory adjustments.
15. Low-stock alerts are available to Restaurant Managers.
16. The documented system behavior is consistent across the Project Proposal, System Vision, OpenAPI contract, and Product Backlog.

## 14. Conclusion

PantryChef aims to improve restaurant operations by integrating customer order management, kitchen coordination, ingredient reservation, and physical inventory consumption into a centralized system.

The proposed MVP focuses on reliable order processing, atomic ingredient reservation, exactly-once physical stock deduction, controlled cancellation, and inventory visibility.

By distinguishing reserved ingredients from physically consumed ingredients, PantryChef provides a consistent inventory model that supports accurate order handling and reduces operational errors.

The project establishes a feasible foundation for future implementation while following the requirements engineering, collaboration, documentation, testing, and deployment practices expected in the BM 321 Software Engineering course.
