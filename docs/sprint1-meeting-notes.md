# PantryChef – Sprint 1 Meeting Notes & Decision Log

**Course:** BM 321 – Software Engineering
**Team:** 7 (6 members)
**Project:** PantryChef – Restaurant Inventory and Order Tracking System
**Sprint:** Sprint 1 – Project Foundation
**Document Owner:** Bilgesu Nacak
**Role:** Scrum Master and Agile Process Coach
**Document Status:** Updated 5 November 2026

## Role assignment - 5 November 2026

Role titles and Sprint 1 ownership follow the course role assignment (order: Burcu, Bilgesu, Ayşe, Beyzanur, Emre, Tuğçe). Sprint 1 is due at the end of Week 2 and is worth 15%.

---

## 1. Meeting Information

**Meeting Type:** Sprint 1 Planning / Project Coordination
**Date:** November 4, 2026
**Time:** 19:00 (Türkiye Time, UTC+3)
**Location / Platform:** WhatsApp (Online Meeting)
**Facilitator:** Bilgesu Nacak
**Attendees:** Burcu Ücük, Bilgesu Nacak, Ayşe Dural, Beyzanur Alpay, Emre Boz, Tuğçe Çevik

### Team Members and Sprint Scope

| Team Member | Official Role | Sprint Scope |
|---|---|---|
| Burcu | Product Owner and Requirements Engineer | S1: Project proposal, open-source license choice, system vision and boundary, initial backlog; owns user stories and acceptance criteria. |
| Bilgesu | Scrum Master and Agile Process Coach | S1: Role assignments and RACI, GitHub organization, Git-Flow rules, project board; process and submission coordination. |
| Ayşe | Lead Software Architect and Technical Lead | S1: Draft OpenAPI YAML contract. S2: architecture, C4 and UML deliverables; S3: diagram and code alignment. |
| Beyzanur | Quality Assurance and Test Automation Engineer | No separate S1 deliverable. S2: test plan and quality criteria. S3: CI unit tests with at least 50% coverage. |
| Emre | DevOps and CI/CD Infrastructure Engineer | S1: Repository skeleton and branch protection rules with Bilgesu. S3: CI pipeline and 50% coverage gate; Final: working product with Docker. |
| Tuğçe | Implementation and Integration Engineer | No separate S1 deliverable. S2: UI skeleton based on Figma with Burcu. S3: first working MVP; Final: main flow and technical documentation. |

**Attendance:** All six members attended the 4 November meeting.

---

## 2. Meeting Agenda

1. Review the PantryChef project objectives and MVP scope.
2. Confirm the six team members' responsibilities.
3. Review the RACI Matrix.
4. Discuss the order and inventory workflow.
5. Review Sprint 1 deliverables and dependencies.
6. Discuss GitHub Issues, Pull Requests, and Git-Flow.
7. Review the initial Product Backlog and test scenarios, including Product Owner approval of backlog priorities.
8. Identify open questions, risks, and impediments.
9. Agree on action items and next steps.

---

## 3. PantryChef Workflow for Team Review

The proposed order lifecycle is:

**Pending → Preparing → Ready**

### 3.1 Pending – Order Creation

- The waiter creates an order.
- Required ingredients are calculated from the applicable recipe version.
- Available stock is checked.
- Required ingredient quantities are reserved.
- Physical inventory is not deducted.

### 3.2 Pending – Cancellation

- The order is marked as Cancelled.
- Reserved ingredients are released.
- Available stock increases accordingly.
- Physical inventory remains unchanged.

### 3.3 Preparing – Preparation Starts

- The chef changes the order status to Preparing.
- Reserved ingredients are deducted from physical inventory.
- Corresponding reservations are cleared.
- Inventory and status updates must be atomic.
- Repeated Preparing requests must not deduct stock twice.

### 3.4 Ready – Preparation Completed

- The chef changes the status from Preparing to Ready.
- No additional physical stock deduction occurs.

### 3.5 MVP Workflow Boundary

- The normal preparation workflow ends at Ready.
- Customer delivery and delivery-status tracking are outside the MVP.
- Authorized cancellation from Ready to Cancelled remains possible; Cancelled is terminal.

### 3.6 Authorized Cancellation During Preparing or Ready

- **Approved role policy (November 4, 2026):** Restaurant Manager and explicitly authorized Waiter may cancel an order in Preparing or Ready. Server-side permission checks must reject unauthorized Waiters.
- The system must record the cancelling actor, cancellation reason, and timestamp for traceability.
- Previously consumed ingredients are not automatically returned to physical stock.
- Cleared reservations must not be released again; no duplicate reservation release is allowed.
- Any necessary inventory correction requires a separate authorized and traceable manual adjustment.
- These permission and audit rules were approved by the team on November 4, 2026, and must be reflected consistently in the system vision, API contract, backlog, and tests. Cross-document consistency remains pending verification.

### 3.7 Recipe Version and Concurrency

- Each order retains the recipe version used for its ingredient calculation.
- Later recipe changes must not alter existing orders.
- Concurrent requests must not over-reserve inventory.
- Insufficient stock must prevent reservation.

---

## 4. Sprint 1 Goal

Establish a consistent, reviewable, and traceable project foundation through:

- Project Proposal and MVP scope
- System Vision and Boundary (supporting diagrams reviewed separately)
- Initial OpenAPI YAML contract
- Team roles and RACI Matrix
- GitHub repository and Git-Flow
- Initial Product Backlog
- S2 Test Plan / Later Test Cases
- Sprint task tracking and coordination

---

## 5. Sprint 1 Task Assignments

| Task / Deliverable | Owner | Expected File / Evidence | Verification |
|---|---|---|---|
| Project Proposal | Burcu Ücük | `docs/project-proposal.md` | Pending |
| System Vision & Boundary | Burcu | `docs/system-vision.md` | Pending |
| Supporting System Context and Order State Diagrams (not a required separate S1 delivery) | Burcu | Diagram files | Pending |
| Initial OpenAPI YAML | Ayşe Dural | `api/openapi.yaml` | Pending |
| Team Roles and RACI Matrix | Bilgesu Nacak | `docs/team-roles-raci.md` | Draft prepared |
| Sprint 1 Task Tracking | Bilgesu Nacak | `docs/sprint1-task-board.md` | Draft prepared |
| Meeting Notes and Decision Tracking | Bilgesu Nacak | `docs/sprint1-meeting-notes.md` | Draft prepared |
| GitHub Repository Configuration | Emre | Repository settings | Pending |
| GitHub Organization and Project Board | Bilgesu | Organization and board settings | Pending |
| Branch Protection | Emre with Bilgesu | Repository safeguards | Pending |
| Git-Flow Documentation | Bilgesu | `docs/git-workflow.md` | Pending |
| Initial Product Backlog (prepared and owned by Burcu) | Burcu | `docs/product-backlog.md` | Pending |
| S2 Test Plan / Later Test Cases | Beyzanur Alpay | `docs/test-cases.md` | Outside required S1 scope |

Assignments follow the course role assignment.

---

## 6. Decision Log – Confirmed and Pending Items

| ID | Topic | Decision / Proposal | Status |
|---|---|---|---|
| D-01 | Order lifecycle | Pending → Preparing → Ready | Pending confirmation |
| D-02 | Ingredient reservation | Reserve ingredients during Pending without reducing physical stock | Pending confirmation |
| D-03 | Pending cancellation | Release reservations without increasing physical stock | Pending confirmation |
| D-04 | Preparing | Deduct physical stock and clear reservations atomically | Pending confirmation |
| D-05 | Duplicate requests | Prevent repeated stock deduction | Pending confirmation |
| D-06 | Ready | No further inventory deduction | Pending confirmation |
| D-07 | Recipe version | Preserve recipe version associated with each order | Pending confirmation |
| D-08 | Team responsibilities | Approve the Sprint 1 RACI Matrix | Pending confirmation |
| D-09 | GitHub workflow | Follow the DevOps Lead's Git-Flow documentation | Pending confirmation |
| D-10 | Task tracking | Track tasks using GitHub Issues and Projects | Pending confirmation |
| D-11 | Stock deduction timing revision | Rev 2 stated that physical stock would be deducted at Ready. The updated workflow specifies deduction when the order enters Preparing, while Ready causes no additional deduction. | Revision documented; team confirmation pending |
| D-12 | Authorized cancellation in Preparing / Ready | Restaurant Manager and explicitly authorized Waiter may cancel Preparing or Ready orders after server-side permission checks; record actor, reason, and timestamp; do not automatically restore consumed stock or release cleared reservations again. | Approved by team on November 4, 2026; cross-document verification pending |
| D-13 | Historical backlog RACI - superseded | Original record assigned drafting to Beyzanur and approval to Burcu. Corrected ownership: Burcu A/R; Beyzanur QA consultation only. | Superseded by the role correction on 5 November 2026 |

Decision D-12 was approved by the team on November 4, 2026. Decision D-13 was reviewed by the team, with PR #15 review pending. All other decisions remain pending confirmation unless explicitly documented otherwise.

---

## 7. Action Items

| Action | Owner | Due Date | Status |
|---|---|---|---|
| Review Project Proposal | Burcu | TBD | Pending |
| Review S1 System Vision and Boundary; coordinate API alignment with Ayşe | Burcu | TBD | Pending |
| Validate OpenAPI YAML | Ayşe | TBD | Pending |
| Review and approve RACI Matrix | Bilgesu / Team | TBD | Pending |
| Verify GitHub organization/Git-Flow/board and repo/branch safeguards | Bilgesu (process); Emre (repo) | TBD | Pending |
| Prepare S1 backlog, stories and acceptance criteria; consult QA for later test planning | Burcu (A/R); Beyzanur (C) | TBD | Pending |
| Verify the approved Manager / authorized Waiter Preparing/Ready cancellation policy and audit records across System Vision, OpenAPI, backlog, and test cases | Burcu | TBD | Pending verification |
| Collect Sprint 1 evidence | Bilgesu | TBD | Pending |

Due dates and statuses must be updated using actual team agreements.

---

## 8. Risks and Impediments

### 8.1 Potential Risks

| ID | Risk | Owner | Follow-up |
|---|---|---|---|
| R-01 | Inconsistent workflow descriptions | Bilgesu | Coordinate document review |
| R-02 | API and state diagram mismatch | Ayşe / Burcu | Compare contract and diagrams |
| R-03 | Missing stock edge-case, cancellation-permission, and audit tests | Beyzanur | Review test scenarios |
| R-04 | GitHub protection rules | Emre | Rulesets active for main, develop and release tags |

These are potential risks and not confirmed blockers.

### 8.2 Confirmed Impediments

No confirmed impediments have been recorded in this document.

New impediments should include their reported date, owner, priority, next action, and resolution status.

---

## 9. Meeting Outcomes

**Meeting Summary:** On November 4, 2026, all six team members attended the Sprint 1 coordination meeting. The team reviewed the then-recorded Sprint 1 responsibilities and RACI Matrix (subsequently corrected on 5 November 2026), and approved the Preparing/Ready cancellation policy for Restaurant Manager and explicitly authorized Waiter. Cross-document verification and PR #15 review remain pending.

**Confirmed Decisions:** D-12 – On November 4, 2026, the team approved cancellation of Preparing/Ready orders by Restaurant Manager or explicitly authorized Waiter, subject to server-side permission checks and audit logging. Consumed stock must not be automatically restored, and cleared reservations must not be released again. Other decisions remain pending confirmation unless explicitly documented otherwise.

**Attendance:** All six team members attended the November 4, 2026 meeting: Burcu Ücük, Bilgesu Nacak, Ayşe Dural, Beyzanur Alpay, Emre Boz, Tuğçe Çevik.

**Unresolved Questions:** Team confirmation of decisions D-01 through D-11; completion of PR #15 review for D-13; verification of the approved D-12 cancellation policy across System Vision, OpenAPI, Product Backlog, and Test Cases; confirmation of remaining Sprint 1 deliverables and deadlines.

**Next Meeting:** To be confirmed.

Do not mark proposed decisions as approved before team confirmation.

---

## 10. GitHub References and Evidence

**Organization:** `seng321-7th-team`

**Repository:** https://github.com/seng321-7th-team/PantryChef

**Sprint 1 Task Board:** [PantryChef Sprint 1 project](https://github.com/orgs/seng321-7th-team/projects/4)

**Related Issues:** [Issue #1](https://github.com/seng321-7th-team/PantryChef/issues/1) – Repository structure; [Issue #2](https://github.com/seng321-7th-team/PantryChef/issues/2) – Git-Flow documentation; [Issue #3](https://github.com/seng321-7th-team/PantryChef/issues/3) – Issue / PR templates; [Issue #4](https://github.com/seng321-7th-team/PantryChef/issues/4) – Branch protection.

**Related Pull Requests:** [PR #15](https://github.com/seng321-7th-team/PantryChef/pull/15) – Team Roles & RACI; [PR #8](https://github.com/seng321-7th-team/PantryChef/pull/8) – Git-Flow; [PR #9](https://github.com/seng321-7th-team/PantryChef/pull/9) – Issue / PR Templates; [PR #12](https://github.com/seng321-7th-team/PantryChef/pull/12) – Project Proposal; [PR #16](https://github.com/seng321-7th-team/PantryChef/pull/16) – System Vision; [PR #17](https://github.com/seng321-7th-team/PantryChef/pull/17) – Product Backlog.

**Meeting Evidence:** The November 4, 2026 meeting was held via WhatsApp at 19:00 (Türkiye Time, UTC+3). Meeting outcomes and attendance are documented in Section 9. Supporting evidence (WhatsApp chat records or attendance confirmation) is pending collection and verification.

---

## 11. Follow-up Procedure

After each Sprint 1 meeting:

1. Record the actual date and participants.
2. Document confirmed decisions.
3. Update task owners and deadlines.
4. Record new risks and impediments, including verification of approved cancellation permissions and pending backlog approvals.
5. Update the GitHub Projects Board.
6. Link relevant Issues and Pull Requests.
7. Communicate unresolved items to the team.

---

**Prepared by:** Bilgesu Nacak
**Role:** Scrum Master and Agile Process Coach
**Sprint:** Sprint 1

## Notes

Ownership in this document follows the table above. S1 vision and backlog belong to Burcu; GitHub organization, Git-Flow and board belong to Bilgesu; repository skeleton and branch protection belong to Emre with Bilgesu. Beyzanur and Tuğçe retain their full project roles but have no separate required S1 delivery in the course role assignment. Supporting diagrams and test ideas do not become S1 completion gates. D-13 is superseded by this table.
