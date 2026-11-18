# PantryChef — Sprint 2 Software Test Plan

**Task:** S2-18 · **Owner:** Beyzanur Alpay · **Reviewer:** Burcu Ücük  
**Status:** Review draft, 18 November 2026. Execution is planned once an MVP test environment is available.

## Scope

Verify MVP roles, ingredient administration, stock and adjustments, recipes, order intake, kitchen status updates, early and late cancellation, audit history and low-stock alerts. Procurement and goods receipt (US-15/16) are post-MVP. Use the SRS, refined backlog, NFR draft and OpenAPI v0.2.0 as the review baseline. Record disagreements in the [traceability matrix](traceability-matrix.md) and update the affected tests when the decision is recorded.

| Level | Approach | Priority |
|---|---|---|
| Unit | Verify quantity aggregation, inventory invariants, threshold boundaries and transition policy with deterministic inputs. | Stock calculations and authorization/state rules |
| Integration | Use the REST API with an isolated test database. Compare order, inventory, reservation, movement and audit records before and after actions. Run concurrent calls and controlled transaction-failure checks. | Atomicity, exactly-once effects, authorization and error contracts |
| E2E | Use synthetic manager, waiter and chef accounts to verify the order lifecycle, rejection feedback and cancellation in the browser. | Main order and cancellation paths |
| Quality verification | Collect performance, compatibility, contract and CI evidence using the [quality metrics](quality-metrics.md). | NFR-01–15 |

## Environment and evidence

- Use synthetic users, two ingredients and versioned recipes. Reset fixtures between cases and use fresh idempotency keys except where a case specifically verifies replay. Use independent sessions and a common start signal for concurrent requests.
- Record the build commit, schema/API revision, environment, browser versions, fixture identifiers and date. Store sanitized results with the linked Issue/PR. Attach observed API status/problem code, stock before and after, and audit/movement counts for critical tests. Exclude credentials and tokens.
- Before execution, confirm the reviewed requirements and permission matrix, seed the test database, and verify that UI, API and test accounts are available. Run rollback cases only where controlled failure injection is supported.
- Mark cases Planned, Passed, Failed or Blocked. A pass requires the expected response and persisted effects. File a defect with case ID, fixture, steps, expected/actual results and sanitized evidence. Retest fixes and rerun affected regression cases.
- Proposed exit criteria for the MVP test run: all critical cases executed and passing, agreed quality gates met, and any remaining findings recorded with owner and disposition. Sprint 2 completion requires peer-reviewed QA documentation. Sprint 3 introduces CI and the course's minimum 50% unit-test coverage target. The automated integration/E2E test report is a final deliverable.

## Review responsibilities

- QA maintains the test cases, results and traceability. Burcu reviews scope and acceptance criteria, Emre reviews the quality measurements and deployment evidence, and Ayşe reviews the API, state and stock assertions.
- Run unit and integration cases before E2E. Use the case variants and decision gates in the matrix to track partial coverage. Run same-key races on isolated fixtures and collect both responses and persisted-state evidence. Rerun the stock and cancellation cases after changes to order state, reservation handling or permissions. Use the agreed test build when comparing browser and API evidence.
- Treat duplicate physical deductions, unauthorized mutations and partial commits as blocking defects. Treat unconfirmed expected results as blocked and record the decision owner in the traceability matrix.

## References

- [SRS PR #54](https://github.com/seng321-7th-team/PantryChef/pull/54)
- [Backlog PR #55](https://github.com/seng321-7th-team/PantryChef/pull/55)
- [FR/NFR PR #51](https://github.com/seng321-7th-team/PantryChef/pull/51)
- [OpenAPI and UML PR #62](https://github.com/seng321-7th-team/PantryChef/pull/62)
- [Architecture decisions PR #64](https://github.com/seng321-7th-team/PantryChef/pull/64) · [Database schema PR #66](https://github.com/seng321-7th-team/PantryChef/pull/66) · [Consistency review PR #68](https://github.com/seng321-7th-team/PantryChef/pull/68)
- [UI flows PR #70](https://github.com/seng321-7th-team/PantryChef/pull/70) · [Prototype PR #71](https://github.com/seng321-7th-team/PantryChef/pull/71)
- [Test cases](test-cases.md) · [Traceability](traceability-matrix.md)
