# PantryChef — Quality Metrics and Verification Criteria

**Task:** S2-19 · **Owner:** Beyzanur Alpay · **Reviewer:** Emre Boz  
**Status:** Review draft. All results pending.

The NFR identifiers and proposed performance targets follow [PR #51](https://github.com/seng321-7th-team/PantryChef/pull/51). The verification protocol and pass conditions are proposed for peer review.

| Requirement | Measurement and evidence | Pass condition |
|---|---|---|
| NFR-01 Response time | API load report for order list and inventory reads, per endpoint and with errors reported separately | At 20 concurrent users, p95 ≤ 2 s per read endpoint |
| NFR-02 Transaction performance | API load report for valid order creation with sufficient seeded stock and unique keys | At 20 concurrent users, p95 ≤ 3 s for order creation with reservation |
| NFR-03 Atomic transactions | Compare committed state before and after rejected and injected-failure operations (TC-07, TC-15) | Zero partial commits across tested creation, preparation and pending cancellation failures |
| NFR-04 Inventory consistency | Compare onHand, reserved and available after every stock case, including TC-08 | Available equals onHand minus reserved and remains nonnegative. Concurrent orders never over-reserve |
| NFR-05 Duplicate protection | Compare order IDs, reservation counts, stock movement counts and balances across retries (TC-09, TC-12, TC-16, TC-17) | One logical effect per operation across the replay cases |
| NFR-06 Authorization | Compare the approved role/operation matrix to observed status and persisted state (TC-03, TC-23) | All approved role cases succeed with valid data. All denied cases leave data unchanged |
| NFR-07 Validation | Run valid and invalid field cases for quantity, identifiers, required fields and cancellation reason (TC-04, TC-05, TC-10, TC-20) | Invalid inputs return the documented errors and create no unintended changes |
| NFR-08 Traceability | Inspect adjustment and late cancellation audit records, then exercise access restrictions (TC-05, TC-17, TC-19) | All sampled significant actions have actor, timestamp, event and linked entity. Late cancellation includes reason and previous status. Unauthorized operations cannot alter audit history |
| NFR-09 Operational feedback | Run TC-21 and TC-22, exercising success, invalid input, insufficient stock, denied action and invalid transition | Each applicable UI outcome identifies the result clearly. Rejected actions leave displayed state consistent with persisted state |
| NFR-10 Role-specific UI | Compare waiter, chef and manager sessions against the approved role matrix and UI flows (TC-21–23) | Each role can access its assigned operations. Order status and inventory values are distinguishable wherever displayed |
| NFR-11 Modular design | Review C4/ADR and available implementation modules | Order, inventory, recipe, authorization and audit responsibilities have identifiable owners/boundaries in the reviewed design |
| NFR-12 Contract consistency | Lint reviewed OpenAPI and compare implemented responses, payloads and error codes to it | Reviewed contract passes lint and every selected contract case matches the approved specification |
| NFR-13 Browser compatibility | Run TC-21/22 on agreed stable Chrome and Firefox builds; record versions | Critical user flows work on both browsers with zero blocking defects |
| NFR-14 Automated verification | CI report and case-to-test mapping for reservation, concurrent orders, consumption, cancellation and authorization | Each critical rule has a passing automated scenario once implemented. Track ≥50% unit-test coverage as the separate Sprint 3 gate |
| NFR-15 Transaction recovery | Inject transaction failure, inspect persisted state, then retry successfully (TC-15) | No partial state persists. A valid retry produces one complete effect |

## Proposed reproducible load protocol

Run authenticated reads and valid writes with documented data volume, build and hardware in an isolated environment. Agree on workload mix, warm-up, measurement window, sample counts and error budget with Emre before formal execution. Report offered concurrency, request counts, error rates, p95 per endpoint and stock fixture setup. Flag unexpected application errors separately so that fast failures cannot make a workload appear healthy.

## Infrastructure review inputs

- [S2-25 / Issue #34](https://github.com/seng321-7th-team/PantryChef/issues/34) lists HTTPS, secrets handling and backup/restore. Ask Emre to link the agreed deployment checks and recovery targets. Verify HTTPS and secret injection in the deployed test environment and retain sanitized evidence.
- For backup/restore, perform a restore into an isolated environment and compare order, reservation and inventory consistency. Record backup age at simulated failure and time to restore service. RPO/RTO are pending confirmation. NFR-15 measures transaction rollback.
