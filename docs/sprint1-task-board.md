# PantryChef – Sprint 1 Task Board & Progress Tracking

**Course:** BM 321 – Software Engineering
**Team:** 7 (team identifier; 6 members)
**Project:** PantryChef – Restaurant Inventory and Order Tracking System
**Sprint:** Sprint 1 – Project Foundation
**Document Owner:** Bilgesu Nacak
**Role:** Scrum Master and Agile Process Coach
**Document Status:** Draft – Pending Team Verification

## Source authority and correction - 5 November 2026

Role titles and the fixed six-person order follow `gorev_nedim.png`: Burcu, Bilgesu, Ayşe, Beyzanur, Emre, Tuğçe. No seventh-person exception or instructor confirmation is required for this mapping. Sprint delivery ownership follows `gorev_paylastirilmis.jpeg` (the supplied file referred to as .jpg in the request). `sprint1.png` establishes Sprint 1 at the end of Week 2, worth 15%.

This is a document correction requested by the user, not a new team meeting or approval. Existing meeting facts, technical policies, PR references and progress claims are retained as historical/unverified records. A PR's original author does not establish the corrected owner. No GitHub changes or live verification were performed.

---

## 1. Sprint 1 Overview

Sprint 1 focuses on establishing the project foundation, including the project proposal, system vision, initial API contract, team responsibilities, GitHub workflow, product backlog, and test cases.

**Sprint Goal:** Establish a consistent, documented, and traceable foundation for the PantryChef project.

The Sprint 1 task board is maintained by the Scrum Master to monitor progress, ownership, dependencies, and delivery evidence.

---

## 2. Corrected Team Responsibilities

| Team Member | Official Role | Corrected Sprint Scope |
|---|---|---|
| Burcu | Product Owner and Requirements Engineer | S1: Proje önerisi, açık kaynak lisans seçimi, sistem vizyonu ve sınırı, ilk backlog; hikâye ve kabul kriterleri sahipliği. |
| Bilgesu | Scrum Master and Agile Process Coach | S1: Rol atamaları ve RACI, GitHub organizasyonu, Git-Flow kuralları, proje board’u; süreç ve teslim koordinasyonu. |
| Ayşe | Lead Software Architect and Technical Lead | S1: Taslak OpenAPI YAML sözleşmesi. Mimari/C4/UML teslimleri S2; diyagram-kod uyumu S3. |
| Beyzanur | Quality Assurance and Test Automation Engineer | S1 için ayrı teslim yok. S2: Test planı ve kalite ölçütleri. S3: CI unit testleri ve en az %50 coverage. |
| Emre | DevOps and CI/CD Infrastructure Engineer | S1: Repo iskeleti ve Bilgesu ile branch koruma kuralları. S3: CI pipeline ve %50 coverage kapısı; Final: Docker ile çalışan ürün. |
| Tuğçe | Implementation and Integration Engineer | S1 için ayrı teslim yok. S2: Burcu ile Figma’ya göre UI iskeleti. S3: İlk çalışan MVP; Final: ana akış ve teknik doküman. |

---

## 3. Task Status Definitions

| Status | Description |
|---|---|
| Backlog | Identified but not yet selected for active work |
| To Do | Selected and ready to start |
| In Progress | Currently being worked on |
| In Review | Submitted for review or verification |
| Done | Completed and verified against acceptance criteria |

Task status must reflect actual GitHub Issues, Pull Requests, and team confirmations.

---

## 4. Sprint 1 Task Board

The following tasks are planned according to the Sprint 1 team responsibility distribution.

| Task ID | Task | Owner | Expected Deliverable | Status |
|---|---|---|---|---|
| S1-01 | Prepare Project Proposal | Burcu | `docs/project-proposal.md` | To Do |
| S1-02 | Define MVP scope, stakeholders, and risks | Burcu | Project Proposal sections | To Do |
| S1-03 | Select and justify open-source license | Burcu | License decision | To Do |
| S1-04 | Prepare System Vision & Boundary | Burcu | `docs/system-vision.md` ([PR #15](https://github.com/seng321-7th-team/PantryChef/pull/15)) | In Review |
| S1-05 | Supporting diagram work - not an independent required S1 delivery | Burcu (vision); Ayşe (technical consultation) | System context diagram ([PR #15](https://github.com/seng321-7th-team/PantryChef/pull/15)) | Optional supporting work; existing PR reference unverified |
| S1-06 | Supporting diagram work - not an independent required S1 delivery | Burcu (vision); Ayşe (technical consultation) | Order lifecycle diagram ([PR #15](https://github.com/seng321-7th-team/PantryChef/pull/15)) | Optional supporting work; existing PR reference unverified |
| S1-07 | Document reservation and approved cancellation rules, including Manager / authorized Waiter permission | Burcu | System Vision workflow and state diagram ([PR #15](https://github.com/seng321-7th-team/PantryChef/pull/15)) | In Review |
| S1-08 | Prepare initial OpenAPI YAML | Ayşe | `api/openapi.yaml` | To Do |
| S1-09 | Define order, inventory, and recipe API operations | Ayşe | API paths and schemas | To Do |
| S1-10 | Define API errors, idempotency, and approved Manager / authorized Waiter cancellation checks (403/409) | Ayşe | API responses, permissions, and rules | To Do |
| S1-11 | Prepare team roles and RACI Matrix | Bilgesu | `docs/team-roles-raci.md` ([PR #3](https://github.com/seng321-7th-team/PantryChef/pull/3)) | In Review |
| S1-12 | Maintain meeting notes and decisions | Bilgesu | `docs/sprint1-meeting-notes.md` | In Progress |
| S1-13 | Track Sprint 1 tasks and impediments | Bilgesu | `docs/sprint1-task-board.md` | In Progress |
| S1-14 | Coordinate workflow consistency review | Bilgesu | Review records | To Do |
| S1-15 | Configure GitHub repository structure | Emre | GitHub repository | To Do |
| S1-16 | Prepare Git-Flow documentation; under review in [PR #6](https://github.com/seng321-7th-team/PantryChef/pull/6), linked to [Issue #5](https://github.com/seng321-7th-team/PantryChef/issues/5) | Bilgesu | `docs/git-workflow.md` | In Review |
| S1-17 | Prepare Issue/PR templates (under review in [PR #7](https://github.com/seng321-7th-team/PantryChef/pull/7)); final branch protection verification pending | Bilgesu (process); Emre (settings/implementation) | GitHub settings and templates | In Review |
| S1-18 | Prepare initial Product Backlog and priorities | Burcu | `docs/product-backlog.md` | To Do |
| S1-19 | Draft user stories, story points, and measurable acceptance criteria | Burcu | `docs/product-backlog.md` | To Do |
| S1-20 (deferred) | Later QA scope: Prepare later-sprint test cases | Beyzanur | `docs/test-cases.md` | Outside required S1 scope; S2 plan / later tests |
| S1-21 (deferred) | Later QA scope: Review recipe-version, concurrency, and authorized cancellation test scenarios | Beyzanur | `docs/test-cases.md` | Outside required S1 scope; S2 plan / later tests |
| S1-22 | Review Sprint 1 deliverables | All team members | Review evidence | To Do |
| S1-23 | Collect Sprint 1 submission evidence | Bilgesu | Issue, PR, and document links | To Do |
| S1-24 | Review and approve Product Backlog priorities and acceptance criteria | Burcu (A/R); Beyzanur (C) | Review record / approved backlog | To Do |
| S1-25 | Specify approved Manager / authorized Waiter cancellation policy, actor, reason, timestamp, and server-side checks | Ayşe (API); Burcu (vision) | `api/openapi.yaml`; `docs/system-vision.md` | To Do |
| S1-26 (deferred) | Later QA scope: Define test cases for approved Restaurant Manager / authorized Waiter cancellation, including unauthorized access, duplicate cancellation, and no automatic stock restoration | Beyzanur | `docs/test-cases.md` | Outside required S1 scope; S2 plan / later tests |

| S1-27 | Set up GitHub organization and project board | Bilgesu | Organization and Projects/Jira board | To verify |
| S1-28 | Configure branch protection with Scrum Master | Emre (A/R); Bilgesu (R) | Repository branch rules | To verify |

**RACI clarification:** Burcu is A/R for backlog, stories, story points and acceptance criteria. Bilgesu owns GitHub organization/Git-Flow/board; Emre owns repo skeleton and branch protection with Bilgesu. QA and implementation deliveries follow S2/S3/Final timing.

**Important:** Task statuses are preliminary planning values and must be updated after verification. The table does not claim that other team members have not started their work.

---

## 5. PantryChef Workflow Consistency Checklist

All relevant project documents should follow the same workflow:

**Pending → Preparing → Ready → Delivered**

- [ ] Order creation reserves ingredients according to the associated recipe.
- [ ] Physical stock remains unchanged during Pending.
- [ ] Available stock equals physical stock minus reserved stock.
- [ ] Pending cancellation releases ingredient reservations.
- [ ] Pending cancellation does not increase physical stock.
- [ ] Preparing deducts physical stock and clears reservations atomically.
- [ ] Repeated Preparing requests do not deduct stock twice.
- [ ] Ready changes the order status without additional deduction.
- [ ] Delivered records delivery without additional deduction.
- [ ] Approved by the team on November 4, 2026: Restaurant Manager or explicitly authorized Waiter may cancel Preparing or Ready orders after server-side permission checks; unauthorized Waiters may not.
- [ ] Such cancellation records the actor, reason, and timestamp and changes the order status to Cancelled.
- [ ] Cancellation after Preparing or Ready does not automatically restore physical stock or release already-cleared reservations.
- [ ] Delivered orders cannot use the ordinary cancellation workflow.
- [ ] Cancelled orders cannot proceed to Preparing, Ready, or Delivered.
- [ ] Unauthorized cancellation and conflicting requests return appropriate API errors (including 403/409).
- [ ] Insufficient stock prevents reservation.
- [ ] Concurrent orders cannot over-reserve ingredients.
- [ ] Existing orders retain the recipe version used at order creation.

---

## 6. Task Dependencies

| Dependency | Responsible Members | Purpose |
|---|---|---|
| Project Proposal → System Vision | Burcu | Align scope and system boundaries |
| System Vision → OpenAPI | Burcu, Ayşe | Align state transitions and API operations |
| Product Scope → Product Backlog | Burcu (A/R), Beyzanur (C) | Burcu prepares and approves the backlog; QA consultation is optional |
| Product Backlog → Test Cases | Burcu | Derive verifiable test scenarios |
| Repository Setup → Pull Requests | Emre, all members | Enable traceable contributions |
| Team Deliverables → Sprint Tracking | Bilgesu, all members | Verify ownership, progress, and evidence |

---

## 7. GitHub Task Tracking

**GitHub Organization:** `seng321-7th-team`

**Repository:** https://github.com/seng321-7th-team/PantryChef

**Main Branch:** `main`

**Development Branch:** `develop`

**Scrum Documentation Branch:** `feature/raci-matrix`

**GitHub Projects Board:** URL pending verification

**Sprint 1 Milestone:** Pending verification

### 7.1 Issue Tracking Template

Each GitHub Issue should contain:

- Task ID and title
- Assigned team member
- Sprint label
- Priority
- Description
- Acceptance criteria
- Related document or API path
- Relevant Pull Request
- Current status

### 7.2 Evidence Tracking

| Evidence | Reference | Verification |
|---|---|---|
| GitHub Projects Board | URL pending | Pending |
| Sprint 1 Issues | [Issue #5](https://github.com/seng321-7th-team/PantryChef/issues/5); [Issue #14](https://github.com/seng321-7th-team/PantryChef/issues/14) | Linked; completion pending verification |
| Pull Requests | [PR #3](https://github.com/seng321-7th-team/PantryChef/pull/3); [PR #6](https://github.com/seng321-7th-team/PantryChef/pull/6); [PR #7](https://github.com/seng321-7th-team/PantryChef/pull/7); [PR #15](https://github.com/seng321-7th-team/PantryChef/pull/15) | Linked; reviews pending |
| Team document reviews | Records pending | Pending |
| Sprint 1 meeting notes | `docs/sprint1-meeting-notes.md` | Draft |
| Sprint 1 RACI Matrix | `docs/team-roles-raci.md` ([PR #3](https://github.com/seng321-7th-team/PantryChef/pull/3)) | In Review |

---

## 8. Risks and Impediments

| ID | Risk / Impediment | Owner | Status |
|---|---|---|---|
| R-01 | Differences between workflow descriptions across documents | Bilgesu coordinates review | Monitoring |
| R-02 | API contract may not fully match system states | Ayşe and Burcu | To verify |
| R-03 | Backlog acceptance criteria may not cover stock edge cases or authorized cancellation | Burcu | To verify |
| R-04 | GitHub branch protection may not be fully configured | Emre | To verify |

These entries are potential risks, not confirmed active blockers.

---

## 9. Sprint 1 Completion Criteria

Sprint 1 documentation and tracking can be considered ready for submission when:

- [ ] Project Proposal is reviewed.
- [ ] System Vision and Boundary (supporting diagrams reviewed separately) are reviewed.
- [ ] OpenAPI YAML is validated.
- [ ] Team roles and RACI Matrix are reviewed.
- [ ] Meeting records contain actual decisions and dates.
- [ ] GitHub repository and Git-Flow rules are verified.
- [ ] Branch protection and PR review settings are verified.
- [ ] Initial Product Backlog priorities, stories, and acceptance criteria are reviewed with Burcu as Accountable.
- [ ] The Manager / authorized Waiter Preparing/Ready cancellation policy and audit fields were approved by the team on November 4, 2026; consistency across System Vision, OpenAPI, and test cases remains to be verified.
- Later-sprint QA follow-up: test plan in S2; test execution/automation in subsequent sprints (not an S1 completion gate).
- [ ] Workflow rules are consistent across deliverables.
- [ ] Task statuses reflect actual progress.
- [ ] Relevant GitHub Issues and PRs are linked.
- [ ] Sprint 1 submission evidence is collected.

---

## 10. Scrum Master Follow-up

The Scrum Master should:

1. Confirm task ownership with each team member.
2. Verify task progress through GitHub Issues and PRs.
3. Update statuses after receiving evidence.
4. Record blockers and decisions.
5. Coordinate cross-document consistency checks.
6. Collect links required for Sprint 1 submission.

**Prepared by:** Bilgesu Nacak
**Role:** Scrum Master and Agile Process Coach
**Sprint:** Sprint 1

## Correction and evidence interpretation

All legacy tasks, dependency notes and PR references must be read with the corrected ownership table above. S1 vision and backlog belong to Burcu; GitHub organization, Git-Flow and board belong to Bilgesu; repository skeleton and branch protection belong to Emre with Bilgesu. Beyzanur and Tuğçe retain their full project roles but have no separate required S1 delivery in the source image. Supporting diagrams and test ideas do not become S1 completion gates. Existing In Review statuses describe original submissions and require reassignment verification; they do not prove review by the corrected owner. Historical D-13 and any ownership approval claim conflicting with this correction are superseded.
