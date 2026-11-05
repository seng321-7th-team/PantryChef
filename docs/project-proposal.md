# PantryChef — Project Proposal

**Course:** BM 321 — Software Engineering  
**Team:** Team 7  
**Project Name:** PantryChef  
**Sprint:** Sprint 1 — Project Foundation  
**Responsible:** Burcu Ücük  
**Role:** Product Owner and Requirements Engineer  
**Consulted:** Beyzanur Alpay, Ayşe Dural, Tuğçe Çevik

## 1. Project Overview

PantryChef is a restaurant order management and ingredient inventory tracking system designed to improve communication between waiters, chefs, and restaurant managers.

The system connects customer orders with recipe-based ingredient inventory. It helps restaurants prevent duplicate order entry, avoid accepting orders with insufficient ingredients, and monitor stock levels more effectively.

## 2. Problem Definition

Restaurants may experience operational problems when customer orders and ingredient inventory are managed separately.

The main problems include:

- Duplicate or incorrect order entry.
- Limited visibility of available ingredient quantities.
- Poor communication between waiters and kitchen staff.
- Acceptance of orders when required ingredients are unavailable.
- Delayed identification of low-stock ingredients.
- Manual inventory updates that increase workload and the risk of errors.

These problems can cause order delays, ingredient shortages, customer dissatisfaction, and inefficient restaurant operations.

## 3. Project Objectives

The main objectives of PantryChef are:

1. Provide a centralized system for restaurant order management.
2. Allow waiters to create and monitor customer orders.
3. Allow chefs to view incoming orders and update preparation statuses.
4. Automatically reserve required ingredient quantities when an order is accepted.
5. Prevent stock inconsistencies through atomic ingredient reservation.
6. Notify restaurant managers when ingredient quantities fall below defined thresholds.
7. Reduce manual inventory tracking and improve coordination between restaurant staff.

## 4. Stakeholders and System Actors

### 4.1 Restaurant Manager

The restaurant manager is responsible for maintaining ingredient and recipe information, monitoring inventory quantities, configuring low-stock thresholds, and reviewing restaurant operations.

### 4.2 Waiter

The waiter enters customer orders into the system, checks order statuses, and requests order cancellation when necessary.

### 4.3 Chef / Kitchen Staff

The chef views incoming orders, confirms when preparation begins, and updates order statuses during the preparation workflow.

### 4.4 External Stakeholders

Suppliers are external stakeholders associated with restaurant ingredient procurement. Direct supplier integration is not included in the initial MVP.

## 5. Proposed Solution

PantryChef provides a centralized workflow connecting order entry, kitchen operations, and ingredient inventory management.

When a waiter submits an order, the system identifies the ingredients required by the selected recipes and checks their availability.

If all required ingredients are available, the system accepts the order and reserves the required quantities atomically.

If any required ingredient is insufficient, the reservation operation is rejected entirely, and no ingredient stock quantities are changed.

Accepted orders become visible to kitchen staff, who can update their preparation statuses.

The restaurant manager can monitor ingredient inventory and receive low-stock alerts.

### 5.1 Order Cancellation Policy

If an order is cancelled while its status is **Reserved**, before the chef has started preparation, its reserved ingredients are returned to available inventory.

If the chef has already confirmed that preparation has started, cancelling the order does not restore the reserved ingredients.

This policy prevents incorrect inventory restoration after ingredients may have been used.

## 6. Minimum Viable Product (MVP) Scope

The initial MVP includes the following features:

- Role-based access for restaurant managers, waiters, and chefs.
- Customer order creation by waiters.
- Incoming order visibility for kitchen staff.
- Order preparation status tracking.
- Ingredient inventory management.
- Recipe-based ingredient requirements.
- Atomic ingredient reservation.
- Insufficient-stock validation.
- Order cancellation with the defined stock restoration policy.
- Low-stock alerts for restaurant managers.

### 6.1 Out-of-Scope Features

The following features are excluded from the initial MVP:

- Online payment processing.
- Customer-facing food delivery applications.
- Third-party delivery platform integrations.
- Advanced sales forecasting and artificial intelligence.
- Direct supplier system integration.
- Multi-branch restaurant management.
- Advanced financial and accounting modules.

These features may be considered in future development stages.

## 7. Business Value

PantryChef aims to provide the following benefits:

- Reduced duplicate and incorrect order entries.
- Improved coordination between waiters and kitchen staff.
- More reliable ingredient inventory information.
- Prevention of orders that cannot be prepared due to insufficient stock.
- Reduced manual stock management.
- Earlier identification of ingredient shortages.
- Improved operational efficiency and customer service.

## 8. Technical Feasibility

PantryChef is planned as a web-based software application developed using open-source technologies.

The project will follow software engineering practices including:

- GitHub-based version control and collaboration.
- Git-Flow branching.
- Requirements engineering and product backlog management.
- API-first development using an OpenAPI YAML contract.
- Modular software architecture.
- Automated testing and continuous integration.
- Container-based deployment in later project stages.

The system is considered feasible as a semester project because its MVP focuses on a clearly defined restaurant workflow and a limited set of essential features.

Specific implementation technologies and architectural decisions will be finalized collaboratively with the Software Architect and development team.

## 9. Assumptions

The project is based on the following assumptions:

1. Restaurant staff have access to an internet-connected device.
2. Ingredient and recipe information is maintained by authorized restaurant personnel.
3. Recipe ingredient quantities are defined accurately.
4. Each order can be associated with the ingredients required for preparation.
5. The restaurant manager is responsible for correcting inventory records when necessary.
6. The initial system supports a single restaurant location.

## 10. Risks and Mitigation Strategies

| Risk | Mitigation Strategy |
|---|---|
| Incorrect ingredient quantities | Validate inventory inputs and allow authorized adjustments. |
| Duplicate order submissions | Apply order validation and duplicate-request protection. |
| Concurrent orders causing stock inconsistencies | Use atomic inventory reservation operations. |
| Incorrect cancellation behavior | Enforce cancellation rules based on preparation status. |
| Scope expansion | Prioritize MVP requirements and maintain the product backlog. |
| Integration difficulties | Maintain a consistent OpenAPI contract and coordinate between team roles. |
| Limited development time | Use sprint planning and prioritize essential features. |

## 11. Open-Source License

The selected open-source license for PantryChef is the MIT License.

The MIT License is a permissive open-source license that allows software to be used, modified, distributed, and reused while requiring preservation of the original copyright and license notice.

It is suitable for this educational project because it supports collaboration and future development with relatively simple licensing requirements.

The corresponding LICENSE file will be added to the repository.

## 12. Sprint 1 Deliverables and Collaboration

As Product Owner and Requirements Engineer, the responsible team member coordinates the product scope and requirements.

The related Sprint 1 deliverables include:

- Project Proposal and Problem Definition.
- System Vision and System Boundary Specification.
- Initial Product Backlog.
- User Stories and Acceptance Criteria.
- Backlog prioritization and stakeholder validation.

The Product Owner collaborates with:

- **Beyzanur Alpay (QA):** Review testability and acceptance criteria.
- **Ayşe Dural (Software Architect):** Verify technical feasibility and consistency with the OpenAPI contract.
- **Tuğçe Çevik (Implementation and Integration):** Review implementation and integration considerations.
- **Bilgesu Nacak (Scrum Master):** Coordinate sprint planning and track requirements-related tasks.
- **Emre Boz (DevOps):** Coordinate repository and open-source license setup.

## 13. Success Criteria

The project will be considered successful when:

1. Waiters can create valid orders without unintended duplicate processing.
2. Chefs can view and update incoming order statuses.
3. Orders are accepted only when all required ingredients are available.
4. Ingredient reservation is atomic and does not allow partial stock changes on failure.
5. Cancellation follows the defined ingredient restoration policy.
6. Restaurant managers can manage ingredients and monitor low-stock alerts.
7. The MVP is demonstrated successfully with documented requirements and test evidence.

## 14. Conclusion

PantryChef aims to improve restaurant operations by integrating order management with ingredient inventory tracking.

Its MVP focuses on reliable order processing, atomic ingredient reservation, kitchen coordination, and inventory visibility.

The project provides a manageable foundation for further development while following the requirements engineering, collaboration, testing, and deployment practices expected in the BM 321 Software Engineering course.
