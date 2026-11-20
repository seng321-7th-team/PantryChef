# PantryChef – Architecture Decision Records

| Field | Value |
|---|---|
| Task | S2-16 Architecture Decision Records (ADR) |
| Owner | Ayşe Dural – Lead Software Architect and Technical Lead |
| Reviewer | Emre Boz (Sprint 2 final task table v2.0) |
| Date | 2026-11-18 |
| Status | Draft – pending review |
| Related artifacts | [`api/openapi.yaml`](../../api/openapi.yaml), C4 / UML / ER diagrams under `docs/architecture/` (PR #62), [`docs/system-vision.md`](../system-vision.md), [`docs/sprint1-meeting-notes.md`](../sprint1-meeting-notes.md), `docs/architecture/infrastructure-requirements.md` (S2-23, PR #36), `docs/non-functional-requirements.md` (S2-03, PR #51) |

This document records the architecture decisions behind PantryChef: what was decided, why, which
alternatives were considered and what each decision costs. Each record keeps the context and the
trade-offs so that later changes can be judged against the original reasons.

## How to read this document

| Status | Meaning |
|---|---|
| **Accepted** | Approved by the team or already part of a merged, reviewed artifact. |
| **Proposed** | Recommended by the technical lead; waits for team review or for the linked pull request to be merged. |
| **Rejected** | Considered and not adopted. The record stays so the reasoning is not repeated. |
| **Superseded** | Replaced by a newer record. The old record stays for traceability. |

A record is never edited to say something different after it is accepted. A change of mind is a new
record that supersedes the old one.

Nothing in this document has been implemented or load-tested yet. Sprint 2 is a requirements and
architecture sprint; verification happens when the backend is built (Sprint 3 onwards).

## Index

| ID | Decision | Status | Main sources |
|---|---|---|---|
| [ADR-001](#adr-001-technology-stack) | React, NestJS (TypeScript) and PostgreSQL | Accepted (versions open, see ADR-011) | Team technology choice |
| [ADR-002](#adr-002-modular-monolith) | One NestJS backend organised as a modular monolith | Proposed | C4 Container and Component, NFR-11 |
| [ADR-003](#adr-003-api-first-rest-contract) | API-first REST contract in OpenAPI 3.1, validated in CI | Accepted | PR #25, PR #6 |
| [ADR-004](#adr-004-stock-reservation-and-exactly-once-consumption) | Stock reservation and exactly-once consumption in one database transaction | Proposed | D-02 to D-06, D-11, NFR-03, NFR-04 |
| [ADR-005](#adr-005-persistent-idempotency-keys) | Persistent, user-scoped idempotency keys | Proposed | FR-15, FR-16, NFR-05 |
| [ADR-006](#adr-006-roles-permissions-and-late-cancellation) | Three roles plus one permission; server-side checks; audited late cancellation | Accepted (D-12); order creation by WAITER only is Proposed (PR #62) | D-12, NFR-06, NFR-08 |
| [ADR-007](#adr-007-immutable-recipe-versions-and-order-snapshots) | Immutable recipe versions and order snapshots | Proposed | D-07 |
| [ADR-008](#adr-008-no-hard-deletes-for-referenced-data) | No hard deletes for referenced data | Proposed | Backlog US-02, PR #62 |
| [ADR-009](#adr-009-initial-stock-entered-at-ingredient-creation) | Initial stock entered at ingredient creation | Rejected – opening stock is a separate `INITIAL_STOCK` adjustment | SRS FR-02, US-02, CR-01 (PR #68) |
| [ADR-010](#adr-010-kitchen-board-refresh-by-polling) | Kitchen board refreshes by polling, not WebSockets | Accepted (team decision recorded in S2-23) | `infrastructure-requirements.md` |
| [ADR-011](#adr-011-container-based-deployment-and-version-pinning) | Docker Compose deployment; runtime and database versions pinned in Sprint 3 | Proposed | S2-23, S2-27 |

---

## ADR-001: Technology stack

**Status:** Accepted – team technology choice, reported by the technical lead. The choice is not yet
written in a meeting record; it is to be added to `docs/sprint2-meeting-notes.md` (S2-08). Exact versions
are open (see ADR-011).

### Context
Six students build a web MVP with three role-based screens (waiter, chef, restaurant manager). Orders,
recipe versions, reservations and stock must stay consistent under concurrent requests. The OpenAPI
contract does not prescribe a technology, and the infrastructure requirements (S2-23) leave the
frontend framework and backend language to this ADR.

### Decision
- **Frontend:** React with TypeScript. Role-based screens built from shared components. Business rules
  are not trusted to the client; the frontend only calls the API.
- **Backend:** NestJS with TypeScript. Controllers handle HTTP and DTO validation, services hold the
  business rules, and a data access layer runs parameterised SQL inside explicit transactions.
- **Database:** PostgreSQL. Relational model with foreign keys, `UNIQUE` and `CHECK` constraints, and
  ACID transactions with row-level locking.
- Frontend and backend communicate only through the `/v1` JSON API described in `api/openapi.yaml`.

### Alternatives considered
- **Vue or Angular instead of React:** both could build the same screens. React was chosen as the team
  preference; nothing in the requirements favours another framework.
- **Express instead of NestJS:** lighter, but leaves module boundaries, dependency injection and
  validation conventions to each developer. NestJS gives a shared structure that matches ADR-002, at
  the cost of a steeper learning curve.
- **A document database (for example MongoDB):** flexible schema, but the core rules (reservations,
  stock invariants, recipe versions) are relational and need multi-row transactions and constraints.

### Consequences
- One language (TypeScript) on both sides lowers context switching. It does not by itself guarantee
  contract compatibility, so DTO validation and contract checks are still required.
- PostgreSQL constraints back up the service rules (ER diagram, page 3), but cross-table rules such as
  `reserved = SUM(ACTIVE reservations)` still have to be maintained by the service.
- ORM choice, package versions and lock files are not decided here; they are fixed with the Sprint 3
  project skeleton (ADR-011).

---

## ADR-002: Modular monolith

**Status:** Proposed – waits for team review.

### Context
Accepting an order must reserve every required ingredient or nothing at all, and starting preparation
must deduct stock exactly once. Splitting these steps across services would need distributed
transactions or compensation logic. The team is small and has one semester. NFR-11 asks for separated
order, inventory, recipe, authorization and audit responsibilities.

### Decision
One NestJS backend, deployed as one process, split into modules with explicit service interfaces:

| Module | Responsibility |
|---|---|
| Auth / Users | JWT, staff accounts, roles and permissions |
| Catalog / Recipes | Menu items, ingredients, versioned recipes |
| Orders | Orders, status transitions, idempotency, transaction orchestration |
| Inventory / Reservations | Stock levels, reservations, stock movements, low-stock alerts |
| Audit | Actor, timestamp and reason records for sensitive operations |

Modules call each other only through their services and never write another module's tables directly.
All modules share one PostgreSQL database and one transaction context, so an order and its stock
effects commit or roll back together. This is the structure shown in the C4 Component diagram.

### Alternatives considered
- **Microservices:** independent deployment and scaling, but stock consistency across services would
  need sagas or two-phase commit, messaging, retries and distributed tracing. None of these needs is
  proven for a single-restaurant MVP.
- **Unstructured monolith:** fastest to start, but module boundaries erode and NFR-11 becomes hard to
  show in review.

### Consequences
- One deployable unit and one database keep the transaction rules in ADR-004 simple.
- Modules cannot be scaled or deployed independently. If measurements later show that need, this ADR is
  revisited with a new record.
- Module boundaries are protected by code review, not by the runtime.

---

## ADR-003: API-first REST contract

**Status:** Accepted – the contract was merged in PR #25 and is validated by the `OpenAPI lint` CI job
(PR #6).

### Context
Frontend, backend, tests and documentation are written by different people in parallel. They need one
shared description of operations, payloads, errors and permissions.

### Decision
- `api/openapi.yaml` (OpenAPI 3.1) is the single source of truth for the HTTP interface. Behaviour
  changes are made in the contract first and reviewed in a pull request.
- REST with JSON under `/v1`, over HTTPS on any public host; local and demo runs may use plain HTTP
  (S2-23, IR-10); plural kebab-case resources; one status endpoint,
  `PATCH /orders/{orderId}/status`.
- JWT bearer authentication; only `GET /health` and `POST /auth/login` are public.
- Errors use RFC 9457 Problem Details (`application/problem+json`) with a machine-readable `code`.
- Every pull request to `main` or `develop` runs Redocly lint on the contract (required status check).

### Alternatives considered
- **Code-first (generate the contract from the backend):** keeps code and contract in sync
  automatically, but the contract would only exist after the backend is written, which is too late for
  Sprint 2 design and test planning.
- **GraphQL:** flexible queries, but harder to express the explicit state transitions, idempotency and
  status codes that the order workflow relies on.

### Consequences
- Tests (S2-20, S2-21) and UI work (S2-28 to S2-32) can start before the backend exists.
- The implementation must be checked against the contract; a later sprint should add contract tests.

---

## ADR-004: Stock reservation and exactly-once consumption

**Status:** Proposed. The business rules come from decisions D-02 to D-06 and D-11, which are still
marked "pending confirmation" in `docs/sprint1-meeting-notes.md`. The locking strategy is a technical
recommendation.

### Context
`available = onHand - reserved`. Two waiters can order the last portion at the same time. A chef can
press "start preparation" twice. Partial updates would leave stock wrong (NFR-03, NFR-04).

### Decision
1. **Create order (`POST /orders`):** one transaction locks the affected `inventory` rows with
   `SELECT … FOR UPDATE` in a stable order (ascending ingredient id), re-checks `available` for every
   ingredient, then saves the `PENDING` order, one `ACTIVE` reservation per order item and ingredient
   and the higher `reserved`. If any ingredient is short, everything rolls back and the API returns
   `409 INSUFFICIENT_STOCK`.
2. **Start preparation (`PENDING → PREPARING`):** one transaction locks the order row and then the
   stock rows in the same stable order, checks the current status, changes `ACTIVE` reservations to
   `CONSUMED` and lowers `onHand` and `reserved` by the same amount. A repeat with the same
   `Idempotency-Key` and body returns the saved response with `Idempotent-Replayed: true` (ADR-005);
   any other repeat finds the order no longer `PENDING` and gets `409 INVALID_STATUS_TRANSITION`.
   Stock is not touched again in either case.
3. **Ready:** no stock movement.
4. **Pending cancellation:** `ACTIVE → RELEASED`, `reserved` goes down, `onHand` is unchanged.
   **Late cancellation** (`PREPARING` or `READY`) does not restore stock (ADR-006).
5. The invariant `onHand >= reserved >= 0` is enforced by `CHECK` constraints; a partial unique index
   on `stock_movements(reservation_id) WHERE type = 'CONSUME'` prevents a second consumption.
6. A deadlock or serialization failure retries the whole transaction a bounded number of times; no
   partial effect is ever committed.

### Alternatives considered
- **Optimistic locking (version column and retry):** fewer locks, but many retries when popular items
  run low. Pessimistic row locks are simpler to reason about at MVP scale.
- **`SERIALIZABLE` isolation for everything:** correct, but higher abort rates and harder error
  handling than locking only the rows involved.
- **Deducting stock at `READY`:** rejected by D-11; stock is consumed when preparation starts.

### Consequences
- Correctness depends on every stock-changing path (orders, adjustments) using the same lock order.
- Proposed NFR-02 (95% of order transactions within 3 s for 20 concurrent users) must be measured
  once the backend exists; lock contention is the main risk.
- Required tests: concurrent last-portion orders, double "start preparation", start/cancel race,
  rollback on shortage (S2-21).
- These rules can only be verified on a real PostgreSQL server; S2-27 (PR #37) plans an integration
  test job with a PostgreSQL service container for this.

---

## ADR-005: Persistent idempotency keys

**Status:** Proposed – implementation design for the contract's `Idempotency-Key` rules.

### Context
Waiters on weak Wi-Fi retry requests. A retried `POST /orders` must not create a second order, and a
retried `PREPARING` request must not deduct stock twice (FR-15, FR-16, NFR-05). The contract requires
the header on `POST /orders`, makes it optional on `PATCH /orders/{orderId}/status` and keeps keys for
24 hours.

### Decision
- Keys are stored in `idempotency_records` with primary key `(user_id, operation_scope,
  idempotency_key)`; the status operation scope includes the order id.
- The key and a hash of the request body are claimed in the same transaction as the business effect.
  The response status, body and headers are saved on success.
- Same key and same body: the saved response is returned with `Idempotent-Replayed: true`.
  Same key and different body: `422 IDEMPOTENCY_KEY_REUSED`.
- A second request with the same key while the first is still running waits on the key row. When
  the first commits, it receives the saved response with `Idempotent-Replayed: true`; when the first
  rolls back, it is processed normally. There is no separate "in progress" response (QA review on
  PR #82, D-04).
- A rollback also removes the claim, so a failed request never leaves a permanently locked key.
- Records older than 24 hours are removed by a scheduled task in the `api` container (S2-23, S2-27).

### Alternatives considered
- **In-memory cache (for example Redis):** fast, but adds a component and loses keys on restart; it
  also cannot share the database transaction with the order.
- **Relying only on status checks:** enough to prevent a double deduction, but not to prevent a
  duplicate order from a retried `POST`.

### Consequences
- Every write that uses a key costs one extra row in the same transaction.
- The cleanup task must exist before production-like demos; S2-27 (PR #37) plans it.

---

## ADR-006: Roles, permissions and late cancellation

**Status:** Accepted for the cancellation policy (decision D-12, approved by the team on
2026-11-04). Restricting order creation to WAITER is Proposed in PR #62.

### Context
The system has three staff actors. Some waiters may cancel orders after preparation has started; the
team did not want a fourth role for that. Exceptional actions must be traceable (NFR-06, NFR-08).

### Decision
- Roles: `WAITER`, `CHEF`, `MANAGER`. One extra permission: `ORDER_LATE_CANCEL`.
- Order creation: WAITER (PR #62). Start preparation and mark ready: CHEF.
- Pending cancellation: WAITER or MANAGER. Late cancellation (`PREPARING` or `READY`): MANAGER, or
  WAITER with `ORDER_LATE_CANCEL`; a reason of 3–500 characters is required.
- Late cancellation never restores consumed stock and never releases reservations again. Corrections
  are separate manager adjustments (`LATE_CANCELLATION_CORRECTION`).
- Every check runs on the server. The JWT carries role and permissions; the UI may hide actions, but
  hiding is never the protection.
- Late cancellations, stock adjustments, recipe changes and permission changes write immutable audit
  entries; PR #62 adds ingredient deactivation and reactivation to this list.

### Alternatives considered
- **A separate "Senior Waiter" role:** clearer in the UI, but more role combinations to test and
  maintain for one extra right.
- **Automatic stock restore on late cancellation:** rejected by D-12 because the food was already
  prepared or partly used.

### Consequences
- Authorization tests must cover each role and the permission flag (positive and negative cases).
- Changing who may create orders (PR #62) also requires the SRS, use case diagram and tests to agree.

---

## ADR-007: Immutable recipe versions and order snapshots

**Status:** Proposed. Based on decision D-07 (pending confirmation).

### Context
Managers change recipes while orders are open. An order must keep the quantities it was accepted with,
and history must stay readable after a menu item or ingredient is renamed.

### Decision
- Every recipe change inserts a new version; old versions are never updated. A partial unique index
  allows at most one current version per menu item.
- Each order item stores `recipeVersion`, the menu item name and the unit price at ordering time.
- Each reservation stores the ingredient name, unit and quantity at reservation time.
- New recipe versions may only reference active ingredients (`422 INGREDIENT_INACTIVE`).

### Alternatives considered
- **Updating recipes in place:** simpler, but existing reservations would no longer match their recipe
  and reports would change retroactively.

### Consequences
- Recipe tables grow with every change; this is acceptable at restaurant scale.
- Reads of "the current recipe" must always filter on the current version.

---

## ADR-008: No hard deletes for referenced data

**Status:** Proposed – part of PR #62 (API v0.2.0).

### Context
Orders, reservations, stock movements and audit entries refer to users, menu items and ingredients.
Deleting a referenced row would either fail on a foreign key or break history. Backlog US-02 asks for
ingredients to be deactivated, and AC 6 says deactivation must not invalidate historical orders.

### Decision
- Users are deactivated (`active: false`), menu items are archived, ingredients are deactivated with
  `DELETE /ingredients/{ingredientId}` used as a soft delete (MANAGER only).
- Foreign keys use `ON DELETE RESTRICT`.
- An inactive ingredient keeps its stock record and history. It cannot be used in new recipe versions;
  menu items whose current recipe uses it cannot be ordered. `PENDING` orders created before the
  deactivation finish normally.

### Alternatives considered
- **Hard delete only when unused (the Sprint 1 contract):** keeps the table small, but most
  ingredients are used somewhere, so the operation would almost always fail and US-02 could not be met.
- **Cascade delete:** would silently remove order and stock history; rejected.

### Consequences
- Queries for new orders and new recipes must filter on `active`.
- Reactivation is possible with `PUT /ingredients/{ingredientId}` and is audited.

---

## ADR-009: Initial stock entered at ingredient creation

**Status:** Rejected – consistency review CR-01 (PR #68). The proposal is kept for traceability.

### Context
The Sprint 1 backlog (US-02 AC 1) let the manager enter a quantity when creating an ingredient, while
the Sprint 1 contract required a separate `POST /inventory/adjustments` call. Every stock change must
stay traceable (US-04, NFR-08).

### Proposed decision (rejected)
`POST /ingredients` would accept an optional `initialQuantity` and write the ingredient, its stock row
and an `ADJUSTMENT` / `INITIAL_STOCK` movement in one transaction.

### Why it was rejected
The Sprint 2 requirements resolved the same gap the other way: SRS FR-02 (PR #54), the refined backlog
US-02 AC 1 (PR #55) and Figma frame 04d all start a new ingredient at zero stock and record the opening
stock through a separate adjustment. Following the requirements baseline keeps one rule for every stock
change.

### Outcome
- `POST /ingredients` creates the ingredient and its stock row with `onHand = 0` (PR #62).
- The opening stock is entered with `POST /inventory/adjustments` and reason `INITIAL_STOCK`, which
  writes the `ADJUSTMENT` movement and the `STOCK_ADJUSTED` audit entry like any other adjustment.
- The manager screen needs two steps (create, then adjust); Figma 04d already shows this.

---

## ADR-010: Kitchen board refresh by polling

**Status:** Accepted – recorded as a team decision in `docs/architecture/infrastructure-requirements.md`
(S2-23).

### Context
The chef's screen has to show new `PENDING` orders. The MVP has a handful of concurrent users.

### Decision
The kitchen board polls `GET /v1/orders?status=PENDING&sort=createdAt` every 15 to 30 seconds. No
WebSocket or server-sent events in the MVP.

### Alternatives considered
- **WebSockets or server-sent events:** instant updates, but extra connection handling in the backend
  and in the reverse proxy, and more to test.

### Consequences
- A new order can take up to the polling interval to appear in the kitchen; acceptable for the MVP.
- If the delay becomes a problem, server-sent events can be added later without changing the REST
  contract.

---

## ADR-011: Container-based deployment and version pinning

**Status:** Proposed – depends on S2-23 and S2-27 (Emre Boz).

### Context
The final demo must start on a clean machine (IR-01). The infrastructure requirements leave the
PostgreSQL version and container image open and point to this ADR.

### Decision
- The system runs as containers started with `docker compose up`: a `web` container (built React files
  plus a reverse proxy for `/v1`), an `api` container (NestJS) and a `db` container (PostgreSQL with a
  named volume).
- Versions are pinned once, in the Sprint 3 project skeleton, with these rules: a Node.js release that
  is in Active LTS at that time, and a PostgreSQL major version that is still supported by the
  PostgreSQL project. Images are referenced by exact tag; npm dependencies are locked with a lock file.
- Until then, documents refer to "Node.js LTS" and "PostgreSQL" without a version number.

### Alternatives considered
- **Picking versions now:** gives certainty earlier, but the backend skeleton does not exist yet and
  the choice could not be tested.
- **A managed cloud database:** less setup, but adds cost and network dependency for the demo.

### Consequences
- S2-27 (PR #37) has a versions table that is filled with the Sprint 3 skeleton; this ADR is then
  followed by a new record that names the versions.

---

## Open questions

| Question | Owner | Needed for |
|---|---|---|
| Team confirmation of D-01 to D-11 (affects ADR-004 and ADR-007) | Bilgesu (meeting record), whole team | Changing those records to Accepted |
| Review and merge of PR #62 (affects ADR-006 and ADR-008) | Emre, Tuğçe, Beyzanur, Burcu | Changing those records to Accepted |
| Final demo host: team laptop or cloud VM | Emre, Bilgesu | ADR-011 |
| Written record of the React + NestJS + PostgreSQL choice (ADR-001) | Bilgesu (S2-08), Ayşe | Source for ADR-001 |

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-11-18 | Ayşe Dural | First ADR set for S2-16 (ADR-001 to ADR-011) |
| 0.2 | 2026-11-18 | Ayşe Dural | ADR-009 rejected after consistency review CR-01 (PR #68); added the Rejected status |
| 0.3 | 2026-11-18 | Ayşe Dural | Emre's review: ADR-001 source note, HTTP/HTTPS per IR-10 (ADR-003), PostgreSQL integration tests (ADR-004), cleanup task and versions table in S2-27 (ADR-005, ADR-011) |
