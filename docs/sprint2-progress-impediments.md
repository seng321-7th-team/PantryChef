
# PantryChef — Sprint 2 Progress & Impediment Tracking

**Course:** BM321 — Software Engineering  
**Team:** Team 7  
**Sprint:** Sprint 2 — Requirements & Architecture  
**Deadline:** November 24, 2026, 23:59 (Türkiye time)  
**Document Owner:** Bilgesu Nacak — Scrum Master & Agile Process Coach  
**Reviewer:** Emre Boz — DevOps & CI/CD Infrastructure Engineer  
**Related Issue:** #57 — S2-09  
**Document Status:** In Progress  
**Last Updated:** November 17, 2026

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

## 5. Pending Reviews and Follow-up Actions

| ID | Task / PR | Responsible | Follow-up Action | Status |
|---|---|---|---|---|
| FU-01 | S2-01 / PR #54 | Ayşe Dural | Complete technical and API review of the SRS before merge | Pending |
| FU-02 | S2-26 / PR #32 | Ayşe Dural / Emre Boz | Branch synchronization and CI verification completed; Bilgesu approved the review. Await remaining reviewer feedback and merge coordination | Pending final review |
| FU-03 | Team Roles/RACI / PR #56 | Ayşe Dural | Review updated documentation references and approval status | Pending |
| FU-04 | S2-08 / Issue #42 | Bilgesu Nacak | Continue maintaining verified meeting and coordination records | Ongoing |
| FU-05 | S2-33 / Issue #53 | Tuğçe Çevik | Publish Figma documentation and request review when ready | Pending |
| FU-06 | S2-09 / Issue #57 / PR #58 | Emre Boz | Review Sprint 2 progress and impediment tracking documentation | Pending peer review |
| FU-07 | S2-10 / Issue #59 / PR #60 | Beyzanur Alpay | Review Sprint Review and Retrospective preparation documentation | Pending peer review |
| FU-08 | S2-05 / PR #54 | Bilgesu Nacak | MVP scope review completed and approved; monitor any scope changes arising from technical review | Completed — monitoring |


**Follow-up rule:** Each action remains open until its completion is verified through the relevant GitHub Issue, PR, or documented team confirmation.

## 6. Impediment Log

As of November 17, 2026, no specific Sprint 2 impediment has been independently confirmed for this log.

Pending reviews and requested changes are tracked in Section 5. They are not automatically classified as blockers.

| ID | Date Raised | Confirmed Impediment | Impact | Owner | Mitigation | Status | Resolution Date |
|---|---|---|---|---|---|---|---|
| — | — | No confirmed impediment recorded | — | — | — | — | — |

When an impediment is confirmed, add its description, impact, owner, mitigation plan, and resolution evidence.

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


## 8. Review and Completion Checklist

- [x] S2-09 Issue #57 created and assigned to the Scrum Master.
- [x] Initial progress snapshot documented.
- [x] Pending reviews and follow-up owners identified.
- [x] Impediment tracking structure established.
- [ ] Progress records checked against the latest GitHub Project Board.
- [ ] Confirmed impediments updated as new evidence becomes available.
- [ ] Documentation reviewed and approved by Emre Boz through PR #58.
- [ ] Approved changes merged into `develop`.
- [ ] Issue #57 closed after acceptance criteria are satisfied.

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

---

**Document Status:** In Progress — subject to continued verification and peer review.

**Next Update:** Recheck outstanding Pull Requests, task statuses, and confirmed impediments when new evidence becomes available.
