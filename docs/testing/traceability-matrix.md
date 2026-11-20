# PantryChef — Requirements–Test Traceability Matrix

**Task:** S2-22 · **Owner:** Beyzanur Alpay · **Reviewer:** Burcu Ücük  
**Status:** Planned coverage. Test execution pending.

The mapping uses the current pull request drafts for [SRS PR #54](https://github.com/seng321-7th-team/PantryChef/pull/54), [Backlog PR #55](https://github.com/seng321-7th-team/PantryChef/pull/55), [FR/NFR PR #51](https://github.com/seng321-7th-team/PantryChef/pull/51) and [API PR #62](https://github.com/seng321-7th-team/PantryChef/pull/62). Functional rows summarize coverage. The acceptance-criterion table below shows individual test links and decision gates. For quality coverage, the [NFR verification table](quality-metrics.md) maps NFR-01 through NFR-15 to execution or review evidence.

| FR | Backlog story | Acceptance area | Planned test cases |
|---|---|---|---|
| FR-01 | US-01 | Role authorization | TC-03, TC-18, TC-23, TC-25, TC-28 |
| FR-02 | US-02 | Ingredient management | TC-04, TC-05, TC-14, TC-30, TC-31 |
| FR-03 | US-03 | Available inventory | TC-02, TC-06, TC-07, TC-08, TC-12, TC-16, TC-20 |
| FR-04 | US-04 | Inventory adjustments | TC-03, TC-05, TC-19 |
| FR-05 | US-05 | Recipe management | TC-01, TC-14 |
| FR-06 | US-06 | Order creation | TC-03, TC-06, TC-07, TC-09, TC-10, TC-21 |
| FR-07 | US-07 | Atomic reservation | TC-01, TC-06, TC-07, TC-08, TC-09, TC-15, TC-26, TC-33 |
| FR-08 | US-08 | Kitchen visibility | TC-03, TC-11, TC-21, TC-23 |
| FR-09 | US-09 | Preparation and consumption | TC-03, TC-11, TC-12, TC-13, TC-15, TC-21, TC-24, TC-27 |
| FR-10 | US-10 | Order completion | TC-11, TC-13, TC-21, TC-24, TC-28, TC-29 |
| FR-11 | US-11 | Pending cancellation | TC-13, TC-15, TC-16, TC-22 |
| FR-12 | US-12 | Exceptional cancellation | TC-17, TC-18, TC-19, TC-22, TC-23, TC-25, TC-32 |
| FR-13 | US-13 | Operation history | TC-05, TC-17, TC-19 |
| FR-14 | US-14 | Low-stock alerts | TC-02, TC-20, TC-31 |

US-15 and US-16 are tracked by the backlog as post-MVP. See [test definitions](test-cases.md) for expected outcomes.

## Decisions to confirm

| ID | Decision and evidence | Owner / follow-up |
|---|---|---|
| D-01 | Waiter-only order creation is confirmed by SRS FR-06, OpenAPI on develop and updated backlog #55. | TC-03 expects Manager 403 FORBIDDEN without mutation. |
| D-02 | #51 and Emre’s #82 review propose different timings and sample definitions. Both are recorded in [quality metrics](quality-metrics.md). | Open. Burcu, Emre, technical lead and QA to confirm a single protocol. |
| D-03 | Emre and proposed NFR-16 in #51 suggest RPO ≤24 hours and RTO ≤30 minutes. | Proposed. Infrastructure owner and QA confirmation and restore evidence pending. |
| D-04 | Ayşe confirmed that a matching in-flight request waits, replays after commit, or proceeds normally after rollback. | Technical review confirmed. ADR wording planned for Sprint 3. TC-26/27. |
| D-05 | Ayşe confirmed 200 replay for same key/body, 409 for different or omitted key and 422 for same key with changed body. | Technical review confirmed. TC-16/17 capture responses and no duplicate effects. |
| D-06 | Ayşe confirmed 400 for malformed input and 422 VALIDATION_FAILED for rule violations with valid formats. Missing key returning 400 is proposed. | Partially confirmed. TC-04/10/32 updated; missing-key status awaits API wording. |
| D-07 | Use two Chef sessions or direct PATCH calls. Disable polling or stub 409 for UI feedback. | Review-confirmed strategy. TC-29 separates live stock verification from stubbed UI feedback. |
| D-08 | Confirmed in merged [PR #89](https://github.com/seng321-7th-team/PantryChef/pull/89): SRS FR-14 excludes deactivated ingredients from low-stock alerts, consistent with OpenAPI v0.2.0. | Confirmed. TC-31 covers the inactive-ingredient rule and remains planned. |
| D-09 | Ayşe confirmed keys are scoped by user and operation, consistent with the schema. | Confirmed. TC-33 remains planned. |
| D-10 | Architecture review #68 CR-02 records conflicting FR numbering in System Vision, the earlier SRS and the Sprint 2 SRS. | Burcu to confirm the canonical numbering. This matrix uses PR #54/#51 identifiers only. CR-01 opening stock follows the consistent current drafts, with Burcu’s final confirmation tracked by #68. |
| D-11 | Ayşe confirmed one reservation and consumption movement per order item and ingredient. | Model confirmed. API wording awaits Ayşe’s update. TC-06/26 include a shared-ingredient variant. |

## Acceptance-criterion coverage

Numbers follow the acceptance criteria order in backlog PR #55. Planned refers to test design. Blocked marks the variant or assertion requiring a decision. Partial marks a specific assertion that still needs a fixture or test step.

| Story | AC → planned case(s) | Exceptions |
|---|---|---|
| US-01 | 1 → TC-03/23; 2 → TC-06/16; 3 → TC-11/28; 4 → TC-04/05/14; 5 → TC-03/18/28; 6 → TC-17/18/25 | Planned |
| US-02 | 1/2/5 → TC-04; 8 → TC-04/30/31; 3/4 → TC-05; 6 → TC-02/05; 7 → TC-04 | Planned |
| US-03 | 1/2 → TC-02/06; 3 → TC-05/08; 4 → TC-06/12/16/20 | Planned |
| US-04 | 1 → TC-03/05; 2/3/4/5 → TC-05 | Planned |
| US-05 | 1–6 → TC-14, with TC-01 for quantities | Planned |
| US-06 | 1 → TC-03/06; 2 → TC-10; 3/4/5 → TC-06; 6 → TC-06/07/15 | AC1 confirmed (D-01); missing-key status pending D-06 |
| US-07 | 1 → TC-01/06; 2–4 → TC-06/07; 5/6 → TC-07/15; 7 → TC-08; 8 → TC-09/26/33 | Replay, scope and shared-ingredient model confirmed (D-04/09/11); upstream wording pending where noted |
| US-08 | 1/2/3 → TC-11/21; 4 → TC-03/28 | Planned |
| US-09 | 1 → TC-03/24; 2 → TC-12/13/24; 3–5 → TC-12/27; 6/8 → TC-15; 7 → TC-12/27 | AC7 replay confirmed by technical review (D-04); ADR wording pending |
| US-10 | 1 → TC-28; 2 → TC-11/13/24; 3 → TC-11/21/28; 4 → TC-13/29; 5 → TC-21 | TC-29 separates fixture-based UI feedback from live API evidence (D-07) |
| US-11 | 1–4 → TC-16; 3 → TC-15 as well; 5 → TC-16 retry variants; 6 → TC-13/24 | AC5 response and stock expectations confirmed by technical review (D-05) |
| US-12 | 1/2/3 → TC-17/18/25; 4/5/6/7 → TC-17; 3 also → TC-32; 8 → TC-18 | AC7 response, stock and audit expectations confirmed by technical review (D-05) |
| US-13 | 1/2/3 → TC-19 (2/3 also TC-05/17); 4 → TC-19 audit read access; 5 → TC-19 immutability evidence | Access checks planned. Contract evidence is separate from pending implementation verification for AC5 |
| US-14 | 1 → TC-04/20; 2 → TC-02/20; 3/4/5 → TC-20; FR-14 inactive-ingredient rule → TC-31 | D-08 confirmed by PR #89. TC-31 remains planned. |
