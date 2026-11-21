# PantryChef – Prototype Demo Scenario

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-33 – Figma Links & UI Documentation
**Owner:** Tuğçe Çevik · **Reviewer:** Bilgesu Nacak
**Status:** Draft

This is a click-through script for the Figma prototype (39 frames, export of 20 Nov 2026). It describes the intended prototype click path. It does not call any backend; errors and states are drawn frames or Figma variable states. Frame names are listed in [`figma-links.md`](figma-links.md).

**General demo start:** open the *General demo prototype* link in `figma-links.md`. It starts at `scr-01-login`. Choose a role with the prototype-only buttons (Waiter, Chef, Manager). The two Flow 8 / Flow 9 links start directly at their frames and are for short side demos. Flow 2 to Flow 7 and Flow 10 to Flow 13 can be opened from the flow list in the prototype sidebar.

Steps that follow `api/openapi.yaml` 0.2.0 are marked **(API 0.2.0)**; this version is on `develop` since PR #62 was merged (19 Nov). API 0.2.1 (PR #91, 20 Nov) changes wording only. Status of 21 Nov, checked on `develop` at `eb41d74`: SRS (PR #54), refined backlog (PR #55), ADRs (PR #64), consistency review (PR #68), schema (PR #66) and the ADR status update (PR #87) are merged. ADR-006 and ADR-008 are Accepted; ADR-004, ADR-005 and ADR-007 stay Proposed. SRS, backlog and API are unchanged since the earlier check at `7270d63` (20 Nov), when schema #66 was still open. A merged document is not an implementation claim.

**Scenario states:** The Waiter, Chef and Manager sections use independent, predefined Figma frames. Order IDs may be reused, but actions in one section do not update the other sections, except for the variable states listed in `figma-links.md` section 2 (for example, cancelling Pending #1042 shows it as `Cancelled` in the manager list). The demo is not one continuous order lifecycle.

**Kitchen demo scope:** Demo interactions cover order #1042 only. On the kitchen frames, Start preparing on #1040 and #1043 and Mark as ready on #1041 are drawn at 40% opacity and have no prototype connection. This limit belongs to the prototype demo only; the application lets the chef start or complete any order in a valid state.

**Review follow-up (18 Nov):** The [PR #71 review](https://github.com/seng321-7th-team/PantryChef/pull/71#pullrequestreview-5952870880) reported that Start preparing on the Pending orders #1040 and #1043 did not respond while #1042 was already Preparing. The kitchen frames were changed in Figma: `scr-03a` starts #1042 as Pending, the buttons outside the #1042 demo are faded, and `scr-03e-kitchen-ready` was added. The Chef flow was re-reviewed and approved on 19 November 2026 at `44ea8c4` ([approval](https://github.com/seng321-7th-team/PantryChef/pull/71#pullrequestreview-5982246341)). That approval covers the UI/UX prototype and documentation scope of that time (the 32-frame version). The commits after it up to `2bb8863` changed documentation text only (F-07 wording, cross-PR links, this review record and the `develop` alignment) and were not reviewed separately. Status of 21 Nov for the 39-frame additions of 20 Nov: the D-3, D-4 and D-6 frames were reviewed by Burcu ([PR #50 approval](https://github.com/seng321-7th-team/PantryChef/pull/50#pullrequestreview-5997276396), design and requirements consistency, not implementation testing) and by Bilgesu ([PR #71 comment](https://github.com/seng321-7th-team/PantryChef/pull/71#issuecomment-7046524812), static exports of the seven added frames). Neither is a live prototype interaction test or an access check. No separate review is recorded for the manager menu changes on the other frames, the rest of the PNG/PDF export and documentation, or the U10–U12 flows.

**Restart between parts:** Part 1, Part 2 and Part 3 are independent. Before each of them, restart the prototype (press **R** or use **Restart** in the prototype toolbar) and select **Flow 1** in the flow list, so every part starts from `scr-01-login` with the initial prototype states. **Sign out** only returns to `scr-01-login`; do not assume that it resets the prototype variables (for example the Cancelled #1042 or Menemen v4).

## Part 1 – Waiter (about 3 minutes)

0. Restart the prototype and select **Flow 1** in the flow list → `scr-01-login`.
1. `scr-01-login`: click **Waiter** → `scr-02a-waiter-default`.
2. Show the portions available per dish and "My open orders" (#1042 `Pending` with Cancel, #1041 `Preparing` with "Ask a manager to cancel").
3. Click **Add** on Köfte Plate → `scr-02b-waiter-insufficient-stock`: order not sent, `INSUFFICIENT_STOCK`. Say: the whole order is refused, nothing is reserved.
4. Go back to the New order frame and click **Send to kitchen** → `scr-02c-waiter-order-sent`: order #1043 `Pending`. Only the waiter creates orders; there is no manager order screen **(API 0.2.0)**.
5. Go to `scr-02a-waiter-default` (New order tab on `scr-02c`) and click **Cancel** on #1042 → `scr-02d-waiter-cancel-dialog`: reservations are released, physical stock is unchanged. Click **Keep order** → back to `scr-02a-waiter-default` with #1042 unchanged, or **Cancel order** → back to `scr-02a-waiter-default` with #1042 removed from "My open orders" (prototype state).
6. Click the **Orders** tab → `scr-05c-not-permitted-403`: a waiter without permission cannot late-cancel (`LATE_CANCEL_NOT_PERMITTED`).
7. Click **Authorized waiter** → `scr-05g-authorized-waiter-orders`, click **Late cancel…** on #1041 → `scr-05f-authorized-waiter-late-cancel`: reason required (3–500 characters). Click **Cancel order** → `scr-05h-authorized-waiter-late-cancelled`: #1041 `Cancelled`. Say: used ingredients are not returned to stock.
8. Click **Sign out** → `scr-01-login`.

## Part 2 – Chef (about 2 minutes)

Counters are given as Pending / Preparing / Ready.

0. Restart the prototype and select **Flow 1** in the flow list → `scr-01-login`.
1. `scr-01-login`: click **Chef** → `scr-03a-kitchen-board` (#1042 `Pending`; 3 / 1 / 1).
2. Click **Start preparing** on #1042 → `scr-03b-kitchen-deducting`: "Deducting stock…" on #1042 only (simulated state; 3 / 1 / 1). The prototype continues to `scr-03c-kitchen-preparing`: #1042 is `Preparing`, stock deducted once (2 / 2 / 1).
3. Click **Mark as ready** on #1042 → `scr-03e-kitchen-ready`: #1042 is `Ready`, no additional stock deducted (2 / 1 / 2).
4. Say: only #1042 is clickable in this demo; the faded buttons are not connected. In the application, every order in a valid state has working buttons.
5. Side demo (Flow 6: kitchen conflict): open Flow 6 from the flow list → `scr-03d-kitchen-conflict`. Say: another chef already started #1042 (`INVALID_STATUS_TRANSITION`); the board was refreshed (2 / 2 / 1). Click **Mark as ready** on #1042 → `scr-03e-kitchen-ready`.
6. Click **Sign out** → `scr-01-login`.

## Part 3 – Manager (about 5 minutes)

0. Restart the prototype and select **Flow 1** in the flow list → `scr-01-login`.
1. `scr-01-login`: click **Manager** → `scr-04a-inventory`. Show the low-stock banner and the menu Inventory / Recipes / Orders & audit / Staff permissions (selected tab in light blue). Say: stock **Out** (Chicken breast) is a stock level, not a deactivated ingredient.
2. Click **Adjust** on Tomatoes → `scr-04b-inventory-adjust-dialog` (reason required) → **Save adjustment** → back to the list: Tomatoes on hand 14500, reserved 350, available 14150 (prototype state; **Cancel** returns without change). Click **Adjust** on Chicken breast → `scr-04c-inventory-adjust-error` (`NEGATIVE_AVAILABLE_STOCK`). Click **Cancel** → back to `scr-04a-inventory`.
3. Click **+ New ingredient** → `scr-04d-inventory-new-ingredient`. Show the helper "Starts with 0 stock. Add stock using Adjust.". Click **Create ingredient** → back to the list: Bulgur is added with on hand, reserved and available 0 (prototype state; **Cancel** returns without it). Click **Adjust** on Bulgur → the Adjust dialog shows an `INITIAL_STOCK` opening-stock example. Say: the ingredient starts at 0 and the opening stock is a separate adjustment. Click **Save adjustment** or **Cancel** → back to `scr-04a-inventory`.
   Side frames: `scr-04e-new-ingredient-validation` and `scr-04f-new-ingredient-duplicate` (Flow 7) from the design file.
4. Ingredient lifecycle (Flow 9), **(API 0.2.0)**: click **Edit** on Rice → `scr-04g-inventory-edit-ingredient`. Say: the unit is locked while the ingredient has stock or reservations; stock changes only through Adjust.
5. Click **Deactivate ingredient** → `scr-04h-deactivate-confirm`. Click **Cancel** → back to `scr-04g`. Click **Deactivate ingredient** again, then **Deactivate** → `scr-04i-inventory-inactive-ingredient`: Rice shows an **Inactive** badge. Say: deactivation is separate from "Save changes" and takes effect at once in the prototype.
6. Click **Reactivate ingredient** → back to `scr-04g` (Active).
7. Click **Cancel** on `scr-04g` to return to `scr-04a-inventory`, then click the **Orders & audit** tab → `scr-05a-orders-and-audit`. Click **Cancel…** on #1042 → `scr-05d-pending-cancel-dialog` → **Cancel order** → back to `scr-05a` with #1042 shown as `Cancelled` (prototype state; **Keep order** returns without change).
8. Click **Late cancel…** on #1041 → `scr-05b-late-cancel-dialog` → **Cancel order** → `scr-05e-late-cancel-audit`: `ORDER_LATE_CANCELLED` with the reason.
9. Click the **Inventory** tab (on `scr-05e`) → `scr-04a-inventory`, then the **Recipes** tab → `scr-06a-recipes` → **Edit recipe** → `scr-06b-recipes-edit-dialog` → **Publish v4**: Menemen shows v4 and Olive oil 20 ml; the v1–v3 history stays (prototype state; **Cancel** keeps v3). Say: existing orders keep their recipe version.

## Part 3a – Views added on 20 Nov (D-3, D-4, D-6; about 3 minutes)

These frames follow the product-owner decision of 20 Nov ([PR #50 comment](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Burcu approved them in PR #50 (design and requirements consistency) and Bilgesu reviewed their static exports in PR #71; neither is a live prototype test (see "Review follow-up" above). Their API questions in [`ui-user-story-review.md`](ui-user-story-review.md) section 7b stay open for Sprint 3; they are not Sprint 2 release blockers ([PR #96 review](https://github.com/seng321-7th-team/PantryChef/pull/96#pullrequestreview-5999423412)). Part 3a continues the Manager session of Part 3 without a restart.

1. Inventory history (Flow 11): click the **Inventory** tab → `scr-04a-inventory`, then click **History** → `scr-04j-stock-movements`. Show the Rice movements: `ADJUSTMENT` (`INITIAL_STOCK`), `RESERVE`, `RELEASE`, `CONSUME`, with on hand after and reserved after. Change the Type filter between All types and RESERVE. Say: reserve and release change reserved stock only; late cancellation creates no stock movement.
2. Click **Reservations** → `scr-04k-reservations`: `ACTIVE`, `CONSUMED`, `RELEASED` with created and resolved times. Click **Back to inventory** → `scr-04a`.
3. New menu item (Flow 10): click the **Recipes** tab → `scr-06a-recipes` → **New menu item** → `scr-06c-new-menu-item` (Rice Bowl, 90.00 TRY, Rice 100 g per portion). Click **+ Add ingredient** to add the Olive oil line, then **Create menu item** → `scr-06e-menu-item-created`: initial recipe v1. Click **Back to recipes** → `scr-06h-recipes-after-create`; click the Rice Bowl row → the saved detail.
   Side flow (Flow 13): `scr-06f-new-menu-item-validation` shows "Quantity per portion must be greater than 0."; clicking the quantity field returns to `scr-06c`.
4. Staff permissions (Flow 12): click the **Staff permissions** tab → `scr-08a-staff-permissions`. Turn on "Allow late cancellation" for Deniz Yilmaz: an unsaved-change message with Cancel and Save appears. Turn it off again: the message disappears. Turn it on and click **Save**, then turn it off and **Save** to remove it. Say: the request keeps the other permissions and account details; managers already have late-cancel access.

## Part 4 – Common states (Flow 8, 1 minute)

Open the Flow 8 link (`scr-07a-states`): loading, empty states, `INTERNAL_ERROR`, connection error, and `MENU_ITEM_UNAVAILABLE` (422). This frame is static.

## What not to claim in the demo

- The prototype does not call a backend. Do not say that stock, reservations or the audit log were really changed.
- Deactivate and Reactivate are prototype transitions between frames.
- The #1042-only kitchen path is a demo limit, not a product rule.
- API 0.2.0, the SRS and the refined backlog are merged, but nothing is implemented. Soft delete and waiter-only order creation are in the merged documents; ADR-006 and ADR-008 are Accepted (PR #87); ADR-004, ADR-005 and ADR-007 stay Proposed (see `figma-links.md` section 8). For initial stock the merged documents say "start at zero, then adjust", and `scr-04d` to `scr-04f` follow it.
- The variable states (Cancelled #1042, Menemen v4, Tomatoes 14500 / 14150, Bulgur, saved permission) are one prototype example each. Fields use fixed sample values; there is no free-form input, no unlimited create/update/delete and no repeated stock operation.
- The staff example works for Deniz Yilmaz only; Elif Kaya cannot be selected. Saving the permission does not change the separate "Preview as" switch on the orders frames. In the stock history only the All types / RESERVE filter is interactive.
- The PDF and PNG exports show start states only, not every variable state.
- Not shown: "Show inactive" filter, editing or archiving existing menu items, staff management beyond the late-cancel permission. Delivery is outside the MVP. A successful demo rehearsal does not prove backend requirements or numeric NFR targets.

## Checklist before the demo

Prototype checks of 18 November 2026 (navigation and displayed content only; no backend):

- [x] Design file and Flow 2 to Flow 7 open without sign-in (private window) at their start screens; result screenshots recorded.
- [x] General demo link opens without sign-in; demo rehearsed from Flow 1 (31-frame version, before the kitchen change).
- [x] Flow 8 and Flow 9 links open at their start frames, signed in and without sign-in.
- [x] Chef path for #1042: `scr-03a` → `scr-03b` → `scr-03c` → `scr-03e`, and `scr-03d` → `scr-03e` (Flow 6). Prototype navigation and displayed counters verified; result screenshots recorded. Ready result: 2 / 1 / 2.
- [x] Kitchen buttons outside the #1042 demo have no prototype connection (checked in Figma).
- [x] Flow 9: 04g → 04h → 04i → 04g verified during the demo rehearsal. An earlier browser check also covered 04h Cancel → 04g.
- [x] File shared as "Anyone can view".
- [x] Independent reviewer re-check of the Chef path: approved on 19 November 2026 at `44ea8c4` ([approval](https://github.com/seng321-7th-team/PantryChef/pull/71#pullrequestreview-5982246341)) for the UI/UX prototype and documentation scope of that time (32-frame version). The text-only commits up to `2bb8863` were not reviewed separately. The Chef frames are pixel-identical in the 20 Nov export.

Manual prototype check of the 39-frame version, 20 November 2026, by the task owner (navigation and displayed values only; no backend):

- [x] Manager menus and the selected-tab style.
- [x] Pending #1042: Keep order / Cancel order.
- [x] Recipe edit: Cancel / Publish v4 and the version history.
- [x] Stock adjustment: Cancel / Save adjustment.
- [x] Bulgur: Cancel / Create ingredient, and the `INITIAL_STOCK` opening-stock example.
- [x] Permission toggle back to the saved value removes the unsaved-change message.
- [x] Granting the permission, cancelling the change, and removing it with Save.
- [x] New menu item with Olive oil, return to the list and open the saved detail.
- [x] Chef #1042: Pending → Preparing → Ready.

Other evidence and open items:

- [x] Before the manual check, 14 scenarios were simulated from the Figma reaction definitions. This is not a live browser test.
- [x] Flow 10 to Flow 13 open without sign-in (private Chrome window, 20 Nov) at their start frames. Access check only; interactions not re-tested.
- [x] D-3, D-4 and D-6 frames reviewed: Burcu's PR #50 approval (design and requirements consistency, not implementation testing) and Bilgesu's review of the static exports of the seven added frames (PR #71 comment). Not a live prototype interaction test or an access check.
- [ ] Separate review of the other 39-frame changes of 20 Nov (manager menu on the other frames, the rest of the PNG/PDF export and the documentation) and of the U10–U12 flows.
