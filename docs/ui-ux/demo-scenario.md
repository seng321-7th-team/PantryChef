# PantryChef – Prototype Demo Scenario

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-33 – Figma Links & UI Documentation
**Owner:** Tuğçe Çevik · **Reviewer:** Bilgesu Nacak
**Status:** Draft

This is a click-through script for the Figma prototype. It describes the intended prototype click path. Earlier prototype-setting checks were recorded on 18 Nov 2026; the Chef interaction issue reported during review remains open (see below). It does not call any backend; errors and states are drawn frames. Frame names are listed in [`figma-links.md`](figma-links.md).

**General demo start:** open the *General demo prototype* link in `figma-links.md`. It starts at `scr-01-login`. Choose a role with the prototype-only buttons (Waiter, Chef, Manager). The two Flow 8 / Flow 9 links start directly at their frames and are for short side demos.

Where a step follows API draft #62, it is marked **(API draft #62)**. The current checked head is `f061da2` (not merged); OpenAPI content is unchanged from `866122e`/`cb634c3`. Current cross-check sources: SRS #54 `0ad80b3`, backlog #55 `ec1911a`, ADR #64 `60d1a8b` and schema #66 `fa446c1`. Draft agreement is not an implementation or merge claim.

**Scenario states:** The Waiter, Chef and Manager sections use independent, predefined Figma frames. Order IDs may be reused, but actions in one section do not update the other sections. The demo is not one continuous order lifecycle.

**Open review items (18 Nov):** The reviewer reported that the Pending orders #1040 and #1043 did not respond to Start preparing, while #1042 was already Preparing. This differs from the exported `scr-03a` → `scr-03b` → `scr-03c` example, which starts #1042 as Pending. Part 2 step 2 is a documented scenario awaiting live connection/start-frame verification, not a confirmed working path after review. Design-link access without sign-in and standalone Flow 2–7 access also remain pending. [Review details](https://github.com/seng321-7th-team/PantryChef/pull/71#pullrequestreview-5952870880).

## Part 1 – Waiter (about 3 minutes)

1. `scr-01-login`: click **Waiter** → `scr-02a-waiter-default`.
2. Show the portions available per dish and "My open orders" (#1042 `Pending` with Cancel, #1041 `Preparing` with "Ask a manager to cancel").
3. Click **Add** on Köfte Plate → `scr-02b-waiter-insufficient-stock`: order not sent, `INSUFFICIENT_STOCK`. Say: the whole order is refused, nothing is reserved.
4. Go back to the New order frame and click **Send to kitchen** → `scr-02c-waiter-order-sent`: order #1043 `Pending`. Only the waiter creates orders; there is no manager order screen **(API draft #62)**.
5. Go to `scr-02a-waiter-default` (New order tab on `scr-02c`) and click **Cancel** on #1042 → `scr-02d-waiter-cancel-dialog`: reservations are released, physical stock is unchanged. Click **Keep order** or **Cancel order** → back to `scr-02a-waiter-default`.
6. Click the **Orders** tab → `scr-05c-not-permitted-403`: a waiter without permission cannot late-cancel (`LATE_CANCEL_NOT_PERMITTED`).
7. Click **Authorized waiter** → `scr-05g-authorized-waiter-orders`, click **Late cancel…** on #1041 → `scr-05f-authorized-waiter-late-cancel`: reason required (3–500 characters). Click **Cancel order** → `scr-05h-authorized-waiter-late-cancelled`: #1041 `Cancelled`. Say: used ingredients are not returned to stock.
8. Click **Sign out** → `scr-01-login`.

## Part 2 – Chef (about 2 minutes)

1. `scr-01-login`: click **Chef** → `scr-03a-kitchen-board`.
2. Click **Start preparing** on #1042 → `scr-03b-kitchen-deducting` (only this order is locked). Click anywhere on that frame → `scr-03c-kitchen-preparing`: stock deducted once.
3. The "Mark as ready" button is visible on the Preparing cards. It has no click target in the prototype; point to the Ready column instead.
4. Side demo (Flow 6: kitchen conflict): open `scr-03d-kitchen-conflict` from the design file. Say: another chef already started #1042 (`INVALID_STATUS_TRANSITION`).
5. Click **Sign out** → `scr-01-login`.

## Part 3 – Manager (about 5 minutes)

1. `scr-01-login`: click **Manager** → `scr-04a-inventory`. Show the low-stock banner. Say: stock **Out** (Chicken breast) is a stock level, not a deactivated ingredient.
2. Click **Adjust** on Tomatoes → `scr-04b-inventory-adjust-dialog` (reason required) → Save → back to the list. Click **Adjust** on Chicken breast → `scr-04c-inventory-adjust-error` (`NEGATIVE_AVAILABLE_STOCK`).
3. Click **+ New ingredient** → `scr-04d-inventory-new-ingredient`. Show the helper "Starts with 0 stock. Add stock using Adjust.": the ingredient starts at 0 and the opening stock is entered with Adjust (reason Initial stock). Cancel.
   Side frames: `scr-04e-new-ingredient-validation` and `scr-04f-new-ingredient-duplicate` (Flow 7) from the design file.
4. Ingredient lifecycle (Flow 9), **(API draft #62)**: click **Edit** on Rice → `scr-04g-inventory-edit-ingredient`. Say: the unit is locked while the ingredient has stock or reservations; stock changes only through Adjust.
5. Click **Deactivate ingredient** → `scr-04h-deactivate-confirm`. Click **Cancel** → back to `scr-04g`. Click **Deactivate ingredient** again, then **Deactivate** → `scr-04i-inventory-inactive-ingredient`: Rice shows an **Inactive** badge. Say: deactivation is separate from "Save changes" and takes effect at once in the prototype.
6. Click **Reactivate ingredient** → back to `scr-04g` (Active).
7. Click **Cancel** on `scr-04g` to return to `scr-04a-inventory`, then click the **Orders & audit** tab → `scr-05a-orders-and-audit`. Click **Cancel…** on #1042 → `scr-05d-pending-cancel-dialog` → **Cancel order** → back to `scr-05a`.
8. Click **Late cancel…** on #1041 → `scr-05b-late-cancel-dialog` → **Cancel order** → `scr-05e-late-cancel-audit`: `ORDER_LATE_CANCELLED` with the reason.
9. Click the **Inventory** tab (on `scr-05e`) → `scr-04a-inventory`, then the **Recipes** tab → `scr-06a-recipes` → **Edit recipe** → `scr-06b-recipes-edit-dialog` → **Publish v4**. Say: existing orders keep their recipe version.

## Part 4 – Common states (Flow 8, 1 minute)

Open the Flow 8 link (`scr-07a-states`): loading, empty states, `INTERNAL_ERROR`, connection error, and `MENU_ITEM_UNAVAILABLE` (422). This frame is static.

## What not to claim in the demo

- The prototype does not call a backend. Do not say that stock, reservations or the audit log were really changed.
- Deactivate and Reactivate are prototype transitions between frames.
- PR #62 is a draft API version and is not merged. Soft delete and waiter-only order creation are still pending in the team. For initial stock the drafts now say "start at zero, then adjust", and `scr-04d` to `scr-04f` follow it since the 18 Nov re-export.
- Not shown: stock movements and reservation views, new menu item with its first recipe, staff and permission management. These remain product-owner UI scope questions. Delivery is outside the MVP. A successful demo rehearsal does not prove backend requirements or numeric NFR targets.

## Checklist before the demo

- [x] The general demo link opens in a private window without signing in to Figma, and the demo scenario was rehearsed from Flow 1 (verified manually by Tuğçe on 18 November 2026).
- [x] The Flow 8 and Flow 9 links open at the right frame (checked on 18 Nov in a signed-in Figma session).
- [x] The Flow 8 and Flow 9 links open in a private window without signing in to Figma (verified manually by Tuğçe on 18 November 2026). Flow 8 is static. Flow 9: The standalone-link check covered only the start frame. Deactivate/Reactivate transitions were subsequently tested during the demo rehearsal; see the item below.
- [x] Flow 9: 04g → 04h → 04i → 04g (Deactivate, then Reactivate) – verified manually by Tuğçe on 18 November 2026 during the demo rehearsal. The 04h Cancel → 04g step is not counted as verified by this check. Earlier checks verified 04g → 04h → 04g and 04g → 04h → 04i → 04g in the live prototype in a browser on 18 Nov (historical evidence).
- [x] The file is shared as "Anyone can view" (checked on 18 Nov in a signed-in Figma session; opening without signing in was verified manually by Tuğçe on 18 November 2026 for the general demo link and the Flow 8 and Flow 9 links).
