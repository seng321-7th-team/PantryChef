# PantryChef — Sprint 2 Meeting Notes

**Course:** BM321 — Software Engineering  
**Team:** 7 (six members)  
**Sprint:** Sprint 2 — Requirements & Architecture  
**Deadline:** November 24, 2026, 23:59 (Türkiye time)  
**Scrum Master / record owner:** Bilgesu Nacak  
**Document status:** In progress — living meeting record  
**Related issue:** [S2-08 — #42](https://github.com/seng321-7th-team/PantryChef/issues/42)  
**Reference:** `docs/sprint1-meeting-notes.md`

> **Record-keeping principle:** Only meetings, decisions, attendance, and outcomes actually confirmed by the team are documented as completed. Planned or unconfirmed activities remain **Pending** until verified. Update this file throughout the sprint rather than filling in future results in advance.

## 1. Sprint goal

Complete the Sprint 2 Requirements & Architecture deliverables for PantryChef:

1. Detailed Software Requirements Specification (SRS) and refined Product Backlog.
2. Measurable non-functional requirements (NFRs) and quality metrics.
3. Figma UI/UX prototypes and user-flow diagrams.
4. Software architecture documentation, including C4 and UML diagrams.

Evidence will be organized through task IDs, GitHub Issues, Pull Requests, review approvals, and the existing GitHub Project Board.

## 2. Team and roles

| Member | Role |
| --- | --- |
| Burcu Ücük | Product Owner & Requirements Engineer |
| Bilgesu Nacak | Scrum Master & Agile Process Coach |
| Ayşe Dural | Lead Software Architect & Technical Lead |
| Beyzanur Alpay | QA & Test Automation Engineer |
| Emre Boz | DevOps & CI/CD Infrastructure Engineer |
| Tuğçe Çevik | Implementation & Integration Engineer |

## 3. Sprint Planning and confirmed decisions

### 3.1 Task distribution approval — November 16, 2026

| Field | Record |
| --- | --- |
| Date | November 16, 2026 |
| Time | 21:11 (Türkiye time) |
| Format | Asynchronous decision in the team WhatsApp group |
| Participants | All six team members |
| Topic | Final Sprint 2 task distribution PDF |
| Decision | All six team members approved the final task distribution. |
| Outcome | The approved distribution defines Sprint 2 task owners and designated peer reviewers; it is the basis for the Sprint 2 Task Board and RACI Matrix. |
| Status | **Approved** |
| Recorded by | Bilgesu Nacak |

**Decision record:** On November 16, 2026, at 21:11 (Türkiye time), all six PantryChef team members approved the final Sprint 2 task distribution PDF through the team WhatsApp group. The approved distribution serves as the baseline for task ownership, designated reviewers, GitHub tracking, and RACI assignments.

**Evidence:** Approved Sprint 2 task distribution PDF and the corresponding WhatsApp group approval messages. Keep any chat screenshots in an access-controlled location; do not publish members' personal phone numbers or private messages in this public repository.

### 3.2 Task allocation and execution tracking

| Area | Primary owner | Tracking reference |
| --- | --- | --- |
| Requirements, backlog, scope | Burcu Ücük | S2-01–S2-05 |
| Scrum planning, RACI, meeting records, coordination, submission | Bilgesu Nacak | S2-06–S2-11, S2-37 |
| Architecture and diagrams | Ayşe Dural | S2-12–S2-17, S2-34–S2-35 |
| QA, test plans, traceability | Beyzanur Alpay | S2-18–S2-22 |
| DevOps, infrastructure, repository rules, release | Emre Boz | S2-23–S2-27, S2-36 |
| Figma, screen design, user flows and UI documentation | Tuğçe Çevik | S2-28–S2-33 |

**Tracking note:** Task IDs are not the same as GitHub Issue numbers. Existing Issues must be reused where appropriate rather than duplicated. Current completion status is determined from live GitHub evidence, not inferred from this plan.

### 3.3 Planning follow-up

| Action | Owner | State |
| --- | --- | --- |
| Maintain Sprint 2 Task Board | Bilgesu Nacak | Done - Issue #38 closed; PR #39 merged into develop |
| Prepare Sprint 2 RACI Matrix | Bilgesu Nacak | Done - Issue #40 closed; PR #41 merged into develop |
| Maintain Sprint 2 meeting records | Bilgesu Nacak | In progress |
| Confirm progress and blockers with task owners | All task owners; coordinated by Bilgesu | Ongoing |
| Validate final deliverables and gather PR evidence | Relevant owners and reviewers | Pending |

The initial planning states were recorded on November 16, 2026. The S2-06 and S2-07 statuses were updated on November 17, 2026, following the approved and merged Pull Requests #39 and #41. Remaining activities will be updated as new evidence becomes available.

## 4. Stand-up and progress updates

**Communication format:** Asynchronous coordination through the team WhatsApp group and GitHub Issues, Pull Requests, and review comments.

**Status:** Ongoing — November 16–20, 2026.

The team coordinated Sprint 2 progress through written messages and GitHub activity rather than separately documented daily stand-up meetings. The Scrum Master monitored task progress, requested reviews, tracked blockers, and followed up with responsible team members.

The entries below summarize verified coordination activities. They do not represent formal daily stand-up attendance records.

| Date | Coordination activity | Outcome | Evidence |
| --- | --- | --- | --- |
| Nov 16 | Team task distribution approval through WhatsApp | All six members approved the Sprint 2 assignments at 21:11. | Section 3.1 |
| Nov 17 | Scrum Master coordination and PR reviews | Requirements, repository setup, RACI, and progress-tracking PRs were reviewed or followed up. | PRs #32, #54, #56, #58, #60 |
| Nov 18–19 | GitHub-based documentation and reviewer coordination | Pending reviews, documentation corrections, and Sprint 2 deliverable dependencies were tracked. | PRs #54, #55, #62, #70, #71 |
| Nov 20 | Sprint 2 deliverable and review-status verification | Merged requirements, architecture, QA, and UI documentation were checked; remaining approvals and release dependencies were identified. | PRs #50, #51, #54, #55, #60, #66, #68, #70, #71, #82, #84, #87, #91, #92, #93, #96 |

**Remaining follow-up:** Complete outstanding PR reviews and merges, resolve documentation-link failures, update the final submission package, and conduct or document the Sprint Review and Retrospective when they actually occur.

**Record limitation:** Individual daily attendance and unreported member updates are not inferred from GitHub activity.

### 4.1 Scrum Master coordination and PR reviews — November 17, 2026

**Date:** November 17, 2026  
**Format:** Asynchronous GitHub Pull Request reviews and coordination  
**Coordinator:** Bilgesu Nacak — Scrum Master  
**Status:** In progress — follow-up actions pending

The Scrum Master reviewed assigned Pull Requests, provided documented feedback to relevant task owners, and monitored outstanding approvals.

| PR | Task / Owner | Review activity | Outcome / Next action |
|---|---|---|---|
| [#54](https://github.com/seng321-7th-team/PantryChef/pull/54) | S2-01 / S2-05 — Burcu Ücük | Reviewed MVP Scope and Out-of-Scope against the System Vision and Product Backlog. | Scope generally aligned; documentation corrections requested. Awaiting updates and technical review. |
| [#32](https://github.com/seng321-7th-team/PantryChef/pull/32) | S2-26 — Emre Boz | Reviewed repository folders, README updates, issue template, and documentation link-check CI workflow. | No major issues identified in the reviewed changes. Requested branch synchronization with `develop` before final approval. |
| [#56](https://github.com/seng321-7th-team/PantryChef/pull/56) | Team Roles and RACI documentation update — Bilgesu Nacak | Checked the Pull Request review status. | Awaiting Ayşe Dural's review and approval. |

**Coordination outcome:** Review feedback was communicated through GitHub. The referenced Pull Requests remain subject to their respective review and merge requirements. No approval or merge is claimed in this record.

**Follow-up:** Monitor responses from Burcu Ücük, Emre Boz, and Ayşe Dural; verify requested changes before proceeding with final reviews.

### 4.2 Additional coordination updates — November 17, 2026

**Format:** Asynchronous GitHub coordination  
**Coordinator:** Bilgesu Nacak  
**Status:** Follow-up activities recorded; outstanding reviews remain open

| PR | Activity | Verified Outcome |
|---|---|---|
| #32 | S2-26 repository setup follow-up | Emre synchronized the feature branch with `develop`. Both CI checks passed, and Bilgesu approved the PR. Ayşe's review remained pending at the last check. |
| #54 | S2-05 MVP scope review | Burcu addressed the requested SRS corrections in commit `fd29a71`. Bilgesu formally approved the scope review. Ayşe's technical review remained pending at the last check. |
| #58 | S2-09 progress and impediment tracking | Initial documentation was submitted for Emre's review. Subsequent progress updates were pushed to the existing PR. |
| #60 | S2-10 Review and Retrospective preparation | Preparation documentation was submitted for Beyzanur's review. |
| #56 | Team Roles/RACI documentation corrections | Ayşe's approval remained pending at the last check. |

**Follow-up:** Continue monitoring pending technical and peer reviews. Record approvals and merges only after they are confirmed in GitHub.

## 5. Impediment log

**Status:** Ongoing — confirmed documentation, review, and release dependencies are tracked through GitHub.

The following items were identified through Sprint 2 Pull Request reviews and coordination activities. They represent verified technical or process dependencies, not unreported personal blockers.

| ID | Date identified | Impediment / dependency | Impact | Owner | Action / mitigation | State | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IMP-01 | Nov 20 | Database schema SQL CHECK constraint required correction. | Schema documentation could not receive final approval. | Ayşe Dural | Correct the constraint and request Emre's re-review. | Resolved — Emre approved; merge pending at last check. | PR #66 |
| IMP-02 | Nov 20 | D-3, D-4, and D-6 Figma screens were missing from the initial UI prototype. | UI/UX consistency review and final documentation were incomplete. | Tuğçe Çevik | Add the seven screens and update the 39-frame export. | Resolved — 39-frame design completed; PRs #50 and #71 merged (PR #50 merge commit: 96bcbe3). | PRs #50, #71 |
| IMP-03 | Nov 20 | README documentation links failed CI validation. | README PR could not be finalized. | Emre Boz | Merge dependent documents, synchronize the branch, and rerun the link check. | Open | PR #84 |
| IMP-04 | Nov 20 | New U10–U12 diagrams required reviewer verification. | User-flow PR could not be finalized. | Tuğçe Çevik / Ayşe Dural | Review the added diagrams and merge after approval. | Open | PR #70 |
| IMP-05 | Nov 20 | ADR documentation links required updates following merged requirements and architecture PRs. | ADR status update PR remained open. | Ayşe Dural | Apply Emre's link suggestions and finalize the merge. | Open | PR #87 |
| IMP-06 | Nov 20 | Final release depends on the remaining Sprint 2 documentation merges. | GitHub tag and release cannot yet be finalized. | Emre Boz | Complete dependencies, merge develop into main, create the sprint-2 tag and release. | Open | PR #96, Issue #31 |

**Follow-up procedure:** The Scrum Master monitors the linked Pull Requests and Issues. Each open item remains assigned to its responsible owner until the required action is verified. Resolved design or review findings are distinguished from unfinished merge or release work.

**Record limitation:** Dates represent the documented coordination checkpoint, not necessarily the original date when each technical issue first appeared.

> Sprint 2 planning and progress updates were handled asynchronously in the team WhatsApp group and on GitHub. The confirmed decisions and follow-up actions are recorded in Sections 3 and 4. No separate Sprint Review or Retrospective meeting is planned for this sprint.

## 6. Sprint Review

**Status:** Outcomes recorded from the team discussion on WhatsApp.

| Field | Outcome |
| --- | --- |
| Date / time and format | Outcome recorded November 21, 2026. Asynchronous discussion in the team WhatsApp group. |
| Attendees | PantryChef team discussion. Individual attendance was not recorded. |
| Demonstrated or reviewed deliverables | Detailed SRS and refined backlog, NFR and quality measures, Figma prototypes and user flows, and C4/UML architecture documentation. |
| Accepted items and evidence links | The team reviewed all Sprint 2 deliverables and agreed the package could be submitted through Microsoft Teams on the evening of November 21. See the [submission package](sprint2-submission.md) for deliverable and PR links. |
| Stakeholder or reviewer feedback | Issues identified during review were raised in GitHub comments, addressed, and followed through to merge. |
| Rework or follow-up actions and owners | Bilgesu will coordinate the Teams submission after the release link is available. See [Issue #78](https://github.com/seng321-7th-team/PantryChef/issues/78). |

## 7. Sprint Retrospective

**Status:** Outcomes recorded from the team discussion on WhatsApp.

| Discussion point | Outcome |
| --- | --- |
| Date / time and attendees | Outcome recorded November 21, 2026, from the team discussion on WhatsApp. Individual attendance was not recorded. |
| What went well | Reviewers raised issues directly in GitHub comments. The team resolved the reported issues and merged the reviewed changes. |
| What did not go well | The team reported that the process went well overall. Issues raised during reviews were handled as they came up. |
| Improvements for the next sprint | The discussion identified GitHub comments and follow-up before merge as practices that worked well. No separate improvement action was recorded. |
| Action owner and target date | No separate retrospective action owner or target date was recorded. |
| Follow-up method | GitHub Issues, PR comments, and merge records. |

## 8. Meeting and decision log

| Date / time (Türkiye) | Type | Participants / responsible parties | Key decision or outcome | Evidence |
| --- | --- | --- | --- | --- |
| Nov 16, 2026 — 21:11 | Asynchronous Sprint Planning decision (WhatsApp) | All six team members | Final Sprint 2 task distribution approved unanimously. | Approved PDF; private WhatsApp confirmation |
| Nov 17, 2026 — time not recorded | GitHub PR reviews and Scrum Master coordination | Bilgesu Nacak and relevant PR owners | Scope and repository reviews performed; progress tracking and meeting documentation coordinated. | PRs #32, #54, #56, #58, #60 |
| Nov 18–19, 2026 — times not consolidated | Asynchronous documentation and review coordination | Relevant document owners and reviewers | SRS, backlog, API, architecture, and UI/UX review findings followed up through GitHub. | PRs #54, #55, #62, #64, #70, #71 |
| Nov 20, 2026 — time not consolidated | Requirements and architecture alignment | Burcu Ücük, Ayşe Dural, relevant reviewers | Requirements, API v0.2.1, and architecture consistency updates merged; outstanding ADR and schema follow-ups remained tracked. | PRs #51, #55, #68, #89, #91; follow-ups #66, #87 |
| Nov 20, 2026 — time not consolidated | UI/UX scope decisions and documentation follow-up | Burcu Ücük, Tuğçe Çevik, relevant reviewers | D-3, D-4 and D-6 design decisions were reflected in the 39-frame Figma prototype. PR #50 (UI consistency review) and PR #71 (Figma documentation) were merged. PR #70 (user-flow diagrams) remained open pending final review of U10–U12. | PRs #50, #70, #71 |
| Nov 20, 2026 — time not consolidated | QA documentation coordination | Beyzanur Alpay, Burcu Ücük, Ayşe Dural | Initial QA documentation merged, NFR verification alignment merged, and the API v0.2.1 QA follow-up submitted for review. D-03 remained open. | PRs #82, #92, #93 |
| Nov 20, 2026 — time not consolidated | Release and submission coordination | Emre Boz, Bilgesu Nacak, relevant reviewers | README link-check failures and remaining release dependencies tracked. The final release PR remained Draft. | PRs #84, #96; Issue #31 |
| Nov 20, 2026 — time not consolidated | Scrum Master end-of-sprint preparation | Bilgesu Nacak | Peer evaluation tracking issue created; Sprint Review and Retrospective documentation preparation continued. | Issues #42, #97 |

Append each additional confirmed meeting or team decision to this log, including its actual date, attendees, owner, and outcome.

## 9. Sprint coordination checklist

- [x] Final Sprint 2 task distribution approved by all six members on November 16, 2026, at 21:11.
- [x] Sprint 2 goal documented and task responsibilities assigned.
- [x] Asynchronous WhatsApp and GitHub coordination activities recorded through November 20.
- [x] Confirmed documentation and review impediments recorded with responsible owners and follow-up actions.
- [ ] Sprint Review conducted and actual outcomes documented.
- [ ] Sprint Retrospective conducted and improvement actions assigned.
- [ ] Peer evaluation process completed and tracked through Issue #97.
- [ ] Final deliverable evidence links and PR statuses verified.
- [ ] This updated document reviewed by Tuğçe Çevik in a Pull Request.
- [ ] Approved document merged into develop according to repository review rules.


## 10. References

- [PantryChef repository](https://github.com/seng321-7th-team/PantryChef)
- [Existing GitHub Project Board](https://github.com/orgs/seng321-7th-team/projects/4)
- [S2-08 Issue #42](https://github.com/seng321-7th-team/PantryChef/issues/42)
- `docs/sprint2-task-board.md` — approved task distribution and live tracking
- `docs/sprint2-raci.md` — task responsibility matrix
- `docs/sprint1-meeting-notes.md` — prior-sprint meeting-record reference


**Next update:** Record the actual Sprint Review and Retrospective outcomes, confirm the peer evaluation completion status, and synchronize final PR and release references before submission. This document does not claim that unverified meetings or activities have occurred.

**Last coordination checkpoint:** November 20, 2026 (Türkiye time).


## 11. GitHub Coordination Follow-up — November 21, 2026

| Follow-up | Verified outcome | Evidence |
|---|---|---|
| IMP-01 database schema | Emre approved the schema and it merged into develop. Issue closed. | [#65](https://github.com/seng321-7th-team/PantryChef/issues/65), [#66](https://github.com/seng321-7th-team/PantryChef/pull/66) |
| IMP-03 README links | Both CI checks passed after the dependency merges. Final README review and merge remain open. | [#30](https://github.com/seng321-7th-team/PantryChef/issues/30), [#84](https://github.com/seng321-7th-team/PantryChef/pull/84) |
| IMP-04 user flows | Ayşe approved; the PR merged into develop and the Issue closed. | [#52](https://github.com/seng321-7th-team/PantryChef/issues/52), [#70](https://github.com/seng321-7th-team/PantryChef/pull/70) |
| IMP-05 ADR status | Emre approved; the PR merged into develop. ADR-006 and ADR-008 are Accepted. | [#86](https://github.com/seng321-7th-team/PantryChef/issues/86), [#87](https://github.com/seng321-7th-team/PantryChef/pull/87) |
| IMP-06 release | The release PR remains Draft; main merge, tag and release remain pending. The UI documentation follow-up merged. | [#31](https://github.com/seng321-7th-team/PantryChef/issues/31), [#96](https://github.com/seng321-7th-team/PantryChef/pull/96), [#103](https://github.com/seng321-7th-team/PantryChef/pull/103) |

- [x] Current meeting-notes update reviewed and approved by Tuğçe. [#77](https://github.com/seng321-7th-team/PantryChef/pull/77), [#98](https://github.com/seng321-7th-team/PantryChef/pull/98)
- [x] Approved update merged into develop. [#98](https://github.com/seng321-7th-team/PantryChef/pull/98)
- [ ] Record the Sprint Review and Retrospective once their outcomes are confirmed. [#42](https://github.com/seng321-7th-team/PantryChef/issues/42)
- [ ] Confirm peer evaluation completion. [#97](https://github.com/seng321-7th-team/PantryChef/issues/97)
