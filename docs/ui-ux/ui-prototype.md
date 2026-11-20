# PantryChef – UI Prototype Description

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-33 – Figma Links & UI Documentation (supports S2-28, S2-29)
**Owner:** Tuğçe Çevik · **Reviewer:** Bilgesu Nacak
**Status:** Draft

Frame names (`scr-…`) are the Figma frame names listed in [`figma-links.md`](figma-links.md). Order flow: `PENDING` → `PREPARING` → `READY`. `CANCELLED` is terminal. There is no delivery feature.

Status words used in this file:

- **Matches API 0.2.0** – the frame agrees with `api/openapi.yaml` version 0.2.0, merged into `develop` with PR #62 (19 Nov). Earlier versions of this file called it "API draft". API 0.2.1 (PR #91, 20 Nov) changes wording only, with no schema change; the label is kept.
- **Added in Figma (20 Nov)** – the frame is part of the 39-frame export of 20 Nov 2026 (merged with PR #71). The seven frames of section 3a were reviewed by the product owner (PR #50 approval) and as static exports by the Scrum Master (PR #71 comment); see `ui-user-story-review.md` section 7.
- **Decision pending** – a formal team decision or record is still pending (for example an ADR still Proposed). Merged requirement and API text is recorded separately; this label does not mean that the matching implementation exists.
- **Applied in Figma** – the change exists in the live file and was checked on a screenshot. This is not a test of any backend.

## 1. Scope of the prototype

Three roles, 39 frames (Figma export of 20 Nov 2026). Seven optional frames on the page "04 Optional states - excluded" are not part of the delivery (see `figma-links.md` section 3).

| Role | Screens |
|---|---|
| All | Login, login error, session expired, common states (`scr-01-login`, `scr-01b-login-error`, `scr-01c-session-expired`, `scr-07a-states`) |
| Waiter | New order, My open orders, Orders (`scr-02a` to `scr-02d`, `scr-05c`, `scr-05f` to `scr-05h`) |
| Chef | Kitchen board (`scr-03a` to `scr-03e`) |
| Manager | Inventory and ingredient forms (`scr-04a` to `scr-04i`), Inventory history (`scr-04j`, `scr-04k`), Orders and audit log (`scr-05a` to `scr-05e`), Recipes and New menu item (`scr-06a`, `scr-06b`, `scr-06c`, `scr-06e`, `scr-06f`, `scr-06h`), Staff permissions (`scr-08a`) |

The 22 manager frames share one menu: Inventory / Recipes / Orders & audit / Staff permissions. The selected tab has a light-blue background.

Order creation exists **only on the waiter screen** (`scr-02a`). There is no manager screen to create an order; the manager views orders and cancels them (`scr-05a`, `scr-05b`, `scr-05d`).

Prototype-only aids: the Waiter / Chef / Manager buttons on the login frames and the "Preview as" switch on the orders frames. They exist only to move between roles in the demo.

The Waiter, Chef and Manager sections are independent, predefined Figma scenarios. Order IDs are reused, but an action in one section does not update another section, except for the prototype states below.

**Prototype states.** Some results are Figma variable states on the same frames. The PDF and PNG files show the start values; the results appear only in the clickable prototype. The full list is in `figma-links.md` section 2. In short: cancelling Pending #1042 shows it as `Cancelled` in the manager list and removes it from the waiter's open orders; Publish v4 shows Menemen v4 with Olive oil 20 ml and keeps the v1–v3 history; the Tomatoes adjustment shows on hand 14500, reserved 350, available 14150; creating Bulgur adds it with 0 on hand, reserved and available, and Adjust on Bulgur shows an `INITIAL_STOCK` opening-stock example.

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
| `scr-04d-inventory-new-ingredient` | Name, Unit, Low-stock threshold. Helper text below the threshold: "Starts with 0 stock. Add stock using Adjust." | API 0.2.0 has no `initialQuantity`: the ingredient starts with `onHand` 0 and the opening stock is a separate `INITIAL_STOCK` adjustment. (PR #62 head `dbb06be` had an optional `initialQuantity`; it was removed in `866122e`.) | Applied in Figma (18 Nov re-export). Matches API 0.2.0. |
| `scr-04e-new-ingredient-validation` | "Name is required." Same helper text; no Initial stock field | Client validation | Applied in Figma |
| `scr-04f-new-ingredient-duplicate` | `409 DUPLICATE_RESOURCE` ("An ingredient with this name already exists."). Same helper text; no Initial stock field | Names are unique, **including inactive ingredients**; reactivate an inactive one with `PUT` instead of creating it again | Applied in Figma. Matches API 0.2.0. |
| `scr-04g-inventory-edit-ingredient` | Edit: name, low-stock threshold, Unit locked ("Locked while the ingredient has stock or reservations."), Status **Active**, "Deactivate ingredient". Note: "Stock on hand changes only through an adjustment." | `PUT /ingredients/{id}` with `name`, `unit`, `lowStockThreshold`, `active` (all required). Unit change with stock or active reservations: `409 RESOURCE_IN_USE`. Stock changes only through Adjust. | Applied in Figma. Matches API 0.2.0. |
| `scr-04h-deactivate-confirm` | Confirmation text: history, stock records and existing pending orders are kept; no new recipes; menu items using it are closed to new orders; no low-stock alerts; can be reactivated | `DELETE /ingredients/{id}` is a **soft delete** and returns `200` with the ingredient (`active: false`); a repeat call changes nothing. Audit action `INGREDIENT_DEACTIVATED`. | Applied in Figma. Matches API 0.2.0. ADR-008 Accepted (PR #87). |
| `scr-04i-inventory-inactive-ingredient` | Ingredient Inactive: grey "Inactive" badge in the list and in the dialog, "Reactivate ingredient" | `PUT` with `active: true`. Audit action `INGREDIENT_REACTIVATED`. | Applied in Figma. Matches API 0.2.0. ADR-008 Accepted (PR #87). |

Inactive ingredients in API 0.2.0 (what the UI text relies on):

- History, stock row and movements stay. The stock stays visible in `GET /inventory` (`ingredientActive: false`) and can still be adjusted (for example `WASTE`).
- Existing `PENDING` orders keep their reservations.
- Not allowed in a new menu item or a new recipe version: `422 INGREDIENT_INACTIVE`.
- A menu item whose current recipe uses an inactive ingredient has `availablePortions` 0, and ordering it returns `422 MENU_ITEM_UNAVAILABLE` (shown in `scr-07a-states`).
- No low-stock alert (also SRS FR-14 since PR #89).

Two different things are shown on purpose: the stock badge **Out** (`available` is 0; for example Chicken breast) and the ingredient badge **Inactive** (the ingredient was deactivated). They are not the same state.

Edit ingredient never changes stock. Changing stock later uses the existing Adjust stock flow (`scr-04b`).

### Deactivate and Reactivate are separate from Save changes

In the prototype, **Deactivate ingredient** (04g → 04h → 04i) and **Reactivate ingredient** (04i → 04g) change the ingredient's state immediately. They are separate actions, not part of "Save changes". In the API they are their own requests (`DELETE`, or `PUT` with `active`). "Save changes" saves only name and low-stock threshold edits. The frames do not show a "pending change" state.

## 3. Order creation and cancellation

| Topic | Frames | Status |
|---|---|---|
| Only the waiter creates orders | `scr-02a`, `scr-02b`, `scr-02c`; no manager order screen | Applied in Figma. Matches SRS FR-06, backlog US-06 AC1 and API 0.2.0 (`createOrder` roles: WAITER; API README and UML agree), all merged into `develop`. F-07 in PR #50 records the earlier "Waiter or Manager" wording at `beba8c6`. ADR-006, including WAITER-only creation, is Accepted (PR #87). Hiding a UI action is not server-side authorization. |
| Waiter cancels a `PENDING` order | `scr-02a` → `scr-02d` → `scr-02a` | Applied in Figma |
| Manager cancels a `PENDING` order | `scr-05d` | Applied in Figma |
| Late cancel (`PREPARING` / `READY`): manager or waiter with `ORDER_LATE_CANCEL`; reason required, 3–500 characters (`422 CANCELLATION_REASON_REQUIRED`); stock is not restored | `scr-05b`, `scr-05f`, `scr-05e`, `scr-05h` | Applied in Figma. Matches API 0.2.0. |
| Waiter without permission | `scr-05c` (`403 LATE_CANCEL_NOT_PERMITTED`) | Applied in Figma. Matches API 0.2.0. |

Permissions for `ORDER_LATE_CANCEL` and the chef role are not changed by this prototype.

## 3a. Inventory history, new menu item and staff permissions (D-3, D-4, D-6)

The product owner decided on 20 Nov to include these views ([decision on PR #50](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). The frames were added to the Sprint 2 prototype in the 39-frame export. The API mapping below compares the frames with API 0.2.1; open API questions are listed in `ui-user-story-review.md` section 7b (merged with [PR #50](https://github.com/seng321-7th-team/PantryChef/pull/50)) and are not answered by the prototype. They stay open for Sprint 3.

| Frame | What it shows | API field or rule | Status |
|---|---|---|---|
| `scr-04j-stock-movements` | Inventory history, Stock movements tab. Rice sample: `ADJUSTMENT` (`INITIAL_STOCK`), `RESERVE`, `RELEASE`, `CONSUME`; change ("+50 g reserved", "-100 g on hand"), on hand after, reserved after, performed by, order or reason. Filters Ingredient, Order ID, Type, Date range. Note: late cancellation does not restore stock or create a stock movement. | `GET /inventory/movements` (MANAGER): `type`, signed `quantity`, `onHandAfter`, `reservedAfter`, `orderId`, `reason`, `performedBy`, `createdAt`; filters `ingredientId`, `orderId`, `type`, `from`, `to`. The movement has no ingredient name; the name comes from `GET /ingredients`. Orders are shown by a shortened order ID. | Added in Figma (20 Nov). Only the All types / RESERVE type filter is interactive. |
| `scr-04k-reservations` | Reservations tab. Rice sample: `ACTIVE`, `CONSUMED`, `RELEASED`; order ID, quantity, created, resolved ("Not resolved" while active), order item ID. Filters Ingredient, Order ID, Status. Note: one reservation is associated with an order item and an ingredient. | `GET /reservations` (MANAGER, CHEF): `orderId`, `orderItemId`, `ingredientName`, `quantity`, `unit`, `status`, `createdAt`, `resolvedAt`; filters `orderId`, `ingredientId`, `status`. One reservation per order item and ingredient (API 0.2.1 wording). | Added in Figma (20 Nov). |
| `scr-06c-new-menu-item` | Name *, Price (TRY) *, Description (optional), Active Yes; initial recipe lines with ingredient, quantity per portion and unit (read-only); "+ Add ingredient"; "Use each active ingredient once"; "At least one ingredient is required. The initial recipe is version 1." Cancel, Create menu item. | `POST /menu-items` (MANAGER), `MenuItemCreate`: `name`, `price`, `description`, `active`, `recipe.lines` (at least one, `ingredientId` + `quantity` > 0); recipe version 1. | Added in Figma (20 Nov). Fixed sample values; no free-form input. |
| `scr-06f-new-menu-item-validation` | Quantity 0 on the Rice line: "Quantity per portion must be greater than 0." | `quantity` must be greater than 0. The frame names no error code. | Added in Figma (20 Nov). |
| `scr-06e-menu-item-created` | Rice Bowl, 90.00 TRY, Active, "Initial recipe - v1", Rice 100 g per portion; Back to recipes, New menu item. With the Olive oil line added on `scr-06c`, the prototype also shows that line. | `201` with the created `MenuItem`; the recipe starts at version 1. | Added in Figma (20 Nov). |
| `scr-06h-recipes-after-create` | Recipes list with Rice Bowl (recipe v1); the row opens the saved detail `scr-06e`. | `GET /menu-items`, `GET /recipes/{menuItemId}` | Added in Figma (20 Nov). |
| `scr-08a-staff-permissions` | Active waiters Deniz Yilmaz (waiter01) and Elif Kaya (waiter02) with saved late-cancel access; "Allow late cancellation" toggle for Deniz Yilmaz. A change shows an unsaved-change message with Cancel and Save. Texts: "Other permissions and account details remain unchanged. Managers already have late-cancel access." | `GET /users?role=WAITER&active=true` (MANAGER); `PUT /users/{userId}` with the full `UserUpdate` (`fullName`, `role`, `permissions`, `active`), adding or removing `ORDER_LATE_CANCEL` and keeping the other values; audit action `USER_PERMISSIONS_CHANGED`. | Added in Figma (20 Nov). Only Deniz Yilmaz can be selected. Saving does not change the "Preview as" switch on the orders frames. |

## 4. Initial stock in SRS, backlog, API and Figma

| Source | What it says about initial stock |
|---|---|
| [SRS](https://github.com/seng321-7th-team/PantryChef/blob/e1976288f9cebfa80073159096ad625aef466f6b/docs/srs.md) FR-02 (merged, PR #54) | "Upon creation, its physical stock shall be initialized to zero. Initial stock shall be recorded through a separate authorized inventory adjustment." |
| [Backlog](https://github.com/seng321-7th-team/PantryChef/blob/e1976288f9cebfa80073159096ad625aef466f6b/docs/product-backlog.md) US-02 AC2–AC3 (merged, PR #55) | "Newly created ingredients have onHand = 0 and reserved = 0." "Initial physical stock is recorded separately through an authorized INITIAL_STOCK inventory adjustment." |
| [API 0.2.0](https://github.com/seng321-7th-team/PantryChef/blob/e1976288f9cebfa80073159096ad625aef466f6b/api/openapi.yaml) (merged, PR #62) | No `initialQuantity`; the ingredient starts at zero and the opening stock is entered with `POST /inventory/adjustments`, reason `INITIAL_STOCK`. (PR #62 head `dbb06be` had an optional `initialQuantity`; ADR-009 is Rejected.) |
| Figma `scr-04d` to `scr-04f` | No Initial stock field since the 18 Nov re-export (about 01:35); helper "Starts with 0 stock. Add stock using Adjust." The earlier 18 Nov export had an optional field. |

All four sources describe "start at zero, then adjust". Burcu confirmed CR-01 in [her PR #68 review](https://github.com/seng321-7th-team/PantryChef/pull/68#pullrequestreview-5957095073). Earlier checks used the unmerged heads #54 `0ad80b3`, #55 `ec1911a`/`beba8c6` and #62 `866122e` (historical). No requirement is changed by this UI documentation task.

## 5. States shown in `scr-07a-states`

Loading; empty waiter orders; empty kitchen board; server error 500 `INTERNAL_ERROR` ("We couldn't confirm the result. Refresh to check the latest status."); connection error; dish no longer available (422 `MENU_ITEM_UNAVAILABLE`). The frame is static and has no clickable path.

## 6. Not shown in the prototype

"Show inactive" filter for the inventory list; editing or archiving an existing menu item; staff account management beyond the late-cancel permission. Stock movements and reservation views, new menu item with its first recipe and the late-cancel permission are drawn since the 20 Nov export (section 3a).

## 7. Alignment checkpoint (20 Nov)

Status update of 21 Nov (`develop` at `46f918d`): SRS, refined backlog and API 0.2.1 are unchanged since `7270d63`. The schema (#66), the ADR status update (#87), this document set (#71), the user flows (#70) and the review (#50) are merged. ADR-006 and ADR-008 are Accepted; ADR-004, ADR-005 and ADR-007 stay Proposed. The D-3, D-4 and D-6 frames were reviewed by the product owner (PR #50 approval) and, as static exports, by the Scrum Master (PR #71 comment); no separate review is recorded for the U10–U12 flows. Their API questions stay open for Sprint 3. The checkpoint of 20 Nov below is kept as recorded.

Compared with `develop` at `7270d63` (20 Nov): SRS (PR #54), refined backlog (PR #55), FR/NFR (PR #51), API 0.2.0 and diagrams (PR #62), API 0.2.1 wording update (PR #91), SRS FR-14 clarification (PR #89), ADRs (PR #64) and the consistency review (PR #68) are merged; schema #66 is open. SRS and backlog are unchanged since the earlier check at `e197628`. The source hashes in older tables identify earlier checks.

- Core roles, zero-stock creation, stock reservation/consumption, cancellation, immutable recipes and 15–30 s polling align in the merged SRS, backlog and API.
- Order creation role: SRS FR-06, backlog US-06 AC1 and API 0.2.0 say WAITER (section 3); all merged. ADR-006 keeps it Proposed until PR #87.
- #68 records CR-04 (deactivate/reactivate views) as resolved. Those screens exist; the soft-delete API is merged, ADR-008 stays Proposed until PR #87.
- Recipe creation (FR-05/US-05, D-4), reservation/consumption history (FR-13/US-13, D-3) and the late-cancel permission (D-6) were decided by Burcu on 20 Nov and drawn in the 39-frame export (section 3a). Team review of these frames is pending. SRS §8 question 2 (scope of all `/users` operations) is not changed.
- **Prototype limits:** kitchen interactions cover order #1042 only (Mark as ready on #1042 leads to `scr-03e-kitchen-ready`; the other kitchen buttons are faded and not connected); login/role previews do not authenticate; no actual stock or audit mutations occur; fields use fixed sample values. Variable states show one example of each action (section 1) and are not unlimited create, update or delete operations. Expected behavior in the flow document is distinct from a tested prototype transition.
- Inactive ingredients raise no low-stock alerts: stated in SRS FR-14 (PR #89) and the API. `scr-04h` states it; no implementation or test covers it yet. #68 (merged) records CR-03 as resolved.
- The UI supports NFR-09/10 design review; it does not prove performance, concurrent correctness, real authorization, rollback, automated test coverage or Chrome/Firefox application compatibility. PR #50 contains the current FR/NFR evidence matrix.
