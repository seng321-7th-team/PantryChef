# PantryChef – Team Roles, RACI Matrix & Scrum Coordination

**Course:** BM 321 – Software Engineering

**Team:** 7 (team identifier; 6 members)

**Project:** PantryChef – Restaurant Inventory and Order Tracking System

**Sprint:** Sprint 1 – Project Foundation

**Document Owner:** Bilgesu Nacak

**Role:** Scrum Master and Agile Process Coach

**Document Status:** Updated – Pending PR Review

## Source authority and correction - 5 November 2026

Role titles and the fixed six-person order follow `gorev_nedim.png`: Burcu, Bilgesu, Ayşe, Beyzanur, Emre, Tuğçe. No seventh-person exception or instructor confirmation is required for this mapping. Sprint delivery ownership follows `gorev_paylastirilmis.jpeg` (the supplied file referred to as .jpg in the request). `sprint1.png` establishes Sprint 1 at the end of Week 2, worth 15%.

This is a document correction requested by the user, not a new team meeting or approval. Existing meeting facts, technical policies, PR references and progress claims are retained as historical/unverified records. A PR's original author does not establish the corrected owner. No GitHub changes or live verification were performed.

---

## 1. Project Overview

PantryChef is a restaurant inventory and order tracking system designed to improve order management, ingredient availability, stock accuracy, and operational traceability.

The system connects customer orders with recipe-based ingredient reservations and actual inventory consumption.

### 1.1 Project Objectives

- Reduce duplicate and inconsistent order records.

- Improve restaurant inventory visibility.

- Track customer orders through the kitchen workflow.

- Reserve ingredients when orders are created.

- Deduct physical stock when preparation begins.

- Prevent duplicate inventory consumption.

- Maintain traceable order and inventory transactions.

### 1.2 Primary System Actors

| Actor | Main Responsibility |

|---|---|

| Waiter | Creates customer orders and tracks preparation status. |

| Chef | Views kitchen orders and updates preparation status. |

| Restaurant Manager | Monitors inventory, restaurant operations, and authorized stock adjustments. |

These application actors are different from the six development team members.

### 1.3 Sprint 1 Objective

The objective of Sprint 1 is to establish the project's requirements, system boundaries, API contract, team responsibilities, GitHub workflow, and initial Product Backlog.

Sprint 1 focuses on documentation, planning, and verifiable project evidence rather than full system implementation.

---

## 2. Team Roles and Responsibilities

| Team Member | Official Role | Corrected Sprint Scope |
|---|---|---|
| Burcu | Product Owner and Requirements Engineer | S1: Proje önerisi, açık kaynak lisans seçimi, sistem vizyonu ve sınırı, ilk backlog; hikâye ve kabul kriterleri sahipliği. |
| Bilgesu | Scrum Master and Agile Process Coach | S1: Rol atamaları ve RACI, GitHub organizasyonu, Git-Flow kuralları, proje board’u; süreç ve teslim koordinasyonu. |
| Ayşe | Lead Software Architect and Technical Lead | S1: Taslak OpenAPI YAML sözleşmesi. Mimari/C4/UML teslimleri S2; diyagram-kod uyumu S3. |
| Beyzanur | Quality Assurance and Test Automation Engineer | S1 için ayrı teslim yok. S2: Test planı ve kalite ölçütleri. S3: CI unit testleri ve en az %50 coverage. |
| Emre | DevOps and CI/CD Infrastructure Engineer | S1: Repo iskeleti ve Bilgesu ile branch koruma kuralları. S3: CI pipeline ve %50 coverage kapısı; Final: Docker ile çalışan ürün. |
| Tuğçe | Implementation and Integration Engineer | S1 için ayrı teslim yok. S2: Burcu ile Figma’ya göre UI iskeleti. S3: İlk çalışan MVP; Final: ana akış ve teknik doküman. |

### 2.1 Burcu - Product Owner and Requirements Engineer

Own requirements, stakeholder validation, prioritization, user stories, Given/When/Then acceptance criteria, story points and MoSCoW. S1 outputs: `docs/project-proposal.md`, license decision, `docs/system-vision.md` and `docs/product-backlog.md`. Define reservation-at-order and stock-deduction-at-Preparing behavior, MVP boundaries and excluded payments/accounting. S2: SRS, refined backlog, NFR/quality targets and Figma/user flows with Tuğçe.

### 2.2 Bilgesu - Scrum Master and Agile Process Coach

Own Agile communication, role assignments, RACI, GitHub organization, Git-Flow (main, develop, feature/*, release/*) and GitHub Projects/Jira board. Maintain stand-up/retro records, impediments, sprint planning and submission evidence. Own `docs/git-workflow.md` and the three coordination documents. Work with Emre on branch protection; preserve history and enforce issue/PR/test/diagram/deploy traceability.

### 2.3 Ayşe - Lead Software Architect and Technical Lead

Own `api/openapi.yaml` draft: /orders, /orders/{id}/status, /reservations, /inventory, /recipes; schemas, errors, atomicity and idempotency. General role: C4/UML, architecture decisions/ADR and code review leadership. C4/UML and DB schema are S2 outputs; diagram/code synchronization is S3, architecture defense is Final.

### 2.4 Beyzanur - Quality Assurance and Test Automation Engineer

Own QA, unit/integration/E2E automation, defect tracking and minimum 50 percent unit-test coverage monitoring. No distinct S1 delivery is assigned in the authoritative distribution. Test plan/quality criteria belong to S2; CI unit tests and coverage to S3; automated integration/E2E reporting and SonarQube remediation to Final. Backlog drafting is Burcu’s responsibility. QA consultation in S1 does not create a mandatory S1 test deliverable.

### 2.5 Emre - DevOps and CI/CD Infrastructure Engineer

Own infrastructure, configuration and deployment. S1: repository skeleton and branch protection with Bilgesu; implement agreed rules and maintain repo settings/templates with process ownership in Bilgesu. License selection remains Burcu’s. S3: GitHub Actions pipeline and 50 percent coverage gate. Final: Dockerfiles, docker-compose app/PostgreSQL/seed data, SonarQube and technical debt report. General role includes secrets, .env.example, persistence and backup/restore.

### 2.6 Tuğçe - Implementation and Integration Engineer

Own feature implementation, cross-component integration, API/UI coordination, integration defect resolution and technical documentation support. No distinct S1 delivery is assigned. S2: Figma-based UI skeleton with Burcu; S3: first working MVP; Final: reliable main flow and technical documentation. Implement waiter/chef screens, stock/recipe management, reservation logic and real-time kitchen updates in the relevant later scope. Update YAML before API code changes and use reviewed PRs. System vision/boundary is Burcu’s; C4/UML is Ayşe’s S2 work.

---

## 3. PantryChef Order and Inventory Workflow

### 3.1 Order State Lifecycle

The main order lifecycle is:

**Pending → Preparing → Ready**

Permitted cancellation branches: Pending → Cancelled; Preparing → Cancelled or Ready → Cancelled only when the requester has cancellation permission.

| State | Trigger | Inventory Behavior |

|---|---|---|

| Pending | Waiter creates an order | Ingredients are reserved; physical stock is unchanged. |

| Preparing | Chef starts preparation | Reserved ingredients are deducted from physical stock. |

| Ready | Chef completes preparation | Order status changes; no additional stock deduction. |

### 3.2 Inventory Definitions

**Physical Stock:** Actual quantity of an ingredient in inventory.

**Reserved Stock:** Quantity allocated to orders that have not started preparation.

**Available Stock:** Quantity that can be reserved for new orders.

**Formula:**

Available Stock = Physical Stock − Reserved Stock

### 3.3 Pending – Order Creation

1. The waiter creates a customer order.

2. The system identifies required ingredients from the associated recipes.

3. The system checks available stock.

4. If sufficient stock exists, ingredient quantities are reserved.

5. The order enters the Pending state.

6. Physical inventory remains unchanged.

If insufficient stock exists, the reservation must not be completed.

### 3.4 Pending – Order Cancellation

If a Pending order is cancelled:

1. Its ingredient reservations are identified.

2. Reserved quantities are released.

3. The order becomes Cancelled.

4. Available stock increases.

5. Physical stock remains unchanged.

Cancellation must not increase physical stock because the ingredients were never physically deducted.

### 3.5 Preparing – Physical Stock Deduction

When the chef selects Preparing:

1. The system verifies that the order is eligible for preparation.

2. Reserved ingredient quantities are identified.

3. Physical stock is reduced by the required quantities.

4. The corresponding reservations are cleared.

5. The order status becomes Preparing.

These operations must be atomic.

Repeated Preparing requests must not deduct inventory more than once.

### 3.6 Ready – Preparation Completed

When the chef selects Ready:

1. The order must already be in Preparing.

2. The order status becomes Ready.

3. No additional inventory deduction occurs.

### 3.7 MVP Workflow Boundary

The normal preparation workflow ends at Ready. Customer delivery and delivery-status tracking are outside the MVP. Authorized cancellation from Ready to Cancelled remains possible; Cancelled is terminal.

### 3.8 Authorized Cancellation After Preparing

Once preparation has started, ingredients have already been deducted. An authorized user may cancel an order in Preparing or Ready status, subject to server-side permission checks. The order becomes Cancelled and the cancellation actor, reason, and time must be recorded.

Therefore:

- Cancellation does not automatically restore physical stock.

- Previously cleared reservations are not released again.

- Cancellation must not trigger a second stock movement or reservation release.

- Any necessary stock correction must use an authorized, traceable manual adjustment process.

### 3.9 Recipe Version Consistency

Each order must retain the recipe version used when its ingredients were calculated.

Later changes to a recipe must not modify ingredient quantities already associated with existing orders.

### 3.10 Technical Consistency Rules

- Reservation and stock updates must be atomic.

- Repeated Preparing requests must be idempotent.

- Concurrent orders must not over-reserve ingredients.

- Insufficient stock must prevent reservation.

- Cancelled orders cannot proceed to Preparing or Ready.

- Only a permitted actor may cancel an order after Preparing; the cancellation must record who, when, and why.

- Ready requires Preparing.

- Inventory adjustments must be traceable.

- Recipe versions must remain consistent for existing orders.

### 3.11 Inventory Example

Assume the restaurant has 20 eggs and an order requires 5 eggs.

| Operation | Physical Stock | Reserved Stock | Available Stock |

|---|---:|---:|---:|

| Initial | 20 | 0 | 20 |

| Pending | 20 | 5 | 15 |

| Preparing | 15 | 0 | 15 |

| Ready | 15 | 0 | 15 |

If the order is cancelled during Pending:

| Operation | Physical Stock | Reserved Stock | Available Stock |

|---|---:|---:|---:|

| Initial | 20 | 0 | 20 |

| Pending | 20 | 5 | 15 |

| Cancelled | 20 | 0 | 20 |

## 4. RACI Matrix

### 4.1 RACI Definitions

| Symbol | Meaning | Description |

|---|---|---|

| R | Responsible | Performs the work. |

| A | Accountable | Has final ownership of the deliverable. |

| C | Consulted | Provides relevant input or expertise. |

| I | Informed | Receives updates. |

**RACI Rule:** Each major deliverable has one Accountable owner. The same person may be both Responsible and Accountable.

### 4.2 Sprint 1 RACI Matrix

| Task / Scope | Burcu | Bilgesu | Ayşe | Beyzanur | Emre | Tuğçe |

| --- | --- | --- | --- | --- | --- | --- |

| Project Proposal | A/R | I | C | C | I | C |

| Product Scope and MVP | A/R | I | C | C | I | C |

| Open-Source License Decision | A/R | I | C | I | C | C |

| System Vision and Boundary | A/R | C | C | I | C | I |

| Optional supporting context diagram (vision input) | A/R | C | C | I | C | I |

| Optional supporting state diagram (vision input) | A/R | C | C | I | C | I |

| OpenAPI YAML Contract | C | I | A/R | C | C | C |

| API Request/Response Schemas | C | I | A/R | C | I | C |

| API Error and Idempotency Rules | C | I | A/R | C | I | C |

| Team Roles and RACI Matrix | C | A/R | C | C | C | C |

| Sprint Meeting Notes | C | A/R | C | C | C | C |

| Sprint Task Tracking | C | A/R | C | C | C | C |

| Impediment and Decision Tracking | C | A/R | C | C | C | C |

| GitHub Repository Structure | I | C | C | I | A/R | I |

| GitHub Organization and Project Board | I | A/R | C | I | C | I |

| Git-Flow Documentation | I | A/R | C | I | C | I |

| Branch Protection | I | R | C | I | A/R | I |

| Issue and PR Templates | I | A/R | C | I | C | I |

| Initial Product Backlog | A/R | I | C | C | I | C |

| User Stories and Story Points | A/R | I | C | C | I | C |

| Acceptance Criteria | A/R | I | C | C | I | C |



| Cross-Document Workflow Review | C | A/R | C | C | C | C |

| Sprint 1 Tracking Evidence | C | A/R | C | C | C | C |

**Status:** Corrected on 5 November 2026 against the authoritative images. The original document recorded a 4 November review; that does not approve this corrected matrix. PR review remains unverified.

### 4.3 Responsibility Boundaries

| Team Member | Official Role | Corrected Sprint Scope |
|---|---|---|
| Burcu | Product Owner and Requirements Engineer | S1: Proje önerisi, açık kaynak lisans seçimi, sistem vizyonu ve sınırı, ilk backlog; hikâye ve kabul kriterleri sahipliği. |
| Bilgesu | Scrum Master and Agile Process Coach | S1: Rol atamaları ve RACI, GitHub organizasyonu, Git-Flow kuralları, proje board’u; süreç ve teslim koordinasyonu. |
| Ayşe | Lead Software Architect and Technical Lead | S1: Taslak OpenAPI YAML sözleşmesi. Mimari/C4/UML teslimleri S2; diyagram-kod uyumu S3. |
| Beyzanur | Quality Assurance and Test Automation Engineer | S1 için ayrı teslim yok. S2: Test planı ve kalite ölçütleri. S3: CI unit testleri ve en az %50 coverage. |
| Emre | DevOps and CI/CD Infrastructure Engineer | S1: Repo iskeleti ve Bilgesu ile branch koruma kuralları. S3: CI pipeline ve %50 coverage kapısı; Final: Docker ile çalışan ürün. |
| Tuğçe | Implementation and Integration Engineer | S1 için ayrı teslim yok. S2: Burcu ile Figma’ya göre UI iskeleti. S3: İlk çalışan MVP; Final: ana akış ve teknik doküman. |

RACI consultation/information entries are coordination choices; the images specify primary ownership, not a complete RACI. System context and state diagrams are supporting technical work, not independent S1 deliveries imposed on Tuğçe. Burcu owns S1 vision/boundary; Ayşe owns S2 C4/UML.

---

## 5. Scrum Process and Team Coordination

### 5.1 Sprint Planning

The Scrum Master coordinates planning activities with the team.

Planning includes:

- Reviewing Sprint 1 objectives.

- Confirming major deliverables.

- Identifying task dependencies.

- Confirming task ownership.

- Recording open questions.

- Tracking progress through GitHub Issues and the task board.

### 5.2 Task Tracking

Sprint 1 tasks should be traceable through GitHub Issues and Pull Requests.

Recommended task statuses:

- Backlog

- To Do

- In Progress

- In Review

- Done

Each task should include:

- Task title

- Assigned owner

- Sprint label

- Priority

- Current status

- Relevant Issue link

- Related Pull Request, if applicable

- Supporting evidence

The task board must reflect actual progress rather than assumed completion.

### 5.3 Stand-up Meetings

During stand-ups, team members communicate:

1. What has been completed?

2. What will be worked on next?

3. Are there any blockers?

The Scrum Master tracks unresolved impediments.

### 5.4 Decision Tracking

Important team decisions should include:

- Decision identifier

- Topic

- Decision description

- Participants or approvers

- Decision date

- Related document or Issue

- Current status

Proposed decisions must not be represented as approved before confirmation.

### 5.5 Impediment Management

Impediments should be recorded with:

- Description

- Date reported

- Responsible person

- Priority

- Planned action

- Resolution status

### 5.6 Sprint Review

The team reviews completed Sprint 1 deliverables and verifies that required evidence is available.

### 5.7 Sprint Retrospective

The team identifies:

- Successful practices

- Difficulties

- Improvement opportunities

- Action items for the next sprint

---

## 6. Sprint 1 Coordination and Dependencies

### 6.1 Main Dependencies

| Dependency | Coordination |

|---|---|

| Product Proposal → System Vision | Burcu |

| System Vision → OpenAPI | Burcu |

| Product Scope → Backlog | Burcu |

| Backlog → Test Cases | Burcu |

| GitHub Workflow → Team Contributions | Bilgesu |

| All Deliverables → RACI and Tracking | Bilgesu checks ownership and progress. |

### 6.2 Cross-Document Consistency

The Scrum Master coordinates verification that:

- The same actors are used across project documents.

- Order states follow Pending → Preparing → Ready.

- Ingredients are reserved during Pending.

- Pending cancellation releases reservations.

- Physical inventory is deducted when Preparing begins.

- Ready does not cause another stock deduction.

- Approved by the team on November 4, 2026: Cancellation of Preparing/Ready orders is permitted only for the Restaurant Manager or an explicitly authorized Waiter, subject to server-side permission checks. Cancellation does not automatically restore physical stock and must be recorded for audit.

- Duplicate Preparing requests cannot deduct inventory twice.

- Existing orders retain their original recipe version.

Technical correctness remains the responsibility of the relevant document owners.

---

## 7. Sprint 1 Deliverables and Evidence

### 7.1 Team Deliverables

| Owner | Deliverable | Expected Location |

|---|---|---|

| Burcu | Project Proposal | `docs/project-proposal.md` |

| Burcu | System Vision and Boundary (supporting diagrams reviewed separately) | `docs/system-vision.md` and diagrams |

| Ayşe | OpenAPI Draft | `api/openapi.yaml` |

| Bilgesu | GitHub organization, project board and Git-Flow | GitHub settings and `docs/git-workflow.md` |

| Bilgesu | Team Roles and RACI | `docs/team-roles-raci.md` |

| Bilgesu | Meeting records | `docs/sprint1-meeting-notes.md` |

| Bilgesu | Task tracking records | `docs/sprint1-task-board.md` |

| Bilgesu | GitHub repository skeleton | Repository and `docs/git-workflow.md` |

| Burcu | Product Backlog | `docs/product-backlog.md` |



### 7.2 GitHub Information

**Organization:** `seng321-7th-team`

**Repository:** https://github.com/seng321-7th-team/PantryChef

**Main Branch:** `main`

**Development Branch:** `develop`

**Documentation Branch:** `feature/raci-matrix`

**GitHub Projects Board:** URL pending verification

**Related Issues:** [Issue #14](https://github.com/seng321-7th-team/PantryChef/issues/14)

**Related Pull Requests:** [PR #3](https://github.com/seng321-7th-team/PantryChef/pull/3), [PR #15](https://github.com/seng321-7th-team/PantryChef/pull/15)

**Branch Protection:** Configuration pending verification

### 7.3 Sprint 1 Evidence Checklist

- [ ] Project Proposal reviewed

- [ ] System Vision and Boundary (supporting diagrams reviewed separately) reviewed

- [ ] OpenAPI YAML validated

- [ ] RACI Matrix approved

- [ ] Meeting records updated with actual information

- [ ] GitHub task board verified

- [ ] Git-Flow documentation reviewed

- [ ] Branch protection verified

- [ ] Initial Product Backlog reviewed

- Later-sprint QA follow-up: test plan in S2; test execution/automation in subsequent sprints (not an S1 completion gate).

- [ ] Inventory workflow consistent across documents

- [ ] Relevant Issues and Pull Requests linked

- [ ] Sprint 1 delivery evidence collected

---

## 8. Sprint 1 Example Schedule

The following is the proposed ten-working-day plan from the Sprint 1 task distribution.

| Days | Planned Activity |

|---|---|

| 1–2 | Align workflow, scope, and decisions |

| 3–5 | Prepare documentation and OpenAPI draft |

| 6–8 | Pull Request reviews, cross-checks, and corrections |

| 9–10 | Validation, tagging, and delivery |

This is a planned schedule, not a record of completed work.

---

## 9. Document Review and Approval

### 9.1 Review Responsibilities

- **Burcu:** Review product scope and stakeholder consistency.
- **Tuğçe:** Optional implementation/integration consultation in S1; own S2 UI skeleton, S3 MVP and Final integration/documentation.
- **Ayşe:** Review API-related workflow requirements.
- **Bilgesu:** Review RACI, task tracking, and meeting records.
- **Emre:** Review repository skeleton and branch safeguards with Bilgesu; Bilgesu reviews Git-Flow, organization and board.
- **Beyzanur:** Provide QA consultation; own S2 test planning and later test automation. Burcu owns backlog and acceptance criteria.

### 9.2 Approval Status

**Document Status:** Updated – Pending PR Review

**Team Review:** Conducted on November 4, 2026, with all six team members.

**RACI Approval:** The original meeting review refers to the previous matrix. The source correction is applied; approval of this version remains unverified.

**Last Verified Meeting:** November 4, 2026.

### 9.3 Maintenance Rules

- Update task assignments only after confirming changes with the team.

- Keep RACI ownership consistent with approved deliverables.

- Record changes through GitHub Issues or Pull Requests.

- Do not mark unverified tasks as completed.

- Maintain consistency with the current PantryChef order and inventory workflow.

---

**Prepared by:** Bilgesu Nacak

**Role:** Scrum Master and Agile Process Coach

**Project:** PantryChef – Team 7

**Sprint:** Sprint 1

## Correction and evidence interpretation

All legacy tasks, dependency notes and PR references must be read with the corrected ownership table above. S1 vision and backlog belong to Burcu; GitHub organization, Git-Flow and board belong to Bilgesu; repository skeleton and branch protection belong to Emre with Bilgesu. Beyzanur and Tuğçe retain their full project roles but have no separate required S1 delivery in the source image. Supporting diagrams and test ideas do not become S1 completion gates. Existing In Review statuses describe original submissions and require reassignment verification; they do not prove review by the corrected owner. Historical D-13 and any ownership approval claim conflicting with this correction are superseded.
