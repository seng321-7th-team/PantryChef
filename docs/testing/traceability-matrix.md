# PantryChef — Requirements–Test Traceability Matrix

**Task:** S2-22 · **Owner:** Beyzanur Alpay · **Reviewer:** Burcu Ücük  
**Status:** Planned coverage. Test execution pending.

The mapping uses the current pull request drafts for [SRS PR #54](https://github.com/seng321-7th-team/PantryChef/pull/54), [Backlog PR #55](https://github.com/seng321-7th-team/PantryChef/pull/55), [FR/NFR PR #51](https://github.com/seng321-7th-team/PantryChef/pull/51) and [API PR #62](https://github.com/seng321-7th-team/PantryChef/pull/62). Functional rows map each requirement to the associated story's acceptance criteria as a group. For quality coverage, the [NFR verification table](quality-metrics.md) maps NFR-01 through NFR-15 to execution or review evidence.

| FR | Backlog story | Acceptance area | Planned test cases |
|---|---|---|---|
| FR-01 | US-01 | Role authorization | TC-03, TC-18, TC-23 |
| FR-02 | US-02 | Ingredient management | TC-04, TC-05, TC-14 |
| FR-03 | US-03 | Available inventory | TC-02, TC-06, TC-07, TC-08, TC-12, TC-16, TC-20 |
| FR-04 | US-04 | Inventory adjustments | TC-03, TC-05, TC-19 |
| FR-05 | US-05 | Recipe management | TC-01, TC-14 |
| FR-06 | US-06 | Order creation | TC-03, TC-06, TC-07, TC-09, TC-10, TC-21 |
| FR-07 | US-07 | Atomic reservation | TC-01, TC-06, TC-07, TC-08, TC-09, TC-15 |
| FR-08 | US-08 | Kitchen visibility | TC-03, TC-11, TC-21, TC-23 |
| FR-09 | US-09 | Preparation and consumption | TC-03, TC-11, TC-12, TC-13, TC-15, TC-21 |
| FR-10 | US-10 | Order completion | TC-11, TC-13, TC-21 |
| FR-11 | US-11 | Pending cancellation | TC-13, TC-15, TC-16, TC-22 |
| FR-12 | US-12 | Exceptional cancellation | TC-03, TC-17, TC-18, TC-19, TC-22, TC-23 |
| FR-13 | US-13 | Operation history | TC-05, TC-17, TC-19 |
| FR-14 | US-14 | Low-stock alerts | TC-02, TC-20 |

US-15 and US-16 are tracked by the backlog as post-MVP. See [test definitions](test-cases.md) for expected outcomes.

## Decisions to confirm

| ID | Decision and evidence | Owner / follow-up |
|---|---|---|
| D-01 | PR #55 US-06 AC1 allows Waiter or Manager to create an order. PR #62 `POST /orders` specifies WAITER. | Burcu and Ayşe to agree on the role and align the contract, backlog and FR-06. TC-03 has a pending Manager expectation. |
| D-02 | PR #51 proposes 20 concurrent users and p95 targets of 2 s (reads) and 3 s (order creation). Formal workload and measurement settings are pending. | Emre and Burcu to confirm the load profile, duration, dataset and error budget. |
| D-03 | Issue #34 lists backup/restore targets. Link the agreed thresholds and restoration evidence before marking the infrastructure review complete. | Emre to confirm RPO/RTO. |
