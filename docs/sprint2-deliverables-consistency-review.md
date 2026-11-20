
# PantryChef — Sprint 2 Deliverables Consistency Review

**Course:** BM321 — Software Engineering  
**Team:** Team 7  
**Sprint:** Sprint 2 — Requirements & Architecture  
**Deadline:** November 24, 2026, 23:59 (Türkiye time)  
**Document Owner:** Bilgesu Nacak — Scrum Master & Agile Process Coach  
**Reviewer:** Beyzanur Alpay — QA & Test Automation Engineer  
**Related Issue:** #59 — S2-10  
**Related Pull Request:** #60  
**Document Status:** In Progress — Partial Review  
**Review Started:** November 18, 2026

---

## 1. Purpose

This document tracks cross-document consistency checks for PantryChef Sprint 2 deliverables.

The objective is to verify that software requirements, product scope, non-functional requirements, UI/UX prototypes, and architecture documentation follow the same approved system vision and business rules.

Findings are recorded with supporting evidence, responsible owners, and follow-up actions. Items that have not yet been reviewed are explicitly marked as Pending.

## 2. Review Scope

| Review Area | Artifacts | Responsible Owner | Review Status |
|---|---|---|---|
| Requirements and MVP boundaries | System Vision, SRS, Product Backlog | Burcu Ücük | Partially Reviewed |
| Functional and non-functional requirements | SRS, NFR documentation | Burcu Ücük / Beyzanur Alpay | Pending |
| UI/UX and user flows | Figma prototypes, user-flow diagrams, SRS | Tuğçe Çevik | Pending |
| Software architecture | C4, UML diagrams, System Vision, SRS | Ayşe Dural | Pending |
| API and business rules | OpenAPI draft, SRS, System Vision | Ayşe Dural | Pending |
| Documentation traceability | GitHub Issues, PRs, task ownership, evidence links | Bilgesu Nacak | In Progress |

## 3. Consistency Baseline

The review uses the following reference documents:

- `docs/system-vision.md`
- `docs/product-backlog.md`
- `docs/srs.md`
- `docs/non-functional-requirements.md`
- `api/openapi.yaml`
- `docs/sprint2-task-board.md`
- `docs/sprint2-raci.md`

The latest approved versions must be verified before final acceptance. Documents in open Pull Requests are treated as review drafts rather than merged deliverables.

## 4. Verified Requirements and MVP Scope Review

**Review Context:** S2-05 scope review performed through PR #54.

The SRS was compared against the System Vision and Product Backlog.

| Check | Review Finding | Status |
|---|---|---|
| Primary actors | Waiter, Chef/Kitchen Staff, and Restaurant Manager are consistently defined | Consistent |
| Order lifecycle | Pending → Preparing → Ready, with authorized cancellation paths | Consistent |
| Atomic ingredient reservation | Accepted Pending orders reserve complete ingredient quantities | Consistent |
| Physical stock consumption | Physical inventory is deducted exactly once when preparation begins | Consistent |
| Ready transition | No further stock deduction occurs | Consistent |
| Pending cancellation | Reserved ingredients are released without restoring or reducing physical stock | Consistent |
| Exceptional cancellation | Requires elevated authorization, reason, and audit record | Consistent |
| MVP exclusions | Customer ordering, payments, delivery, procurement, and Delivered state remain outside MVP | Consistent |
| Post-MVP backlog | US-15 and US-16 remain deferred procurement-related stories | Consistent |

**Evidence:** [PR #54](https://github.com/seng321-7th-team/PantryChef/pull/54), [Issue #44](https://github.com/seng321-7th-team/PantryChef/issues/44).

**Review Outcome:** The reviewed MVP scope and business rules are consistent across the three examined documents. Documentation corrections requested during S2-05 were addressed in commit `fd29a71`.

**Limitation:** This finding covers the MVP scope review only. It does not replace Ayşe Dural's technical/API review or confirm consistency with unreviewed NFR, Figma, C4, and UML artifacts.

---

## 5. Consistency Findings and Open Items

The following items are based on the verified S2-05 review and the remaining Sprint 2 consistency checks.

| ID | Area | Finding / Open Item | Status | Responsible | Evidence |
|---|---|---|---|---|---|
| CF-01 | SRS document structure | Duplicate section numbering and misplaced content were corrected in commit `fd29a71`. | Resolved | Burcu Ücük | PR #54 |
| CF-02 | SRS issue references | Incorrect Issue #49 reference was corrected to Issue #44. | Resolved | Burcu Ücük | PR #54 |
| CF-03 | MVP exclusions | Advanced accounting and financial modules were explicitly added to the exclusion list. | Resolved | Burcu Ücük | PR #54 |
| CF-04 | NFR alignment | Verify NFR identifiers, measurable targets, and quality criteria against the SRS. | Pending verification | Beyzanur Alpay / Burcu Ücük | NFR document; SRS |
| CF-05 | UI/UX alignment | Verify Figma screens, actors, permissions, order states, and user flows against approved requirements. | Pending verification | Tuğçe Çevik | Figma deliverables; SRS |
| CF-06 | Architecture alignment | Verify C4 and UML diagrams against system boundaries, inventory operations, and order lifecycle. | Pending verification | Ayşe Dural | Architecture deliverables |
| CF-07 | API consistency | Confirm OpenAPI operations, request/response schemas, state transitions, and error handling against the SRS. | Pending technical review | Ayşe Dural | `api/openapi.yaml`; PR #54 |
| CF-08 | Cross-document traceability | Verify final artifact paths, requirement references, GitHub Issues, PRs, and task ownership. | In Progress | Bilgesu Nacak | GitHub Project Board; Sprint 2 Task Board |

**Finding classification:** Resolved items have supporting review evidence. Pending items are verification tasks, not confirmed defects.

## 6. Follow-up Action Register

| Action ID | Related Finding | Required Action | Responsible | Status |
|---|---|---|---|---|
| CA-01 | CF-04 | Review SRS-to-NFR consistency and record any discrepancies. | Beyzanur Alpay / Burcu Ücük | Pending |
| CA-02 | CF-05 | Compare Figma prototypes and user flows with SRS requirements. | Tuğçe Çevik | Pending |
| CA-03 | CF-06 | Review C4/UML diagrams against approved system boundaries and business rules. | Ayşe Dural | Pending |
| CA-04 | CF-07 | Complete technical/API consistency review and document conclusions. | Ayşe Dural | Pending |
| CA-05 | CF-08 | Verify Issue/PR links, final deliverable paths, and outstanding reviews. | Bilgesu Nacak | In Progress |

Each follow-up action must be updated only after its responsible owner provides verifiable evidence or the relevant artifact has been reviewed.

## 7. Outstanding Verification Matrix

| Requirement / Business Rule | SRS | Product Backlog | NFR | Figma | C4 / UML | OpenAPI |
|---|---|---|---|---|---|---|
| Three primary actors (Waiter, Chef, Manager) | Verified | Verified | N/A | Pending | Pending | Pending |
| Role-based operation permissions | Partially verified | Partially verified | N/A | Pending | Pending | Pending |
| Manager order creation permission | Verified — WAITER only | Aligned in PR #55 (986583e); merge pending | N/A | Partially verified | Partially verified | Verified — WAITER only |
| Pending → Preparing → Ready | Verified | Verified | Pending | Pending | Pending | Pending |
| Atomic ingredient reservation | Verified | Verified | Pending | Pending | Pending | Pending |
| Exactly-once stock consumption | Verified | Verified | Pending | Pending | Pending | Pending |
| Controlled cancellation | Verified | Verified | Pending | Pending | Pending | Pending |
| MVP exclusions | Verified | Verified | N/A | Pending | Pending | Pending |
| Requirement traceability | Partially verified | Partially verified | Pending | Pending | Pending | Pending |

**Legend:**
- **Verified:** Directly examined and found consistent for the stated review scope.
- **Partially verified:** Some relevant evidence was examined, but review is incomplete.
- **Pending:** Not yet verified.
- **N/A:** Not directly applicable to the artifact.

### 7.1 Actor Coverage and Operation Permissions

Actor coverage and operation permissions are verified separately.

The three primary actors are Restaurant Manager, Waiter, and Chef/Kitchen Staff. The presence of these actors does not automatically verify their permissions.

**Finding — Manager order creation: Resolved at requirements and API level; final backlog merge pending.**

The agreed permission rule is that only authorized Waiters can create orders. Restaurant Managers and Chefs cannot create orders.

The merged SRS (PR #54, FR-06) and OpenAPI contract (PR #62, POST /orders) specify WAITER-only order creation.

The refined Product Backlog (PR #55) was updated in commit `986583e` to align US-06 AC1 with this rule. Beyzanur's re-review and final merge are still pending.

Relevant sources:
- Product Backlog: https://github.com/seng321-7th-team/PantryChef/pull/55
- SRS: https://github.com/seng321-7th-team/PantryChef/blob/develop/docs/srs.md
- OpenAPI: https://github.com/seng321-7th-team/PantryChef/blob/develop/api/openapi.yaml

**Remaining follow-up:** Verify the final approved and merged Product Backlog, then confirm that the relevant UI/UX and QA traceability documents reflect the same WAITER-only rule.

The permission decision is confirmed. Final cross-document verification remains In Progress.

The refined Product Backlog (PR #55) and the SRS/OpenAPI documentation (PRs #54 and #62) contain differing descriptions of Manager order creation permissions.

This item remains Pending until the Product Owner and Software Architect confirm the intended permission model.

Relevant sources:
- Product Backlog: https://github.com/seng321-7th-team/PantryChef/pull/55
- SRS: https://github.com/seng321-7th-team/PantryChef/pull/54
- OpenAPI draft: https://github.com/seng321-7th-team/PantryChef/pull/62

Required follow-up: Confirm whether order creation is restricted to Waiters or also allowed for Managers, then align the affected documents.

No final permission decision is claimed.


## 8. Review and Completion Checklist

- [x] S2-10 Issue #59 created and aligned with the approved task name.
- [x] Initial SRS, System Vision, and Product Backlog scope comparison documented.
- [x] Resolved SRS documentation findings recorded.
- [x] Outstanding consistency checks and follow-up owners identified.
- [ ] SRS and NFR consistency fully verified.
- [ ] Figma prototypes and user flows reviewed.
- [ ] C4 and UML diagrams reviewed.
- [ ] OpenAPI and SRS consistency verified by the technical reviewer.
- [ ] Final cross-document findings and evidence links verified.
- [ ] Beyzanur Alpay completes PR #60 peer review.
- [ ] Approved documentation merged into `develop`.
- [ ] Issue #59 closed after all applicable acceptance criteria are satisfied.

## 9. References

- [PantryChef Repository](https://github.com/seng321-7th-team/PantryChef)
- [Sprint 2 Project Board](https://github.com/orgs/seng321-7th-team/projects/4)
- [S2-10 Issue #59](https://github.com/seng321-7th-team/PantryChef/issues/59)
- [S2-10 Pull Request #60](https://github.com/seng321-7th-team/PantryChef/pull/60)
- [SRS Pull Request #54](https://github.com/seng321-7th-team/PantryChef/pull/54)
- [Quality Metrics and Requirements–Test Traceability — Issue #80](https://github.com/seng321-7th-team/PantryChef/issues/80)

- `docs/system-vision.md`
- `docs/product-backlog.md`
- `docs/srs.md`
- `docs/non-functional-requirements.md`
- `api/openapi.yaml`
- `docs/sprint2-task-board.md`
- `docs/sprint2-raci.md`

### 9.1 Quality Metrics and Traceability Evidence

Issue #80 is referenced as supporting evidence for the quality metrics and requirements–test traceability work.

This reference identifies the related QA tracking record. It does not confirm that all quality targets have been measured or that the requirements–test traceability matrix has been fully verified.

**Verification Status:** Pending final evidence review.

**Related Owner:** Beyzanur Alpay — QA & Test Automation Engineer.

---

**Document Status:** In Progress — Pending Cross-Document Verification

**Next Action:** Review the remaining Sprint 2 artifacts, update verified findings, and request Beyzanur Alpay's review of the revised PR #60.
