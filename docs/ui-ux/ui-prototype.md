# PantryChef – UI Prototype Description

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-33 – Figma Links & UI Documentation (supports S2-28, S2-29)
**Owner:** Tuğçe Çevik · **Reviewer:** Bilgesu Nacak
**Status:** Draft

Frame names (`scr-…`) are the Figma frame names listed in [`figma-links.md`](figma-links.md). Order flow: `PENDING` → `PREPARING` → `READY`. `CANCELLED` is terminal. There is no delivery feature.

Status words used in this file:

- **Matches API draft** – the frame agrees with the API draft in PR #62 (head `866122e`, version 0.2.0, not merged). `develop` still has version 0.1.0.
- **Decision pending** – a formal team/product-owner decision, review or merge is still pending. Current draft agreement and owner responses are recorded separately; this label does not mean that the matching draft implementation is absent.
- **Applied in Figma** – the change exists in the live file and was checked on a screenshot. This is not a test of any backend.

## 1. Scope of the prototype

Three roles, 32 frames.

| Role | Screens |
|---|---|
| All | Login, login error, session expired, common states (`scr-01-login`, `scr-01b-login-error`, `scr-01c-session-expired`, `scr-07a-states`) |
| Waiter | New order, My open orders, Orders (`scr-02a` to `scr-02d`, `scr-05c`, `scr-05f` to `scr-05h`) |
| Chef | Kitchen board (`scr-03a` to `scr-03e`) |
| Manager | Inventory and ingredient forms (`scr-04a` to `scr-04i`), Orders and audit log (`scr-05a` to `scr-05e`), Recipes (`scr-06a`, `scr-06b`) |

Order creation exists **only on the waiter screen** (`scr-02a`). There is no manager screen to create an order; the manager views orders and cancels them (`scr-05a`, `scr-05b`, `scr-05d`).

Prototype-only aids: the Waiter / Chef / Manager buttons on the login frames and the "Preview as" switch on the orders frames. They exist only to move between roles in the demo.

The Waiter, Chef and Manager sections are independent, predefined Figma scenarios. Order IDs are reused, but an action in one section does not update another section.

### Kitchen board (Chef)

| Frame | What it shows | Counters (Pending / Preparing / Ready) |
|---|---|---|
| `scr-03a-kitchen-board` | #1042 under `Pending`, "Start preparing" | 3 / 1 / 1 |
| `scr-03b-kitchen-deducting` | "Deducting stock…" on #1042 only (simulated state) | 3 / 1 / 1 |
| `scr-03c-kitchen-preparing` | #1042 under `Preparing`, "Stock deducted once", "Mark as ready" | 2 / 2 / 1 |
| `scr-03d-kitchen-conflict` | "Order #1042 was already started" (`INVALID_STATUS_TRANSITION`), board refreshed; "Mark as ready" on #1042 | 2 / 2 / 1 |
| `scr-03e-kitchen-ready` | #1042 under `Ready`, "No additional stock was deducted" | 2 / 1 / 2 |

Prototype path: `scr-03a` → Start preparing on #1042 → `scr-03b` → `scr-03c` → Mark as ready on #1042 → `scr-03e`. Flow 6 starts at `scr-03d`; Mark as ready on #1042 leads to `scr-03e`. Prototype navigation and displayed counters verified on 18 November 2026 for both paths; result screenshots recorded. This covers the prototype only, not stock changes or backend behavior.

Demo interactions cover order #1042 only. Start preparing on #1040 and #1043 and Mark as ready on #1041 are drawn at 40% opacity and have no prototype connection. This is a limit of the prototype demo. In the application, any `PENDING` order can be started and any `PREPARING` order can be marked as ready by an authorized user (`PATCH /orders/{orderId}/status`; an invalid transition returns `409 INVALID_STATUS_TRANSITION`).

## 2. Ingredient forms (API mapping)

| Frame | What it shows | API field or rule | Status |
|---|---|---|---|
| `scr-04d-inventory-new-ingredient` | Name, Unit, Low-stock threshold. Helper text below the threshold: "Starts with 0 stock. Add stock using Adjust." | API draft #62 at `866122e` (unchanged in `cb634c3`) has no `initialQuantity`: the ingredient starts at zero and the opening stock is a separate `INITIAL_STOCK` adjustment. (Head `dbb06be` had an optional `initialQuantity`.) | Applied in Figma (18 Nov re-export). Matches API draft. |
| `scr-04e-new-ingredient-validation` | "Name is required." Same helper text; no Initial stock field | Client validation | Applied in Figma |
| `scr-04f-new-ingredient-duplicate` | `409 DUPLICATE_RESOURCE` ("An ingredient with this name already exists."). Same helper text; no Initial stock field | Names are unique, **including inactive ingredients**; reactivate an inactive one with `PUT` instead of creating it again | Applied in Figma. Matches API draft. |
| `scr-04g-inventory-edit-ingredient` | Edit: name, low-stock threshold, Unit locked ("Locked while the ingredient has stock or reservations."), Status **Active**, "Deactivate ingredient". Note: "Stock on hand changes only through an adjustment." | `PUT /ingredients/{id}` with `name`, `unit`, `lowStockThreshold`, `active` (all required). Unit change with stock or active reservations: `409 RESOURCE_IN_USE`. Stock changes only through Adjust. | Applied in Figma. Matches API draft. |
| `scr-04h-deactivate-confirm` | Confirmation text: history, stock records and existing pending orders are kept; no new recipes; menu items using it are closed to new orders; no low-stock alerts; can be reactivated | `DELETE /ingredients/{id}` is a **soft delete** and returns `200` with the ingredient (`active: false`); a repeat call changes nothing. Audit action `INGREDIENT_DEACTIVATED`. | Applied in Figma. Matches API draft. **Decision pending.** |
| `scr-04i-inventory-inactive-ingredient` | Ingredient Inactive: grey "Inactive" badge in the list and in the dialog, "Reactivate ingredient" | `PUT` with `active: true`. Audit action `INGREDIENT_REACTIVATED`. | Applied in Figma. Matches API draft. **Decision pending.** |

Inactive ingredients in the API draft (what the UI text relies on):

- History, stock row and movements stay. The stock stays visible in `GET /inventory` (`ingredientActive: false`) and can still be adjusted (for example `WASTE`).
- Existing `PENDING` orders keep their reservations.
- Not allowed in a new menu item or a new recipe version: `422 INGREDIENT_INACTIVE`.
- A menu item whose current recipe uses an inactive ingredient has `availablePortions` 0, and ordering it returns `422 MENU_ITEM_UNAVAILABLE` (shown in `scr-07a-states`).
- No low-stock alert.

Two different things are shown on purpose: the stock badge **Out** (`available` is 0; for example Chicken breast) and the ingredient badge **Inactive** (the ingredient was deactivated). They are not the same state.

Edit ingredient never changes stock. Changing stock later uses the existing Adjust stock flow (`scr-04b`).

### Deactivate and Reactivate are separate from Save changes

In the prototype, **Deactivate ingredient** (04g → 04h → 04i) and **Reactivate ingredient** (04i → 04g) change the ingredient's state immediately. They are separate actions, not part of "Save changes". In the API draft they are their own requests (`DELETE`, or `PUT` with `active`). "Save changes" saves only name and low-stock threshold edits. The frames do not show a "pending change" state.

## 3. Order creation and cancellation

| Topic | Frames | Status |
|---|---|---|
| Only the waiter creates orders | `scr-02a`, `scr-02b`, `scr-02c`; no manager order screen | Applied in Figma. Matches SRS #54 FR-06 and API draft #62 (`createOrder` roles: WAITER; API, API README and UML agree). Backlog #55 US-06 AC1 at `986583e` also says WAITER only (aligned in drafts; F-07 in PR #50 records the earlier "Waiter or Manager" wording at `beba8c6`). Re-review of #55 and the merges are pending; `develop` 0.1.0 still lists WAITER and MANAGER. Hiding a UI action is not server-side authorization. |
| Waiter cancels a `PENDING` order | `scr-02a` → `scr-02d` → `scr-02a` | Applied in Figma |
| Manager cancels a `PENDING` order | `scr-05d` | Applied in Figma |
| Late cancel (`PREPARING` / `READY`): manager or waiter with `ORDER_LATE_CANCEL`; reason required, 3–500 characters (`422 CANCELLATION_REASON_REQUIRED`); stock is not restored | `scr-05b`, `scr-05f`, `scr-05e`, `scr-05h` | Applied in Figma. Matches API 0.1.0. |
| Waiter without permission | `scr-05c` (`403 LATE_CANCEL_NOT_PERMITTED`) | Applied in Figma. Matches API 0.1.0. |

Permissions for `ORDER_LATE_CANCEL` and the chef role are not changed by this prototype.

## 4. Initial stock in SRS, backlog, API and Figma

| Source | What it says about initial stock |
|---|---|
| SRS draft (PR #54, head `0ad80b3`), FR-02 | "Upon creation, its physical stock shall be initialized to zero. Initial stock shall be recorded through a separate authorized inventory adjustment." |
| Backlog draft (PR #55, head `ec1911a`), US-02 AC1 | A manager can create an ingredient with name, unit and threshold. "Initial physical stock is recorded separately through an authorized inventory adjustment." |
| API draft (PR #62, head `866122e`) | No `initialQuantity`; the ingredient starts at zero and the opening stock is entered with `POST /inventory/adjustments`, reason `INITIAL_STOCK`. (Head `dbb06be` had an optional `initialQuantity`; ADR-009 is Rejected in PR #64, head `07fd074`.) |
| Figma `scr-04d` to `scr-04f` | No Initial stock field since the 18 Nov re-export (about 01:35); helper "Starts with 0 stock. Add stock using Adjust." The earlier 18 Nov export had an optional field. |

All four sources now describe "start at zero, then adjust". Backlog #55 at `beba8c6` states it in US-02 AC2–AC3 ("Newly created ingredients have onHand = 0 and reserved = 0"; initial stock through a separate `INITIAL_STOCK` adjustment). Burcu confirmed CR-01 in [her PR #68 review](https://github.com/seng321-7th-team/PantryChef/pull/68#pullrequestreview-5957095073). Review and merge of SRS #54, backlog #55 and API #62 remain pending. No requirement is changed by this UI documentation task.

## 5. States shown in `scr-07a-states`

Loading; empty waiter orders; empty kitchen board; server error 500 `INTERNAL_ERROR` ("We couldn't confirm the result. Refresh to check the latest status."); connection error; dish no longer available (422 `MENU_ITEM_UNAVAILABLE`). The frame is static and has no clickable path.

## 6. Not shown in the prototype

Stock movements and reservation views, new menu item with its first recipe, staff and permission management, "Show inactive" filter for the inventory list. They depend on decisions D-3, D-4 and D-6 listed in [`ui-user-story-review.md`](https://github.com/seng321-7th-team/PantryChef/blob/432cc0866262441f749c544ed245be0ad192afff/docs/ui-ux/ui-user-story-review.md) (PR #50, commit `432cc08`) and are not drawn.

## 7. Alignment checkpoint (18 Nov)

Compared with SRS #54 `0ad80b3`, refined backlog #55 `986583e`, API/diagrams #62 `f061da2`, ADR #64 `60d1a8b` (merged into `develop` as `3688747`; the records keep their own Accepted/Proposed/Rejected status), schema #66 `fa446c1` and consistency review #68 `46e8d1c`. The earlier source hashes in the detailed tables identify the original checks; no merged status is inferred from them.

- Core roles, zero-stock creation, stock reservation/consumption, cancellation, immutable recipes and 15–30 s polling align in the drafts.
- Order creation role: SRS FR-06, backlog #55 US-06 AC1 and API #62 say WAITER (aligned in drafts, section 3); review and merge pending.
- #68 records CR-04 (deactivate/reactivate views) as resolved. Those screens exist; approval of the underlying API draft is separate.
- Recipe creation (FR-05/US-05), complete reservation/consumption history (FR-13/US-13) and staff/permission assignment (SRS §8 question 2) remain open UI coverage questions for Burcu. Do not mark these requirements out of scope without her decision.
- **Prototype limits:** kitchen interactions cover order #1042 only (Mark as ready on #1042 leads to `scr-03e-kitchen-ready`; the other kitchen buttons are faded and not connected); Pending cancel returns a reused list; login/role previews do not authenticate; no actual stock or audit mutations occur. Expected behavior in the flow document is distinct from a tested prototype transition.
- The draft suppresses inactive low-stock alerts, while SRS FR-14 needs that exception clarified (#68 CR-03).
- The UI supports NFR-09/10 design review; it does not prove performance, concurrent correctness, real authorization, rollback, automated test coverage or Chrome/Firefox application compatibility. PR #50 contains the current FR/NFR evidence matrix.
