# PantryChef – Database Schema

| Field | Value |
|---|---|
| Task | S2-15 ER Diagram & Database Schema |
| Owner | Ayşe Dural – Lead Software Architect and Technical Lead |
| Reviewer | Emre Boz (Sprint 2 final task table v2.0) |
| Date | 2026-11-18 |
| Status | Draft – pending review |
| Database | PostgreSQL (version pinned in Sprint 3, see ADR-011) |
| Related artifacts | ER diagram `docs/architecture/database/PantryChef_ER.drawio` and API contract v0.2.0 (both in PR #62), [`api/openapi.yaml`](../../api/openapi.yaml), `docs/architecture/architecture-decisions.md` (PR #64) |

This document is the textual companion of the ER diagram. It lists every table, the keys and
constraints, the rules that the database enforces and the rules that the service must enforce, and a
proposed PostgreSQL DDL. It follows the API contract v0.2.0 (ingredient soft delete, opening stock
through a separate `INITIAL_STOCK` adjustment, order creation by WAITER).

> This is a proposed schema. No migration has been run against a database yet; the DDL is checked
> for consistency in this document only (see [section 10](#10-validation-and-open-points)).

## 1. Conventions

| Topic | Rule |
|---|---|
| Naming | Tables and columns in `snake_case`; the API uses `camelCase` (mapping in [section 9](#9-api-to-column-mapping)). |
| Identifiers | `uuid`, generated with `gen_random_uuid()`. `orders.order_number` is a human-friendly `bigint` identity. |
| Time | `timestamptz`, stored in UTC; the API returns ISO 8601 `date-time`. |
| Quantities | `numeric` (no float). Prices and totals `numeric(12,2)`, in Turkish lira. |
| Enumerations | `text` with a `CHECK (... IN (...))` list. Adding a value is a one-line migration. |
| Nullability | Columns are `NOT NULL` unless the ER diagram marks them with `?`. |
| Deletion | No hard deletes for referenced data (ADR-008). Every foreign key is `ON DELETE RESTRICT`. |
| Updates | `updated_at` is set by the service in the same statement that changes the row. |

## 2. Tables

| Table | Purpose | API schema |
|---|---|---|
| `users` | Staff accounts, role, active flag, password hash | `User` |
| `user_permissions` | Extra permissions per user (`ORDER_LATE_CANCEL`) | `User.permissions` |
| `menu_items` | Orderable dishes; archived with `active = false` | `MenuItem` |
| `recipes` | Immutable recipe versions per menu item | `Recipe` |
| `recipe_lines` | Ingredient quantities per portion for one recipe version | `RecipeLine` |
| `ingredients` | Ingredient catalogue; deactivated with `active = false` | `Ingredient` |
| `inventory` | One stock row per ingredient: `on_hand`, `reserved`, derived `available` | `InventoryItem` |
| `orders` | Order header, status, timestamps and cancellation data | `Order`, `Cancellation` |
| `order_items` | Ordered menu items with name, price and recipe version snapshot | `OrderItem` |
| `reservations` | Ingredient reservation per order item; `ACTIVE`, `CONSUMED` or `RELEASED` | `Reservation` |
| `order_status_history` | Every status change of an order | `StatusChange` |
| `stock_movements` | Immutable history of reserve, release, consume and adjustment effects | `StockMovement` |
| `audit_logs` | Sensitive operations: actor, time, reason, details | `AuditLogEntry` |
| `idempotency_records` | Stored requests and responses for `Idempotency-Key` replays | (headers) |

## 3. Relationships

| Parent | Child | Cardinality | Key |
|---|---|---|---|
| `menu_items` | `recipes` | 1 to 1..n versions | `recipes.menu_item_id` |
| `recipes` | `recipe_lines` | 1 to 1..n | `(menu_item_id, recipe_version)` |
| `ingredients` | `recipe_lines` | 1 to 0..n | `recipe_lines.ingredient_id` |
| `ingredients` | `inventory` | 1 to 1 | `inventory.ingredient_id` (PK and FK) |
| `orders` | `order_items` | 1 to 1..n | `order_items.order_id` |
| `recipes` | `order_items` | 1 to 0..n | `(menu_item_id, recipe_version)` |
| `order_items` | `reservations` | 1 to 1..n | `(order_id, order_item_id)` → `order_items(order_id, id)` |
| `ingredients` | `reservations` | 1 to 0..n | `reservations.ingredient_id` |
| `orders` | `order_status_history` | 1 to 1..n | `order_status_history.order_id` |
| `inventory` | `stock_movements` | 1 to 0..n | `stock_movements.ingredient_id` |
| `reservations` | `stock_movements` | 0..1 to 0..n | `(reservation_id, order_id, ingredient_id)` |
| `users` | `user_permissions`, `orders`, `recipes`, `order_status_history`, `stock_movements`, `audit_logs`, `idempotency_records` | 1 to 0..n | `*_by`, `actor_id`, `user_id` |

"At least one child" (a recipe has one or more lines, an order has one or more items) cannot be
expressed with a foreign key; the service checks it inside the creating transaction.

## 4. Table notes

**`users`** – `username` is unique and follows the API pattern `^[a-z0-9._-]+$` (3–50 characters).
Only a secure password hash is stored, never the password. Users are deactivated, not deleted.

**`menu_items`** – `active = false` means archived: it cannot be ordered, but historical order items
still point to it.

**`recipes` / `recipe_lines`** – Primary key `(menu_item_id, version)`. Every change inserts a new
version with `is_current = true` and sets the previous one to `false` in the same transaction. A
partial unique index allows at most one current version per menu item. Lines are never updated.

**`ingredients`** – `name` is unique, including inactive ingredients (`409 DUPLICATE_RESOURCE`).
`active = false` is the soft delete from `DELETE /ingredients/{ingredientId}`.

**`inventory`** – `available` is a stored generated column (`on_hand - reserved`) and is never written
directly. `CHECK (reserved >= 0 AND on_hand >= reserved)` guarantees that no successful write leaves
negative available stock.

**`orders`** – `order_number` is a generated identity. Cancellation columns are `NULL` until the order
is cancelled and are then all required (`previous_status`, `late_cancellation`, `cancelled_by`,
`cancelled_at`); a late cancellation also requires a reason of 3–500 characters.

**`order_items`** – Stores `menu_item_name_snapshot`, `unit_price` and `recipe_version` at ordering
time. `UNIQUE (order_id, id)` exists so that reservations can reference the pair.

**`reservations`** – One row per order item and ingredient. Snapshots of ingredient name and unit
keep history readable after an ingredient is renamed or deactivated. `resolved_at` is `NULL` exactly
while the reservation is `ACTIVE`.

**`stock_movements`** – Append-only. Order movements (`RESERVE`, `RELEASE`, `CONSUME`) must name the
order and the reservation; the composite foreign key guarantees that reservation, order and ingredient
belong together. `ADJUSTMENT` rows carry a reason and no reservation.

**`audit_logs`** – Append-only. `entity_id` is a logical reference qualified by `entity_type`, not a
foreign key, because it can point to different tables.

**`idempotency_records`** – Primary key `(user_id, operation_scope, idempotency_key)`. The scope of a
status change includes the order id. Rows older than 24 hours are deleted by a cleanup job; this is
the only table where rows are removed.

## 5. Proposed DDL

```sql
-- PantryChef schema, proposed for PostgreSQL 13 or later (gen_random_uuid() is built in).
-- Order of creation follows the foreign keys.

CREATE TABLE users (
    id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    username      varchar(50)  NOT NULL,
    full_name     varchar(100) NOT NULL,
    password_hash text         NOT NULL,
    role          text         NOT NULL,
    active        boolean      NOT NULL DEFAULT true,
    created_at    timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT ck_users_username CHECK (username ~ '^[a-z0-9._-]{3,50}$'),
    CONSTRAINT ck_users_full_name CHECK (char_length(full_name) >= 1),
    CONSTRAINT ck_users_role CHECK (role IN ('WAITER', 'CHEF', 'MANAGER'))
);

CREATE TABLE user_permissions (
    user_id    uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    permission text NOT NULL,
    CONSTRAINT pk_user_permissions PRIMARY KEY (user_id, permission),
    CONSTRAINT ck_user_permissions_permission CHECK (permission IN ('ORDER_LATE_CANCEL'))
);

CREATE TABLE menu_items (
    id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    name        varchar(100)  NOT NULL,
    description varchar(500),
    price       numeric(12,2) NOT NULL,
    active      boolean       NOT NULL DEFAULT true,
    created_at  timestamptz   NOT NULL DEFAULT now(),
    updated_at  timestamptz   NOT NULL DEFAULT now(),
    CONSTRAINT ck_menu_items_name CHECK (char_length(name) >= 1),
    CONSTRAINT ck_menu_items_price CHECK (price >= 0)
);

CREATE TABLE ingredients (
    id                  uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    name                varchar(100) NOT NULL,
    unit                text         NOT NULL,
    low_stock_threshold numeric      NOT NULL,
    active              boolean      NOT NULL DEFAULT true,
    created_at          timestamptz  NOT NULL DEFAULT now(),
    updated_at          timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT uq_ingredients_name UNIQUE (name),
    CONSTRAINT ck_ingredients_name CHECK (char_length(name) >= 1),
    CONSTRAINT ck_ingredients_unit CHECK (unit IN ('g', 'ml', 'piece')),
    CONSTRAINT ck_ingredients_threshold CHECK (low_stock_threshold >= 0)
);

CREATE TABLE inventory (
    ingredient_id uuid        PRIMARY KEY REFERENCES ingredients (id) ON DELETE RESTRICT,
    on_hand       numeric     NOT NULL DEFAULT 0,
    reserved      numeric     NOT NULL DEFAULT 0,
    available     numeric     GENERATED ALWAYS AS (on_hand - reserved) STORED,
    updated_at    timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_inventory_reserved CHECK (reserved >= 0),
    CONSTRAINT ck_inventory_on_hand CHECK (on_hand >= reserved)
);

CREATE TABLE recipes (
    menu_item_id uuid        NOT NULL REFERENCES menu_items (id) ON DELETE RESTRICT,
    version      integer     NOT NULL,
    is_current   boolean     NOT NULL,
    updated_by   uuid        NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    updated_at   timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT pk_recipes PRIMARY KEY (menu_item_id, version),
    CONSTRAINT ck_recipes_version CHECK (version >= 1)
);

CREATE TABLE recipe_lines (
    menu_item_id   uuid    NOT NULL,
    recipe_version integer NOT NULL,
    ingredient_id  uuid    NOT NULL REFERENCES ingredients (id) ON DELETE RESTRICT,
    quantity       numeric NOT NULL,
    CONSTRAINT pk_recipe_lines PRIMARY KEY (menu_item_id, recipe_version, ingredient_id),
    CONSTRAINT fk_recipe_lines_recipe FOREIGN KEY (menu_item_id, recipe_version)
        REFERENCES recipes (menu_item_id, version) ON DELETE RESTRICT,
    CONSTRAINT ck_recipe_lines_quantity CHECK (quantity > 0)
);

CREATE TABLE orders (
    id                     uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number           bigint        GENERATED ALWAYS AS IDENTITY,
    status                 text          NOT NULL,
    table_label            varchar(20),
    note                   varchar(500),
    total_price            numeric(12,2) NOT NULL,
    created_by             uuid          NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at             timestamptz   NOT NULL DEFAULT now(),
    updated_at             timestamptz   NOT NULL DEFAULT now(),
    preparation_started_at timestamptz,
    ready_at               timestamptz,
    cancelled_by           uuid          REFERENCES users (id) ON DELETE RESTRICT,
    cancelled_at           timestamptz,
    cancel_reason          varchar(500),
    previous_status        text,
    late_cancellation      boolean,
    CONSTRAINT uq_orders_order_number UNIQUE (order_number),
    CONSTRAINT ck_orders_status CHECK (status IN ('PENDING', 'PREPARING', 'READY', 'CANCELLED')),
    CONSTRAINT ck_orders_total CHECK (total_price >= 0),
    CONSTRAINT ck_orders_previous_status
        CHECK (previous_status IS NULL OR previous_status IN ('PENDING', 'PREPARING', 'READY')),
    -- cancellation data is complete exactly when the order is cancelled
    CONSTRAINT ck_orders_cancellation CHECK (
        (status = 'CANCELLED'
            AND cancelled_by IS NOT NULL AND cancelled_at IS NOT NULL
            AND previous_status IS NOT NULL AND late_cancellation IS NOT NULL)
        OR
        (status <> 'CANCELLED'
            AND cancelled_by IS NULL AND cancelled_at IS NULL AND cancel_reason IS NULL
            AND previous_status IS NULL AND late_cancellation IS NULL)
    ),
    -- a late cancellation is a cancellation from PREPARING or READY
    CONSTRAINT ck_orders_late_flag
        CHECK (late_cancellation IS NULL OR late_cancellation = (previous_status IN ('PREPARING', 'READY'))),
    CONSTRAINT ck_orders_cancel_reason_length
        CHECK (cancel_reason IS NULL OR char_length(cancel_reason) BETWEEN 3 AND 500),
    CONSTRAINT ck_orders_late_reason
        CHECK (late_cancellation IS DISTINCT FROM true OR cancel_reason IS NOT NULL),
    CONSTRAINT ck_orders_preparation_time
        CHECK (status NOT IN ('PREPARING', 'READY') OR preparation_started_at IS NOT NULL),
    CONSTRAINT ck_orders_ready_time
        CHECK (status <> 'READY' OR ready_at IS NOT NULL)
);

CREATE TABLE order_items (
    id                      uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                uuid          NOT NULL REFERENCES orders (id) ON DELETE RESTRICT,
    menu_item_id            uuid          NOT NULL,
    recipe_version          integer       NOT NULL,
    menu_item_name_snapshot text          NOT NULL,
    quantity                integer       NOT NULL,
    unit_price              numeric(12,2) NOT NULL,
    note                    varchar(200),
    CONSTRAINT uq_order_items_order_id_id UNIQUE (order_id, id),
    CONSTRAINT fk_order_items_recipe FOREIGN KEY (menu_item_id, recipe_version)
        REFERENCES recipes (menu_item_id, version) ON DELETE RESTRICT,
    CONSTRAINT ck_order_items_quantity CHECK (quantity BETWEEN 1 AND 50),
    CONSTRAINT ck_order_items_unit_price CHECK (unit_price >= 0)
);

CREATE TABLE reservations (
    id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                 uuid        NOT NULL,
    order_item_id            uuid        NOT NULL,
    ingredient_id            uuid        NOT NULL REFERENCES ingredients (id) ON DELETE RESTRICT,
    ingredient_name_snapshot text        NOT NULL,
    unit_snapshot            text        NOT NULL,
    quantity                 numeric     NOT NULL,
    status                   text        NOT NULL,
    created_at               timestamptz NOT NULL DEFAULT now(),
    resolved_at              timestamptz,
    CONSTRAINT fk_reservations_order_item FOREIGN KEY (order_id, order_item_id)
        REFERENCES order_items (order_id, id) ON DELETE RESTRICT,
    CONSTRAINT uq_reservations_item_ingredient UNIQUE (order_item_id, ingredient_id),
    CONSTRAINT uq_reservations_id_order_ingredient UNIQUE (id, order_id, ingredient_id),
    CONSTRAINT ck_reservations_unit CHECK (unit_snapshot IN ('g', 'ml', 'piece')),
    CONSTRAINT ck_reservations_quantity CHECK (quantity > 0),
    CONSTRAINT ck_reservations_status CHECK (status IN ('ACTIVE', 'CONSUMED', 'RELEASED')),
    CONSTRAINT ck_reservations_resolved_at CHECK ((status = 'ACTIVE') = (resolved_at IS NULL))
);

CREATE TABLE order_status_history (
    id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    uuid         NOT NULL REFERENCES orders (id) ON DELETE RESTRICT,
    from_status text,
    to_status   text         NOT NULL,
    changed_by  uuid         NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    changed_at  timestamptz  NOT NULL DEFAULT now(),
    reason      varchar(500),
    CONSTRAINT ck_history_from_status
        CHECK (from_status IS NULL OR from_status IN ('PENDING', 'PREPARING', 'READY')),
    CONSTRAINT ck_history_to_status
        CHECK (to_status IN ('PENDING', 'PREPARING', 'READY', 'CANCELLED')),
    -- only the creation entry has no previous status, and it always creates a PENDING order
    CONSTRAINT ck_history_creation CHECK ((from_status IS NULL) = (to_status = 'PENDING'))
);

CREATE TABLE stock_movements (
    id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_id  uuid         NOT NULL REFERENCES inventory (ingredient_id) ON DELETE RESTRICT,
    order_id       uuid         REFERENCES orders (id) ON DELETE RESTRICT,
    reservation_id uuid,
    type           text         NOT NULL,
    quantity       numeric      NOT NULL,
    on_hand_after  numeric      NOT NULL,
    reserved_after numeric      NOT NULL,
    reason         text,
    note           varchar(500),
    performed_by   uuid         NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at     timestamptz  NOT NULL DEFAULT now(),
    -- reservation, order and ingredient must describe the same reservation
    CONSTRAINT fk_stock_movements_reservation FOREIGN KEY (reservation_id, order_id, ingredient_id)
        REFERENCES reservations (id, order_id, ingredient_id) ON DELETE RESTRICT,
    CONSTRAINT ck_stock_movements_type CHECK (type IN ('RESERVE', 'RELEASE', 'CONSUME', 'ADJUSTMENT')),
    CONSTRAINT ck_stock_movements_sign CHECK (
        (type = 'RESERVE' AND quantity > 0)
        OR (type IN ('RELEASE', 'CONSUME') AND quantity < 0)
        OR (type = 'ADJUSTMENT' AND quantity <> 0)
    ),
    CONSTRAINT ck_stock_movements_after CHECK (reserved_after >= 0 AND on_hand_after >= reserved_after),
    CONSTRAINT ck_stock_movements_order_link CHECK (
        (type <> 'ADJUSTMENT' AND order_id IS NOT NULL AND reservation_id IS NOT NULL)
        OR (type = 'ADJUSTMENT' AND reservation_id IS NULL)
    ),
    CONSTRAINT ck_stock_movements_reason CHECK (
        (type = 'ADJUSTMENT' AND reason IN ('INITIAL_STOCK', 'PURCHASE_RECEIVED',
            'PHYSICAL_COUNT_CORRECTION', 'WASTE', 'LATE_CANCELLATION_CORRECTION', 'OTHER'))
        OR (type <> 'ADJUSTMENT' AND reason IS NULL)
    )
);

CREATE TABLE audit_logs (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    action          text        NOT NULL,
    actor_id        uuid        NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    entity_type     text        NOT NULL,
    entity_id       uuid        NOT NULL,
    previous_status text,
    reason          text,
    details         jsonb       NOT NULL DEFAULT '{}'::jsonb,
    occurred_at     timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_audit_logs_action CHECK (action IN (
        'ORDER_CANCELLED', 'ORDER_LATE_CANCELLED', 'STOCK_ADJUSTED', 'RECIPE_UPDATED',
        'USER_PERMISSIONS_CHANGED', 'INGREDIENT_DEACTIVATED', 'INGREDIENT_REACTIVATED')),
    CONSTRAINT ck_audit_logs_entity_type CHECK (entity_type IN ('ORDER', 'INGREDIENT', 'MENU_ITEM', 'USER')),
    CONSTRAINT ck_audit_logs_previous_status
        CHECK (previous_status IS NULL OR previous_status IN ('PENDING', 'PREPARING', 'READY', 'CANCELLED')),
    CONSTRAINT ck_audit_logs_details CHECK (jsonb_typeof(details) = 'object')
);

CREATE TABLE idempotency_records (
    user_id          uuid        NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    operation_scope  text        NOT NULL,
    idempotency_key  text        NOT NULL,
    request_hash     bytea       NOT NULL,
    state            text        NOT NULL,
    response_status  smallint,
    response_body    jsonb,
    response_headers jsonb,
    created_at       timestamptz NOT NULL DEFAULT now(),
    completed_at     timestamptz,
    CONSTRAINT pk_idempotency_records PRIMARY KEY (user_id, operation_scope, idempotency_key),
    CONSTRAINT ck_idempotency_key_length CHECK (char_length(idempotency_key) BETWEEN 8 AND 64),
    CONSTRAINT ck_idempotency_state CHECK (state IN ('IN_PROGRESS', 'COMPLETED')),
    CONSTRAINT ck_idempotency_completed CHECK (
        (state = 'COMPLETED' AND response_status IS NOT NULL AND completed_at IS NOT NULL)
        OR (state = 'IN_PROGRESS' AND response_status IS NULL AND completed_at IS NULL)
    )
);

-- Partial unique indexes (business rules)
CREATE UNIQUE INDEX uq_recipes_one_current
    ON recipes (menu_item_id) WHERE is_current;
CREATE UNIQUE INDEX uq_stock_movements_one_consume
    ON stock_movements (reservation_id) WHERE type = 'CONSUME';

-- Query and foreign-key indexes
CREATE INDEX ix_orders_status_created_at        ON orders (status, created_at);
CREATE INDEX ix_orders_created_by               ON orders (created_by);
CREATE INDEX ix_order_items_order_id            ON order_items (order_id);
CREATE INDEX ix_order_items_recipe              ON order_items (menu_item_id, recipe_version);
CREATE INDEX ix_reservations_order_id           ON reservations (order_id);
CREATE INDEX ix_reservations_active_ingredient  ON reservations (ingredient_id) WHERE status = 'ACTIVE';
CREATE INDEX ix_recipe_lines_ingredient_id      ON recipe_lines (ingredient_id);
CREATE INDEX ix_stock_movements_ingredient_time ON stock_movements (ingredient_id, created_at);
CREATE INDEX ix_stock_movements_order_id        ON stock_movements (order_id);
CREATE INDEX ix_stock_movements_reservation     ON stock_movements (reservation_id, order_id, ingredient_id);
CREATE INDEX ix_order_status_history_order_time ON order_status_history (order_id, changed_at);
CREATE INDEX ix_audit_logs_occurred_at          ON audit_logs (occurred_at);
CREATE INDEX ix_audit_logs_entity_id            ON audit_logs (entity_id);
CREATE INDEX ix_idempotency_records_created_at  ON idempotency_records (created_at);
```

## 6. Database rules and service rules

| Rule | Enforced by | How |
|---|---|---|
| `available = on_hand - reserved`, never negative | Database | Generated column; `ck_inventory_on_hand`, `ck_inventory_reserved` |
| Quantities, prices and thresholds in range | Database | `CHECK` constraints mirroring the OpenAPI limits |
| Valid statuses, roles, units, reasons, audit actions | Database | `CHECK ... IN (...)` lists |
| At most one current recipe version per menu item | Database | `uq_recipes_one_current` |
| A reservation belongs to the order of its item | Database | `fk_reservations_order_item` |
| A movement's reservation, order and ingredient agree | Database | `fk_stock_movements_reservation` |
| A reservation is consumed at most once | Database | `uq_stock_movements_one_consume` |
| Cancellation data complete; late cancellation has a reason | Database | `ck_orders_cancellation`, `ck_orders_late_flag`, `ck_orders_late_reason` |
| `reserved = SUM(quantity) of ACTIVE reservations` | Service | Updated in the same transaction as the reservation change (cross-table rule) |
| Legal status transitions and who may perform them | Service | Status checked under `SELECT ... FOR UPDATE`; roles and permissions from the JWT |
| A recipe has at least one line; an order has at least one item | Service | Checked inside the creating transaction |
| New recipe versions use only active ingredients | Service | `422 INGREDIENT_INACTIVE` |
| Inactive menu items and recipes with inactive ingredients are not orderable | Service | `422 MENU_ITEM_UNAVAILABLE` |
| Ingredient and its stock row are created together | Service | One transaction (section 7) |
| Idempotency keys expire after 24 hours | Service | Scheduled cleanup on `created_at` |

## 7. Transaction outlines

Every outline runs in one transaction. Stock rows are always locked in ascending `ingredient_id`
order to avoid deadlocks (ADR-004). A deadlock or serialization failure retries the whole
transaction.

**Create ingredient (`POST /ingredients`)**
1. `INSERT INTO ingredients` (`active = true`).
2. `INSERT INTO inventory (ingredient_id)`; `on_hand` and `reserved` start at their default `0`.
3. The opening stock is a separate request: the stock adjustment below with reason `INITIAL_STOCK`
   (SRS FR-02, backlog US-02 AC 1, consistency review CR-01).

**Create order (`POST /orders`, WAITER)**
1. Claim the idempotency key (`INSERT ... ON CONFLICT DO NOTHING`); replay or reject if it exists.
2. Read the current recipe versions; reject inactive menu items or recipes with inactive ingredients.
3. `SELECT ... FROM inventory WHERE ingredient_id = ANY(...) ORDER BY ingredient_id FOR UPDATE`.
4. If any `available` is too low: roll back, `409 INSUFFICIENT_STOCK`.
5. Insert `orders` (`PENDING`), `order_items`, `reservations` (`ACTIVE`), `RESERVE` stock movements and
   the first `order_status_history` row; increase `inventory.reserved`.
6. Save the response in `idempotency_records` (`COMPLETED`) and commit.

**Start preparation (`PENDING → PREPARING`, CHEF)**
1. `SELECT ... FROM orders WHERE id = $1 FOR UPDATE`; status must be `PENDING`, otherwise `409`.
2. Lock the stock rows of the order's `ACTIVE` reservations in ingredient order.
3. Reservations `ACTIVE → CONSUMED` (`resolved_at = now()`); `on_hand` and `reserved` decrease by the
   same quantity; one `CONSUME` movement per reservation.
4. `orders.status = 'PREPARING'`, `preparation_started_at = now()`; history row; commit.

**Mark ready (`PREPARING → READY`, CHEF)** – lock the order, check the status, set `ready_at`, add a
history row. No stock change.

**Cancel a pending order (WAITER or MANAGER)** – lock the order and stock rows; reservations
`ACTIVE → RELEASED`; `reserved` decreases; one `RELEASE` movement each; fill the cancellation columns
with `late_cancellation = false`; history row; `ORDER_CANCELLED` audit entry.

**Late cancellation (`PREPARING`/`READY`, MANAGER or WAITER with `ORDER_LATE_CANCEL`)** – lock the order;
fill the cancellation columns with `late_cancellation = true` and the reason; history row;
`ORDER_LATE_CANCELLED` audit entry. No stock change.

**Stock adjustment (`POST /inventory/adjustments`, MANAGER)** – lock the stock row; reject with
`409 NEGATIVE_AVAILABLE_STOCK` if the new `on_hand` would be below `reserved`; update `on_hand`;
`ADJUSTMENT` movement; `STOCK_ADJUSTED` audit entry.

**Deactivate ingredient (`DELETE /ingredients/{id}`, MANAGER)** – `UPDATE ingredients SET active = false`;
`INGREDIENT_DEACTIVATED` audit entry. No other row changes; existing `ACTIVE` reservations continue.

## 8. Indexes

| Index | Serves |
|---|---|
| `ix_orders_status_created_at` | Kitchen board `GET /orders?status=PENDING&sort=createdAt`, order lists |
| `ix_reservations_active_ingredient` | Finding active reservations of an ingredient |
| `ix_recipe_lines_ingredient_id` | `GET /recipes?ingredientId=…`; recipes affected by a deactivation |
| `ix_stock_movements_ingredient_time` | `GET /inventory/movements?ingredientId=…` newest first |
| `ix_order_status_history_order_time` | `Order.statusHistory` |
| `ix_audit_logs_occurred_at`, `ix_audit_logs_entity_id` | `GET /audit-logs` by time and entity |
| `ix_idempotency_records_created_at` | 24-hour cleanup job |
| Other `ix_*` | Foreign-key columns; PostgreSQL does not index referencing columns automatically |

## 9. API to column mapping

Columns map one-to-one to the camelCase API fields (for example `on_hand` ↔ `onHand`), except:

| API field | Column |
|---|---|
| `Recipe.current` | `recipes.is_current` |
| `OrderItem.menuItemName` | `order_items.menu_item_name_snapshot` |
| `Reservation.ingredientName`, `Reservation.unit` | `reservations.ingredient_name_snapshot`, `reservations.unit_snapshot` |
| `Order.cancellation.previousStatus`, `.late`, `.reason`, `.cancelledBy`, `.cancelledAt` | `orders.previous_status`, `late_cancellation`, `cancel_reason`, `cancelled_by`, `cancelled_at` |
| `Order.statusHistory[]` | rows of `order_status_history` |
| `User.permissions[]` | rows of `user_permissions` |
| `InventoryItem.ingredientName`, `.unit`, `.lowStockThreshold`, `.ingredientActive` | joined from `ingredients` |
| `InventoryItem.lowStock` | computed: `ingredients.active AND available <= low_stock_threshold` |
| `MenuItem.availablePortions` | computed from the current recipe and `inventory.available`; `0` if a line uses an inactive ingredient |
| `*.createdBy`, `*.performedBy`, `*.changedBy`, `actor` (`UserSummary`) | joined from `users` |

## 10. Validation and open points

**Checked in this document**
- Every table, column, key and constraint of the ER diagram (pages 1–3, PR #62 version) appears in the
  DDL, and every DDL foreign key points to an existing primary or unique key.
- `CHECK` lists match the enumerations in `api/openapi.yaml` v0.2.0.

**Not yet done**
- The DDL has not been run on a PostgreSQL server. It should be applied as the first migration of the
  Sprint 3 backend skeleton and covered by integration tests for the constraints above (S2-21).

**Open points**

| Point | Owner |
|---|---|
| PostgreSQL version (ADR-011); the DDL needs 13 or later | Emre, Ayşe |
| Case-insensitive ingredient names (`UNIQUE (lower(name))`) instead of exact match | Burcu (requirement), Ayşe |
| ORM and migration tool; migrations run when the `api` container starts (S2-27, PR #37) | Ayşe, in the Sprint 3 skeleton |

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-11-18 | Ayşe Dural | First schema document for S2-15, aligned with the ER diagram and API v0.2.0 (PR #62) |
| 0.2 | 2026-11-18 | Ayşe Dural | Ingredient creation starts at `on_hand = 0`; opening stock through a separate `INITIAL_STOCK` adjustment (consistency review CR-01, PR #68) |
| 0.3 | 2026-11-18 | Ayşe Dural | ORM and migration tool owner aligned with S2-27 (PR #37) |
