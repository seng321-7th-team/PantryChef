
# PantryChef — Sprint 2 Progress & Impediment Tracking

**Course:** BM321 — Software Engineering  
**Team:** Team 7  
**Sprint:** Sprint 2 — Requirements & Architecture  
**Deadline:** November 24, 2026, 23:59 (Türkiye time)  
**Document Owner:** Bilgesu Nacak — Scrum Master & Agile Process Coach  
**Reviewer:** Emre Boz — DevOps & CI/CD Infrastructure Engineer  
**Related Issue:** #57 — S2-09  
**Document Status:** In Progress  
**Last Updated:** November 20, 2026

---

## 1. Purpose

This document tracks Sprint 2 progress, outstanding reviews, follow-up actions, and confirmed impediments for the PantryChef project.

It supports transparent sprint coordination and evidence-based reporting through GitHub Issues, Pull Requests, and the Project Board.

Only verified progress and confirmed impediments are recorded. A passing CI check does not imply review approval, and an open Pull Request does not imply task completion.

## 2. Sprint Goal

Complete the Sprint 2 Requirements & Architecture deliverables:

1. Detailed Software Requirements Specification (SRS) and refined Product Backlog.
2. Non-functional requirements and measurable quality specifications.
3. Figma UI/UX prototypes and user-flow diagrams.
4. Software architecture documentation, including C4 and UML diagrams.

All deliverables must be submitted by November 24, 2026, at 23:59 (Türkiye time).

## 3. Progress Tracking Rules

The following status definitions are used consistently:

| Status | Definition |
|---|---|
| Todo | Work has not started or no evidence of progress has been confirmed. |
| In Progress | Work is underway, including drafting, review, or requested corrections. |
| In Review | A Pull Request is awaiting required peer or technical approval. |
| Done | Deliverable has satisfied its acceptance criteria and the required Pull Request has been merged. |
| Blocked | A confirmed impediment prevents progress and requires a resolution action. |

GitHub Project Board statuses may use fewer categories. When necessary, `In Review` and `Blocked` are recorded in this document while the Project Board item remains `In Progress`.

---

## 4. Progress Snapshot — November 17, 2026

This snapshot records selected activities that were directly reviewed or verified during Scrum Master coordination. It is not a complete inventory of all 37 Sprint 2 tasks.

| Task | Owner | Issue / PR | Verified Progress | Next Action |
|---|---|---|---|---|
| S2-06 — Sprint 2 Task Board | Bilgesu Nacak | Issue #38 / PR #39 | PR merged; Issue closed | Maintain task tracking |
| S2-07 — Sprint 2 RACI Matrix | Bilgesu Nacak | Issue #40 / PR #41 | PR merged; Issue closed | Maintain responsibility alignment |
| S2-08 — Meeting Notes | Bilgesu Nacak | Issue #42 | Living document updated and pushed to feature branch | Continue recording confirmed activities |
| S2-09 — Progress & Impediments | Bilgesu Nacak | Issue #57 / PR #58 | Initial tracking document created and pushed; PR opened with Emre Boz as reviewer | Await peer review and merge into `develop` |
| S2-10 — Sprint Review & Retrospective Preparation | Bilgesu Nacak | Issue #59 / PR #60 | Preparation document created and pushed; PR opened; Beyzanur Alpay requested as reviewer | Await peer review and merge into `develop` |
| S2-01 — Detailed SRS | Burcu Ücük | Issue #44 / PR #54 | S2-05 scope review approved by Bilgesu; CI passed | Await Ayşe's technical review before merge |
| S2-26 — Repository Setup | Emre Boz | Issue #28 / PR #32 | Branch synchronized with `develop`; both CI checks passed; Bilgesu's review approved; Ayşe's review pending at last verification | Await remaining reviewer feedback before merge |
| Team Roles/RACI reference update | Bilgesu Nacak | PR #56 | Documentation corrections submitted | Await Ayşe's review |
| S2-33 — Figma Links & UI Documentation | Tuğçe Çevik | Issue #53 | Issue created; documentation PR not verified | Await deliverable and review request |

**Snapshot limitation:** These statuses reflect the latest observations available to the Scrum Master on November 17, 2026. GitHub remains the authoritative source for subsequent changes.

---

### 4.1 Progress Update — November 20, 2026

This update records verified Scrum Master coordination activities following the November 17 snapshot. Earlier records are retained as historical evidence.

| Task / Activity | Evidence | Verified Status | Remaining Action |
|---|---|---|---|
| S2-08 — Meeting Notes | Issue #42 / PR #77 | Approved by Tuğçe Çevik and merged into develop (01ec498) | Continue recording actual Sprint Review and Retrospective outcomes |
| S2-09 — Progress & Impediments | Issue #57 / PR #58 | Approved by Emre Boz and merged into develop (6105c8d) | Record reviewer follow-ups and continue issue tracking |
| S2-10 — Deliverables Consistency Review | Issue #59 / PR #60 | Review feedback addressed; CI passed; approval pending | Await Beyzanur Alpay's approval and complete outstanding cross-document verification |
| S2-11 — Submission Package | Issue #78 / PR #79 | Approved by Burcu Ücük and merged into develop (a630a62) | Update final evidence, release information, and submission status |
| Sprint 2 Task Board Update | PR #69 | Approved by Burcu Ücük and merged into develop (1c7f4d3) | Keep task statuses and Issue/PR references current |
| S2-33 — Figma Links & UI Documentation | Issue #53 / PR #71 | Reviewed and approved by Bilgesu Nacak | Confirm merge status and follow up on remaining UI/UX evidence |

**Verification note:** An approved PR is not considered merged until the merge is confirmed. Merging a tracking document does not automatically complete all activities recorded in it.

**Current coordination priorities:**
- Follow up on PR #60's required approval.
- Record the reviewer follow-up items associated with Issue #57.
- Verify outstanding architecture, API, NFR, and UI/UX deliverables.
- Update the final submission evidence before the Sprint 2 deadline.

### 4.2 Additional Progress Update — November 20, 2026

This update records verified developments after the earlier November 20 snapshot. Historical entries in Sections 4 and 4.1 are retained unchanged.

| Task / Activity | Evidence | Verified Status | Remaining Action |
|---|---|---|---|
| S2-08 — Meeting Notes | Issue #42 / PR #98 | Approved by Tuğçe Çevik and merged into `develop` (fc38bcf) | Record actual Sprint Review and Retrospective outcomes; Issue #42 remains open |
| S2-10 — Deliverables Consistency Review | Issue #59 / PR #60 | PR merged; Issue #59 closed with acceptance criteria completed | Monitor any new cross-document inconsistencies |
| S2-33 — Figma Documentation | Issue #53 / PR #71 | PR merged; Issue #53 closed | Verify remaining prototype access evidence |
| UI Consistency Review | PR #50 | Merged (96bcbe3) | Verify related Issue status |
| Database Schema | PR #66 | Emre approved; merged into `develop` (93dbbe0) | None |
| User-flow Diagrams | PR #70 | Updated U10–U12 diagrams awaiting Ayşe's approval | Obtain approval and merge |
| Architecture Decision Records | PR #87 | Emre approved; merged into `develop` (57d1fe5) | Optional: Ayşe updates the remaining document links and status text in a follow-up |
| QA Documentation Sync | PR #93 | Burcu approved; Ayşe's review remains pending | Complete technical review and merge |
| README Documentation | PR #84 | One CI check passed and one failed | Resolve documentation link failures |
| Sprint 2 Release | PR #96 | Draft release PR; final integration pending | Complete deliverables before release |

**Coordination note:** Pending reviews are tracked separately from confirmed impediments. The README documentation-link CI failure requires corrective action before the related PR can be merged.


## 5. Pending Reviews and Follow-up Actions

| ID | Task / PR | Responsible | Follow-up Action | Status |
|---|---|---|---|---|
| FU-01 | S2-01 / PR #54 | Ayşe Dural | Technical and API review of the SRS completed; PR #54 merged into `develop` | Completed |
| FU-02 | S2-26 / PR #32 | Ayşe Dural / Emre Boz | Repository setup reviewed and approved by Bilgesu Nacak and Ayşe Dural; PR #32 merged into `develop` on November 17, 2026 (5dd8253) | Completed |
| FU-03 | Team Roles/RACI / PR #56 | Ayşe Dural | Updated documentation references reviewed and approved by Ayşe Dural; PR #56 merged into `develop` | Completed |
| FU-04 | S2-08 / Issue #42 / PR #98 | Bilgesu Nacak | Meeting and coordination records updated; PR #98 approved by Tuğçe Çevik and merged into `develop` (fc38bcf). Actual Sprint Review and Retrospective outcomes remain to be documented | Ongoing — Issue #42 Open / In Progress |
| FU-05 | S2-33 / Issue #53 / PR #71 | Tuğçe Çevik | Figma documentation reviewed and merged into `develop` through PR #71; Issue #53 closed. Public view access to prototype links has not yet been independently verified | Completed — prototype access verification pending |
| FU-06 | S2-09 / Issue #57 / PR #58 | Emre Boz | Initial progress and impediment tracking documentation reviewed and approved by Emre Boz; PR #58 merged into `develop` (6105c8d). Final tracking updates remain ongoing under Issue #57 | Completed — initial review and merge |
| FU-07 | S2-10 / Issue #59 / PR #60 | Beyzanur Alpay | Deliverables consistency review completed; PR #60 merged into `develop`, and Issue #59 closed with all eight acceptance criteria satisfied | Completed |
| FU-08 | S2-05 / PR #54 | Bilgesu Nacak | MVP scope review completed and approved; monitor any scope changes arising from technical review | Completed — monitoring |


**Follow-up rule:** Each action remains open until its completion is verified through the relevant GitHub Issue, PR, or documented team confirmation.

### 5.1 Reviewer Follow-up Register — Issue #57

The following actions were raised during Emre Boz's review of Sprint 2 progress tracking.

These items are tracked separately from the existing FU-01–FU-08 actions to preserve the original numbering and historical records.

| ID | Area / Evidence | Follow-up Action | Status |
|---|---|---|---|
| RFU-01 | PR #54, PR #32, PR #56 | Verify the latest approval and merge status of these PRs and update the progress records accordingly. | Completed — PR #32 merged on November 17, 2026 (5dd8253); PR #54 and PR #56 also approved and merged into `develop`. |
| RFU-02 | Architecture PR #62 and PR #64 | Verify current review and merge status, including any outstanding architecture feedback. | Completed — PR #64 approved by Emre Boz and merged on November 18, 2026 (3688747); PR #62 also approved and merged into `develop`. |
| RFU-03 | PR #54, PR #62, PR #68 | Verify consistency of initial inventory stock rules and order creation permissions across the SRS and API documentation. | Core rules confirmed: new ingredients start with zero stock; opening stock uses a separate INITIAL_STOCK adjustment; order creation is WAITER-only. PRs #54, #62 and #68 merged into `develop`. Final cross-document consistency monitoring remains ongoing. |
| RFU-04 | DevOps PR #36 and PR #37 | Verify review outcomes and coordinate any outstanding approval or merge actions. | Done: both approved by Ayşe and merged Nov 18 (a4e9987, 58bf8a6); issues #29 and #35 closed |
| RFU-05 | GitHub invitations: nedima68 and goksuyldrm | Verify whether the invitations remain necessary, their current status, and any required repository access follow-up. | Checked Nov 20: mhmttemin accepted; nedima68 and goksuyldrm still pending (expire Nov 23). The repo is public, so this does not block access. Emre re-sends them if they expire |

**Source:** [Issue #57 — Sprint 2 Progress & Impediment Tracking](https://github.com/seng321-7th-team/PantryChef/issues/57)

**Tracking rule:** These follow-ups remain open until their outcomes are verified through GitHub or confirmed by the responsible team members. An earlier reviewer observation is not treated as proof of the current PR or invitation status.

## 6. Impediment Log

As of November 17, 2026, no specific Sprint 2 impediment has been independently confirmed for this log.

Pending reviews and requested changes are tracked in Section 5. They are not automatically classified as blockers.

| ID | Date Raised | Confirmed Impediment | Impact | Owner | Mitigation | Status | Resolution Date |
|---|---|---|---|---|---|---|---|
| — | — | No confirmed impediment recorded | — | — | — | — | — |

When an impediment is confirmed, add its description, impact, owner, mitigation plan, and resolution evidence.

### 6.1 Confirmed Impediment Update — November 20, 2026

The November 17 impediment snapshot above is retained as historical evidence.

| ID | Date Confirmed | Impediment | Impact | Owner | Mitigation / Next Action | Status |
|---|---|---|---|---|---|---|
| IMP-01 | Nov 20, 2026 | Docs link check fails in PR #84 because the README links to files from PRs that were not merged yet (planned, see the PR #84 description) | PR #84 cannot be merged until the check passes | Emre Boz | Update the branch after each dependency merge. After #66 merged (014754b), only `docs/ui-ux/user-flows.md` from PR #70 is missing | Open, waits for PR #70 |

**Tracking note:** PRs #70 and #93 have outstanding review or merge actions (#66 and #87 were merged on November 20). These are tracked as dependencies, not automatically classified as confirmed impediments.

## 7. Coordination and Evidence

| Date | Activity | Evidence | Outcome |
|---|---|---|---|
| Nov 16, 2026 | Sprint 2 task distribution approved by all six team members | Approved task distribution PDF; private team confirmation | Ownership and reviewer assignments established |
| Nov 17, 2026 | S2-06 and S2-07 completion verified | PR #39, PR #41; Issues #38, #40 | Both deliverables merged and Issues closed |
| Nov 17, 2026 | S2-05 MVP scope review completed | PR #54; Issue #44; commit fd29a71 | Requested corrections verified; scope review formally approved; technical review pending |
| Nov 17, 2026 | S2-26 repository setup reviewed | PR #32 | Emre synchronized the branch with `develop`; CI checks passed; Scrum Master review approved |
| Nov 17, 2026 | Team Roles/RACI documentation update tracked | PR #56 | Awaiting Ayşe's review |
| Nov 17, 2026 | S2-09 progress tracking documentation submitted for review | Issue #57 / PR #58 | Emre assigned as reviewer; approval pending |
| Nov 17, 2026 | S2-10 review and retrospective preparation submitted for review | Issue #59 / PR #60 | Beyzanur assigned as reviewer; approval pending |

### 7.1 Coordination Update — November 20, 2026

The following entries record verified Scrum Master coordination activities. Earlier historical records in Section 7 are retained unchanged.

| Date | Activity | Evidence | Outcome |
|---|---|---|---|
| Nov 20, 2026 | Sprint 2 Meeting Notes update completed | Issue #42 / PR #98 | Tuğçe Çevik approved the update; PR merged into `develop` (fc38bcf). Sprint Review and Retrospective remain pending |
| Nov 20, 2026 | Deliverables consistency review completion verified | Issue #59 / PR #60 | PR merged and Issue #59 closed |
| Nov 20, 2026 | Figma documentation integration verified | Issue #53 / PR #71 | PR merged and Issue #53 closed; prototype link access verification remains pending |
| Nov 20, 2026 | Outstanding technical reviews checked | PRs #66, #70, #87 and #93 | Remaining approvals, corrections and merges recorded as follow-up actions |
| Nov 20, 2026 | README link check failure checked | PR #84 | Failing links point to files from PRs not merged yet, no link needs a fix. After the branch update only `user-flows.md` (PR #70) is missing |
| Nov 20, 2026 | Sprint 2 release readiness reviewed | PR #96 | Final integration and release activities remain pending |

## 8. Review and Completion Checklist

- [x] S2-09 Issue #57 created and assigned to the Scrum Master.
- [x] Initial progress snapshot documented.
- [x] Pending reviews and follow-up owners identified.
- [x] Impediment tracking structure established.
- [x] Documentation reviewed and approved by Emre Boz through PR #58.
- [x] Initial tracking documentation merged into `develop` through PR #58.
- [x] November 20 progress update recorded.
- [x] Reviewer follow-up actions RFU-01–RFU-05 documented.
- [ ] Progress records verified against the latest GitHub Project Board.
- [x] Reviewer follow-up outcomes verified and updated based on available GitHub evidence; RFU-05 invitation status and remaining open PRs require continued monitoring.
- [x] Confirmed impediments recorded if identified.
- [ ] Final Sprint 2 tracking and evidence verified.
- [ ] Issue #57 closed after all applicable acceptance criteria are satisfied.


## 9. References

- [PantryChef Repository](https://github.com/seng321-7th-team/PantryChef)
- [Sprint 2 Project Board](https://github.com/orgs/seng321-7th-team/projects/4)
- [S2-09 Issue #57](https://github.com/seng321-7th-team/PantryChef/issues/57)
- [SRS PR #54](https://github.com/seng321-7th-team/PantryChef/pull/54)
- [Repository Setup PR #32](https://github.com/seng321-7th-team/PantryChef/pull/32)
- [Team Roles/RACI PR #56](https://github.com/seng321-7th-team/PantryChef/pull/56)
- `docs/sprint2-task-board.md`
- `docs/sprint2-raci.md`
- `docs/sprint2-meeting-notes.md`
- [S2-09 Initial Tracking PR #58](https://github.com/seng321-7th-team/PantryChef/pull/58)

---

**Document Status:** In Progress — initial documentation merged; reviewer follow-ups and final Sprint 2 verification remain open.

**Next Update:** Verify RFU-01–RFU-05 outcomes, remaining PR statuses, and final Sprint 2 evidence.


## Progress Update — November 21, 2026

This update records the latest verified Sprint 2 status. Previous progress snapshots and review findings are retained as historical evidence.

### Merged Pull Requests

- PR #66 — Database Schema: merged into `develop` (`93dbbe0`).
- PR #70 — User-flow Diagrams: merged into `develop` (`4a462cb`).
- PR #87 — ADR-006 and ADR-008 Updates: merged into `develop` (`57d1fe5`); both ADRs are now Accepted.
- PR #93 — QA/OpenAPI Documentation Sync: merged into `develop` (`4227056`).

### Pending Work and Dependencies

- PR #84 — Sprint 2 README: both CI checks now pass (2/2). Final documentation corrections and reviewer approval remain pending.
- PR #99 — Progress and Impediment Tracking: approved by Emre; this dated status update is being incorporated before merge.
- PR #102 — Submission Package: final review and merge remain pending.
- PR #96 — Sprint 2 Release: remains Draft; architecture approval and four passing checks are recorded. Final integration into `main`, tagging and GitHub release remain pending.
- Issue #100 / PR #101 — Frontend UI Skeleton: implementation remains in progress; PR #101 is Draft.
- UI documentation: outdated status references in `docs/ui-ux/ui-user-story-review.md` and `docs/ui-ux/ui-prototype.md` were reported on PR #96 for Tuğçe's follow-up.
- Independent Figma prototype access verification remains pending.

### Impediment IMP-01 — Follow-up

On November 20, PR #84's documentation link check failed because the README referenced files from pull requests not yet merged into `develop`. This was a dependency/integration issue, not evidence that the intended document paths were incorrect. As of November 21, PR #70 has merged and PR #84 shows two successful CI checks. The CI failure is resolved; final README review and merge remain pending.

### Scrum Master Coordination

- Confirmed the merge status of PRs #66, #70, #87 and #93.
- Recorded review feedback on PR #84 and the UI documentation follow-up on PR #96.
- Rechecked PR #99 approval, CI results and outstanding integration dependencies.
- Preserved earlier dated checkpoints; Sprint 2 final release and Teams submission are not yet complete.


## 10. Current Progress and Open Follow-ups — November 21, 2026

See the [current task and evidence register](sprint2-task-board.md#9-current-status-and-evidence-register--november-21-2026) for the Project Board comparison.

| Item | Current status | Evidence |
|---|---|---|
| S2-09 tracking | Emre approved the update and it merged into develop. Issue closed / Done with 6/6 acceptance criteria checked. See the [closure note](https://github.com/seng321-7th-team/PantryChef/issues/57#issuecomment-7061635657). | [#57](https://github.com/seng321-7th-team/PantryChef/issues/57), [#58](https://github.com/seng321-7th-team/PantryChef/pull/58), [#83](https://github.com/seng321-7th-team/PantryChef/pull/83), [#99](https://github.com/seng321-7th-team/PantryChef/pull/99) |
| S2-11 submission package | Burcu approved the update and it merged into develop. Issue remains open / In Progress pending final verification, release details and Teams confirmation. | [#78](https://github.com/seng321-7th-team/PantryChef/issues/78), [#102](https://github.com/seng321-7th-team/PantryChef/pull/102) |
| Task Board and UI documentation sync | Burcu approved the Task Board update and Bilgesu approved the UI documentation correction. Both merged into develop. | [#104](https://github.com/seng321-7th-team/PantryChef/pull/104), [#103](https://github.com/seng321-7th-team/PantryChef/pull/103) |
| S2-32 frontend skeleton | Issue open / In Progress. PR is ready for review and Bilgesu has approved it. Merge pending. | [#100](https://github.com/seng321-7th-team/PantryChef/issues/100), [#101](https://github.com/seng321-7th-team/PantryChef/pull/101) |
| IMP-01 README link check | Dependency merges resolved the previous CI failure. Both checks passed; final documentation review and merge remain open. | [#30](https://github.com/seng321-7th-team/PantryChef/issues/30), [#70](https://github.com/seng321-7th-team/PantryChef/pull/70), [#84](https://github.com/seng321-7th-team/PantryChef/pull/84) |
| Sprint 2 release | Release Issue is Todo. PR is Draft and Ayşe's approval is recorded. Main merge, tag and release remain pending. | [#31](https://github.com/seng321-7th-team/PantryChef/issues/31), [#96](https://github.com/seng321-7th-team/PantryChef/pull/96) |

Final Figma access verification, Sprint Review and Retrospective records, and Teams submission confirmation remain open.
