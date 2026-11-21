# PantryChef — Sprint 2 RACI Matrix

**Course:** BM321 — Software Engineering  
**Team:** 7  
**Sprint:** Sprint 2 — Requirements & Architecture  
**Deadline:** 24 November 2026, 23:59 (Türkiye time)  
**Document owner:** Bilgesu Nacak (Scrum Master)  
**Related issue:** [S2-07 — #40](https://github.com/seng321-7th-team/PantryChef/issues/40)  
**Task board:** `docs/sprint2-task-board.md`  
**Reference:** `docs/team-roles-raci.md`

## 1. Purpose and scope

This matrix identifies decision ownership, execution responsibility, consultation, and communication for all 37 Sprint 2 tasks. It complements the task board; it does not replace the individual GitHub issue assignees or Pull Request reviewers. The assignments follow the approved Sprint 2 task distribution and retain the Sprint 1 team roles.

## 2. Team roles

| Code | Team member | Sprint role |
| --- | --- | --- |
| BU | Burcu Ücük | Product Owner & Requirements Engineer |
| BN | Bilgesu Nacak | Scrum Master & Agile Process Coach |
| AD | Ayşe Dural | Lead Software Architect & Technical Lead |
| BA | Beyzanur Alpay | QA & Test Automation Engineer |
| EB | Emre Boz | DevOps & CI/CD Infrastructure Engineer |
| TC | Tuğçe Çevik | Implementation & Integration Engineer |

## 3. RACI rules

- **R — Responsible:** Performs the work and prepares the deliverable. Multiple people may be R if work is shared.
- **A — Accountable:** Ultimately owns the activity's outcome and confirms its completion. **Exactly one A** is assigned per activity.
- **C — Consulted:** Provides review or specialist input before completion. Communication is two-way.
- **I — Informed:** Receives progress or completion information. Communication is primarily one-way.
- **R/A:** A single person can both perform and own an activity.
- **—:** No formal RACI assignment for the activity. Everyone may still participate in normal sprint communication.

For this sprint, the agreed task owner is **R/A** for each row and the agreed peer reviewer is **C**. GitHub Pull Request approval remains a separate, required step. The owner must not approve their own Pull Request. For the confidential peer-evaluation task S2-37, all team members contribute; Bilgesu coordinates it without publishing individual ratings.

## 4. Sprint 2 RACI matrix

| Task ID | Activity / deliverable | BU | BN | AD | BA | EB | TC | Peer reviewer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S2-01 | Detailed Software Requirements Specification (SRS) | R/A | I | C | — | — | — | Ayşe |
| S2-02 | Refined Product Backlog, User Stories and Acceptance Criteria | R/A | I | — | C | — | — | Beyzanur |
| S2-03 | Functional and Non-functional Requirements | R/A | I | — | C | — | — | Beyzanur |
| S2-04 | Review Figma designs against requirements | R/A | I | — | — | — | C | Tuğçe |
| S2-05 | MVP Scope and Out-of-Scope Definition | R/A | C | — | — | — | — | Bilgesu |
| S2-06 | Sprint 2 Task Board creation and maintenance | C | R/A | I | — | — | — | Burcu |
| S2-07 | Sprint 2 RACI Matrix | I | R/A | — | — | — | C | Tuğçe |
| S2-08 | Sprint Planning, Stand-up, Review and Retrospective records | I | R/A | — | — | — | C | Tuğçe |
| S2-09 | GitHub Issues, PR Tracking and Impediment Log | I | R/A | — | — | C | — | Emre |
| S2-10 | Sprint 2 Deliverables Consistency Review | I | R/A | — | C | — | — | Beyzanur |
| S2-11 | Sprint 2 Submission Package and Teams Upload | C | R/A | I | I | I | I | Burcu |
| S2-12 | C4 System Context Diagram | I | I | R/A | — | C | — | Emre |
| S2-13 | C4 Container Diagram | — | I | R/A | — | C | — | Emre |
| S2-14 | UML Use Case, Class and Sequence Diagrams | — | I | R/A | — | — | C | Tuğçe |
| S2-15 | ER Diagram and Database Schema | — | I | R/A | — | C | — | Emre |
| S2-16 | Architecture Decision Records (ADR) | — | I | R/A | — | C | — | Emre |
| S2-17 | Architecture–SRS–OpenAPI Consistency Review | C | I | R/A | — | — | — | Burcu |
| S2-18 | Software Test Plan | C | I | — | R/A | — | — | Burcu |
| S2-19 | Quality Metrics and NFR Verification Criteria | — | I | — | R/A | C | — | Emre |
| S2-20 | Unit, Integration and E2E Test Scenarios | — | I | C | R/A | — | — | Ayşe |
| S2-21 | Stock Reservation, Cancellation and Idempotency Test Cases | — | I | C | R/A | — | — | Ayşe |
| S2-22 | Requirements–Test Traceability Matrix | C | I | — | R/A | — | — | Burcu |
| S2-23 | Infrastructure and Deployment Requirements | — | I | C | — | R/A | — | Ayşe |
| S2-24 | C4 Container Architecture Technical Review | — | I | C | — | R/A | — | Ayşe |
| S2-25 | Performance, Security and Backup NFR Support | — | I | — | C | R/A | — | Beyzanur |
| S2-26 | Repository Rules and Branch Protection Verification | — | C | — | — | R/A | — | Bilgesu |
| S2-27 | Sprint 3 CI/CD and Docker Readiness Documentation | — | I | C | — | R/A | — | Ayşe |
| S2-28 | Figma UI/UX Prototype Design | C | I | — | — | — | R/A | Burcu |
| S2-29 | Waiter, Chef and Manager Screen Designs | C | I | — | — | — | R/A | Burcu |
| S2-30 | User-flow Diagrams | — | I | C | — | — | R/A | Ayşe |
| S2-31 | UI Design–User Story Consistency Review | C | I | — | — | — | R/A | Burcu |
| S2-32 | Frontend UI Skeleton (stretch goal) | — | I | C | — | — | R/A | Bilgesu |
| S2-33 | Figma Links and UI Documentation | — | C | — | — | — | R/A | Bilgesu |
| S2-34 | C4 Component Diagram | — | I | R/A | — | C | — | Emre |
| S2-35 | UML State Diagram | — | I | R/A | C | — | — | Beyzanur |
| S2-36 | Sprint 2 Git Tag, GitHub Release and README Links | — | C | — | — | R/A | — | Bilgesu |
| S2-37 | Sprint 2 Peer Evaluation and Contribution Assessment | R | R/A | R | R | R | R | All team members |

**Reviewer change (21 Nov 2026):** The PR reviewer of S2-32 (PR #101) changed from Ayşe to Bilgesu. Only the peer reviewer column changed; the RACI letters of S2-32 stay as they were.

## 5. Coordination and approval

1. The **Responsible/Accountable** owner creates or updates the appropriate issue, maintains evidence, and produces the deliverable on a `feature/*` branch.
2. The named **Consulted** reviewer verifies correctness and consistency through a Pull Request targeting `develop`. Reviewer approval does not transfer accountability away from the task owner.
3. Bilgesu monitors task and issue status, PR review progress, blockers, and documentation links in the Sprint 2 Task Board.
4. Burcu confirms requirements and deliverable scope as Product Owner. Ayşe coordinates architectural consistency; Beyzanur coordinates validation and measurable quality; Emre checks repository and infrastructure constraints; Tuğçe coordinates UI/UX and integration artifacts.
5. Once review requirements are met, the Pull Request can be merged according to repository protection rules. Issue closure and Project Board status must reflect the actual merged evidence.

## 6. Cross-deliverable consistency checks

- Detailed SRS and refined backlog must use consistent actor names, business rules, and acceptance criteria.
- Figma prototypes and user flows must cover Manager, Waiter, and Chef/Kitchen Staff journeys.
- C4 and UML diagrams must agree with SRS boundaries and the API design.
- Stock reservation reduces **available stock**; transitioning an order to **Preparing** decreases physical stock **exactly once**; transitioning to **Ready** causes no second deduction. Related QA scenarios must verify atomicity and idempotency.
- NFR targets must be measurable and traceable to corresponding validation criteria.
- GitHub issues, task IDs, PRs, reviewer approvals, release/tag details, and document links must be included in submission evidence.

## 7. Evidence and references

- [PantryChef repository](https://github.com/seng321-7th-team/PantryChef)
- [Existing GitHub Project Board](https://github.com/orgs/seng321-7th-team/projects/4)
- [S2-07 issue #40](https://github.com/seng321-7th-team/PantryChef/issues/40)
- `docs/sprint2-task-board.md` — Sprint 2 issue/task tracking
- `docs/team-roles-raci.md` — Sprint 1 team roles and RACI reference
- `docs/sprint2-raci.md` — This matrix

**Document status:** Prepared for peer review. Update this matrix if approved task ownership or review assignments change; do not mark completion before PR approval and merge.


## 8. Current Review Assignments and Evidence — November 21, 2026

| Task | Current responsibility and review evidence |
|---|---|
| S2-07 — Sprint 2 RACI Matrix | Bilgesu remains R/A. Tuğçe approved [#41](https://github.com/seng321-7th-team/PantryChef/pull/41), which merged into develop. [#40](https://github.com/seng321-7th-team/PantryChef/issues/40) is Closed / Done. |
| S2-32 — Frontend UI Skeleton | Tuğçe remains R/A. Bilgesu took over as the consulted peer reviewer on November 21 and formally approved [#101](https://github.com/seng321-7th-team/PantryChef/pull/101). [#100](https://github.com/seng321-7th-team/PantryChef/issues/100) remains open / In Progress, with merge pending. |

The [current task register](sprint2-task-board.md#9-current-status-and-evidence-register--november-21-2026) links the Issues, PRs and recorded approvals for the sprint. Delivery PRs target develop. The Sprint 2 release PR [#96](https://github.com/seng321-7th-team/PantryChef/pull/96) targets main.
