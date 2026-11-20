# PantryChef — Quality Metrics and Verification Criteria

**Task:** S2-19 · **Owner:** Beyzanur Alpay · **Reviewer:** Emre Boz  
**Status:** Review draft. All results pending.

The NFR identifiers and proposed performance targets follow [PR #51](https://github.com/seng321-7th-team/PantryChef/pull/51). The verification protocol and pass conditions are proposed for peer review.

| Requirement | Measurement and evidence | Pass condition |
|---|---|---|
| NFR-01 Response time | Run the [Sprint 2 QA load-test baseline](#sprint-2-qa-load-test-baseline-d-02) and report GET /orders and GET /inventory separately | Successful requests meet p95 ≤ 2 s per read endpoint, and the shared sample minimum and error budget are met |
| NFR-02 Transaction performance | Run the same [Sprint 2 QA load-test baseline](#sprint-2-qa-load-test-baseline-d-02) for valid POST /orders requests with reservation | Successful requests meet p95 ≤ 3 s, the shared sample minimum and error budget are met, and no inventory invariant is violated |
| NFR-03 Atomic transactions | Compare committed state before and after rejected and injected-failure operations (TC-07, TC-15) | Zero partial commits across tested creation, preparation and pending cancellation failures |
| NFR-04 Inventory consistency | Compare onHand, reserved and available after every stock case, including TC-08 | Available equals onHand minus reserved and remains nonnegative. Concurrent orders never over-reserve |
| NFR-05 Duplicate protection | Compare order IDs, reservation counts, stock movement counts and balances across retries (TC-09, TC-12, TC-16, TC-17, TC-26, TC-27, TC-33) | One logical effect per operation across the replay cases |
| NFR-06 Authorization | Compare the approved role/operation matrix to observed status and persisted state (TC-03, TC-18, TC-19, TC-28), with UI visibility checked separately in TC-23 | All approved role cases succeed with valid data. Denied API cases return the documented HTTP status and leave data unchanged. Manager order creation returns 403 FORBIDDEN (TC-03, D-01) |
| NFR-07 Validation | Run valid and invalid field cases for quantity, identifiers, required fields and cancellation reason (TC-04, TC-05, TC-10, TC-18, TC-32) | Invalid inputs return the documented errors and create no unintended changes |
| NFR-08 Traceability | Inspect adjustment and late cancellation audit records, then check audit read permissions and review contract and implementation immutability evidence separately (TC-05, TC-17, TC-19) | All sampled significant actions have actor, timestamp, event and linked entity. Late cancellation includes reason and previous status. Manager audit reads return 200; unauthorized reads return 403. Audit immutability requires separate implementation evidence |
| NFR-09 Operational feedback | Run TC-21, TC-22 and TC-29, exercising success, invalid input, insufficient stock, denied action and invalid transition | Each applicable UI outcome identifies the result clearly. For stale kitchen actions the board reports the conflict and refreshes (TC-29). Rejected actions leave displayed state consistent with persisted state |
| NFR-10 Role-specific UI | Compare waiter, chef and manager sessions against the approved role matrix and UI flows (TC-21–23) | Each role can access its assigned operations. Order status and inventory values are distinguishable wherever displayed |
| NFR-11 Modular design | Review C4/ADR and available implementation modules | Order, inventory, recipe, authorization and audit responsibilities have identifiable owners/boundaries in the reviewed design |
| NFR-12 Contract consistency | Use the required [OpenAPI lint check (Redocly)](https://github.com/seng321-7th-team/PantryChef/blob/develop/.github/workflows/ci.yml) and compare implemented responses, payloads and error codes separately | Reviewed contract passes lint and every selected contract case matches the approved specification |
| NFR-13 Browser compatibility | Run TC-21/22 on agreed stable Chrome and Firefox builds; record versions | Critical user flows work on both browsers with zero blocking defects |
| NFR-14 Automated verification | CI report and case-to-test mapping for reservation, concurrent orders, consumption, cancellation and authorization | Each critical rule has a passing automated scenario once implemented. [Sprint 3 readiness](https://github.com/seng321-7th-team/PantryChef/blob/develop/docs/devops/sprint3-readiness.md) plans PostgreSQL integration tests in CI and a separate Jest gate of at least 50% backend unit-test line coverage |
| NFR-15 Transaction recovery | Inject transaction failure, inspect persisted state, then retry successfully (TC-15) | No partial state persists. A valid retry produces one complete effect |

## Sprint 2 QA load-test baseline (D-02)

[Burcu accepted](https://github.com/seng321-7th-team/PantryChef/pull/82#issuecomment-7038967983) [Emre’s configuration](https://github.com/seng321-7th-team/PantryChef/pull/82#discussion_r4630664043) as the Sprint 2 QA planning baseline. This is the shared QA protocol for NFR-01 and NFR-02. Execution and measurements are pending.

| Setting | Baseline |
|---|---|
| Environment and tool | Build the local Docker Compose stack from the release tag and load seed data (IR-01, IR-02 and IR-12). Run k6 on the same machine. Record the release tag, CPU, RAM and operating system. Keep the k6 script with the other tests in the repository. |
| Users and request mix | 20 virtual users with 1 second of think time. Send 40% `GET /orders`, 40% `GET /inventory` and 20% `POST /orders`. Use a fresh `Idempotency-Key` for each new order request. |
| Dataset | Seed approximately 50 ingredients, 20 menu items and 500 existing orders. Provide enough stock to prevent expected stock shortages during order creation. |
| Timing and samples | Warm up for 1 minute and exclude it from measurement. Measure for the next 5 minutes. Collect at least 200 successful requests per endpoint in that window. |
| Latency | Calculate p95 from successful requests separately for each endpoint. Read endpoints must meet p95 ≤ 2 s and order creation with reservation must meet p95 ≤ 3 s. |
| Error budget | Set the request timeout to 10 seconds. Count unexpected failures and timeouts once per attempt. Their combined count must be at most 1% of all attempts during measurement. |

Record achieved concurrency, request counts by endpoint and response status, successful sample counts, unexpected failures, timeouts and p95 per endpoint using a documented percentile method. A run can pass only if the sample minimum, latency thresholds and error budget are all satisfied, with zero inventory invariant violations for order creation.

## Infrastructure review inputs

- [S2-25 / Issue #34](https://github.com/seng321-7th-team/PantryChef/issues/34) lists HTTPS, secrets handling and backup/restore. Ask Emre to link the agreed deployment checks and recovery targets. Verify HTTPS and secret injection in the deployed test environment and retain sanitized evidence.
- For backup/restore, perform a restore into an isolated environment and compare order, reservation and inventory consistency. Record backup age at simulated failure and time to restore service. Emre and proposed NFR-16 in #51 suggest RPO ≤24 hours and RTO ≤30 minutes. The [infrastructure requirements](https://github.com/seng321-7th-team/PantryChef/blob/develop/docs/architecture/infrastructure-requirements.md) call for a restore trial. Numerical targets and restore evidence remain pending. NFR-15 measures transaction rollback.
