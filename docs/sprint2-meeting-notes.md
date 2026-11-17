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

**Status:** Ongoing — record updates only after they occur. No daily attendance or individual progress statements are assumed.

| Date / time | Member | Completed since last update | Next step | Blocker / risk | Evidence or follow-up |
| --- | --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Pending | Pending |

For every actual stand-up or asynchronous check-in, add one row per reporting member and note whether the update was verbal, written, or asynchronous. If there was no blocker, record “None reported” rather than leaving an ambiguous blank.
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

## 5. Impediment log

**Status:** Open for updates; no specific impediment has yet been confirmed for entry.

| ID | Date raised | Impediment | Impact | Owner | Action / mitigation | State | Resolved date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — | Pending | No confirmed entry yet | — | — | — | Pending | — |

If an impediment is reported, track it until resolution or explicitly carry it forward with an owner and follow-up date. Link related GitHub Issues where available.

## 6. Sprint Review

**Status:** Pending — not yet held or documented.

| Field | To be recorded after the review |
| --- | --- |
| Date / time and format | Pending |
| Attendees | Pending |
| Demonstrated or reviewed deliverables | Pending |
| Accepted items and evidence links | Pending |
| Stakeholder or reviewer feedback | Pending |
| Rework or follow-up actions and owners | Pending |

Record the actual SRS, backlog, NFR, Figma, C4/UML outputs reviewed, any feedback, and the corresponding Issue/PR links. Do not mark deliverables accepted before review.

## 7. Sprint Retrospective

**Status:** Pending — not yet held or documented.

| Discussion point | Record after the retrospective |
| --- | --- |
| Date / time and attendees | Pending |
| What went well | Pending |
| What did not go well | Pending |
| Improvements for the next sprint | Pending |
| Action owner and target date | Pending |
| Follow-up method | Pending |

## 8. Meeting and decision log

| Date / time (Türkiye) | Type | Participants | Key decision or outcome | Evidence |
| --- | --- | --- | --- | --- |
| Nov 16, 2026 — 21:11 | Asynchronous Sprint Planning decision (WhatsApp) | All six team members | Final Sprint 2 task distribution PDF approved unanimously | Approved PDF; private WhatsApp confirmation record |
| Nov 17, 2026 — time not recorded | Asynchronous PR review and Scrum Master coordination | Bilgesu Nacak; feedback shared with relevant PR owners | Reviewed PR #54 (SRS/MVP scope) and PR #32 (repository setup); requested follow-up corrections and branch synchronization. Checked PR #56 approval status. No PR approvals or merges recorded. | GitHub PRs #54, #32, and #56; see Section 4.1 |

Append each additional confirmed meeting or team decision to this log, including its actual date, attendees, owner, and outcome.

## 9. Sprint coordination checklist

- [x] Final Sprint 2 task distribution approved by all six members on November 16, 2026, at 21:11.
- [ ] Sprint 2 goal and meeting schedule formally confirmed and recorded.
- [ ] Actual stand-up updates and blockers recorded throughout the sprint.
- [ ] Impediments tracked to resolution or explicitly carried forward.
- [ ] Sprint Review held and outcomes documented.
- [ ] Sprint Retrospective held and improvement actions assigned.
- [ ] All relevant evidence links verified.
- [ ] This document reviewed by Tuğçe Çevik in a Pull Request.
- [ ] Approved document merged according to the repository's review rules.

## 10. References

- [PantryChef repository](https://github.com/seng321-7th-team/PantryChef)
- [Existing GitHub Project Board](https://github.com/orgs/seng321-7th-team/projects/4)
- [S2-08 Issue #42](https://github.com/seng321-7th-team/PantryChef/issues/42)
- `docs/sprint2-task-board.md` — approved task distribution and live tracking
- `docs/sprint2-raci.md` — task responsibility matrix
- `docs/sprint1-meeting-notes.md` — prior-sprint meeting-record reference

**Next update:** Add verified stand-up entries and new decisions after the team reports them. This draft is not a claim that the Sprint 2 Review or Retrospective has occurred.
