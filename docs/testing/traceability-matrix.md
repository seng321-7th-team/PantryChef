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
| D-01 | PR #55 US-06 AC1 allows Waiter or Manager to create an order. PR #62 `POST /orders` specifies WAITER. | Burcu and Ayşe to agree on the role and align the contract, backlog and FR-06. TC-03 has a pending Manager expectation. |
| D-02 | PR #51 proposes 20 concurrent users and p95 targets of 2 s (reads) and 3 s (order creation). Formal workload and measurement settings are pending. | Emre and Burcu to confirm the load profile, duration, dataset and error budget. |
| D-03 | Issue #34 lists backup/restore targets. Link the agreed thresholds and restoration evidence before marking the infrastructure review complete. | Emre to confirm RPO/RTO. |
| D-04 | The contract specifies replay after a successful operation. The response to an identical same-key request while the first is in flight is unspecified. | Ayşe to confirm status, problem code or replay header. TC-26/27 still verify exactly one persistent effect. |
| D-05 | PATCH supports an optional key. The explicit same-key PREPARING replay rule does not specify the response for each repeated cancellation variant. | Ayşe to confirm same-key, different-key and omitted-key cancellation retry responses. TC-16/17 assert invariant and audit behavior. |
| D-06 | The current contract does not identify the exact status/problem-code mapping for every invalid order, ingredient and cancellation-reason boundary variant. | Ayşe to confirm the cases in TC-04, TC-10 and TC-32. Rejection and no mutation are required. |
| D-07 | UI flow U4 and prototype scr-03d define the conflict screen. A test fixture may be needed to produce a stale action before polling refreshes the board. | Tuğçe and Ayşe to confirm the test mechanism if ordinary UI execution cannot reach the state (TC-29). |
| D-08 | OpenAPI v0.2.0 excludes inactive ingredients from alerts. SRS FR-14 does not state that exception (architecture review #68 CR-03). | Burcu to confirm backlog/SRS scope. TC-31 documents the API baseline separately. |
| D-09 | ADR-005 and the schema draft scope keys by actor and operation; ADR-005 is proposed. | Ayşe and the team to confirm the final scope. TC-33 remains planned against the design baseline. |
| D-10 | Architecture review #68 CR-02 records conflicting FR numbering in System Vision, the earlier SRS and the Sprint 2 SRS. | Burcu to confirm the canonical numbering. This matrix uses PR #54/#51 identifiers only. CR-01 opening stock follows the consistent current drafts, with Burcu’s final confirmation tracked by #68. |
| D-11 | OpenAPI and ADR-004 describe one active reservation per ingredient. The database schema ties reservations to order items and enforces uniqueness per order item and ingredient. Shared ingredients across order items need a confirmed persistence model. | Ayşe to confirm reservation and movement granularity. TC-01 checks aggregate quantity. TC-06 and TC-26 do not establish row counts for a shared ingredient across multiple order items. |

## Acceptance-criterion coverage

Numbers follow the acceptance criteria order in backlog PR #55. Planned refers to test design. Blocked marks the variant or assertion requiring a decision. Partial marks a specific assertion that still needs a fixture or test step.

| Story | AC → planned case(s) | Exceptions |
|---|---|---|
| US-01 | 1 → TC-03/23; 2 → TC-06/16; 3 → TC-11/28; 4 → TC-04/05/14; 5 → TC-03/18/28; 6 → TC-17/18/25 | Planned |
| US-02 | 1/2/5 → TC-04; 8 → TC-04/30/31; 3/4 → TC-05; 6 → TC-02/05; 7 → TC-04 | Planned |
| US-03 | 1/2 → TC-02/06; 3 → TC-05/08; 4 → TC-06/12/16/20 | Planned |
| US-04 | 1 → TC-03/05; 2/3/4/5 → TC-05 | Planned |
| US-05 | 1–6 → TC-14, with TC-01 for quantities | Planned |
| US-06 | 1 → TC-03/06; 2 → TC-10; 3/4/5 → TC-06; 6 → TC-06/07/15 | AC1 Manager variant blocked by D-01; AC2 exact error mapping partly blocked by D-06 |
| US-07 | 1 → TC-01/06; 2–4 → TC-06/07; 5/6 → TC-07/15; 7 → TC-08; 8 → TC-09/26/33 | AC8 in-flight response blocked by D-04; actor scoping pending D-09. Shared-ingredient row counts pending D-11 |
| US-08 | 1/2/3 → TC-11/21; 4 → TC-03/28 | Planned |
| US-09 | 1 → TC-03/24; 2 → TC-12/13/24; 3–5 → TC-12/27; 6/8 → TC-15; 7 → TC-12/27 | AC7 in-flight response blocked by D-04; persisted effects covered |
| US-10 | 1 → TC-28; 2 → TC-11/13/24; 3 → TC-11/21/28; 4 → TC-13/29; 5 → TC-21 | TC-29 UI feedback path depends on D-07 |
| US-11 | 1–4 → TC-16; 3 → TC-15 as well; 5 → TC-16 retry variants; 6 → TC-13/24 | AC5 response details blocked by D-05; stock effects covered |
| US-12 | 1/2/3 → TC-17/18/25; 4/5/6/7 → TC-17; 3 also → TC-32; 8 → TC-18 | AC7 response details blocked by D-05; stock and audit effects covered |
| US-13 | 1/2/3 → TC-19 (2/3 also TC-05/17); 4 → TC-19 audit read access; 5 → TC-19 immutability evidence | Access checks planned. Contract evidence is separate from pending implementation verification for AC5 |
| US-14 | 1 → TC-04/20; 2 → TC-02/20; 3/4/5 → TC-20; inactive case → TC-31 | Inactive-ingredient acceptance pending D-08 |
