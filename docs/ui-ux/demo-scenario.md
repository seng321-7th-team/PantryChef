# PantryChef – Prototype Demo Scenario

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-33 – Figma Links & UI Documentation
**Owner:** Tuğçe Çevik · **Reviewer:** Bilgesu Nacak
**Status:** Draft

This is a click-through script for the Figma prototype (32 frames, export of 18 Nov 2026). It describes the intended prototype click path. It does not call any backend; errors and states are drawn frames. Frame names are listed in [`figma-links.md`](figma-links.md).

**General demo start:** open the *General demo prototype* link in `figma-links.md`. It starts at `scr-01-login`. Choose a role with the prototype-only buttons (Waiter, Chef, Manager). The two Flow 8 / Flow 9 links start directly at their frames and are for short side demos. Flow 2 to Flow 7 can be opened from the flow list in the prototype sidebar.

Where a step follows API draft #62, it is marked **(API draft #62)**. The current checked head is `f061da2` (not merged); OpenAPI content is unchanged from `866122e`/`cb634c3`. Current cross-check sources: SRS #54 `0ad80b3`, backlog #55 `beba8c6`, ADR #64 `60d1a8b` (merged into `develop`) and schema #66 `fa446c1`. Draft agreement is not an implementation or merge claim.

**Scenario states:** The Waiter, Chef and Manager sections use independent, predefined Figma frames. Order IDs may be reused, but actions in one section do not update the other sections. The demo is not one continuous order lifecycle.

**Kitchen demo scope:** Demo interactions cover order #1042 only. On the kitchen frames, Start preparing on #1040 and #1043 and Mark as ready on #1041 are drawn at 40% opacity and have no prototype connection. This limit belongs to the prototype demo only; the application lets the chef start or complete any order in a valid state.

**Review follow-up (18 Nov):** The [PR #71 review](https://github.com/seng321-7th-team/PantryChef/pull/71#pullrequestreview-5952870880) reported that Start preparing on the Pending orders #1040 and #1043 did not respond while #1042 was already Preparing. The kitchen frames were changed in Figma: `scr-03a` starts #1042 as Pending, the buttons outside the #1042 demo are faded, and `scr-03e-kitchen-ready` was added. Independent reviewer re-check pending.

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

Counters are given as Pending / Preparing / Ready.

1. `scr-01-login`: click **Chef** → `scr-03a-kitchen-board` (#1042 `Pending`; 3 / 1 / 1).
2. Click **Start preparing** on #1042 → `scr-03b-kitchen-deducting`: "Deducting stock…" on #1042 only (simulated state; 3 / 1 / 1). The prototype continues to `scr-03c-kitchen-preparing`: #1042 is `Preparing`, stock deducted once (2 / 2 / 1).
3. Click **Mark as ready** on #1042 → `scr-03e-kitchen-ready`: #1042 is `Ready`, no additional stock deducted (2 / 1 / 2).
4. Say: only #1042 is clickable in this demo; the faded buttons are not connected. In the application, every order in a valid state has working buttons.
5. Side demo (Flow 6: kitchen conflict): open Flow 6 from the flow list → `scr-03d-kitchen-conflict`. Say: another chef already started #1042 (`INVALID_STATUS_TRANSITION`); the board was refreshed (2 / 2 / 1). Click **Mark as ready** on #1042 → `scr-03e-kitchen-ready`.
6. Click **Sign out** → `scr-01-login`.

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
- The #1042-only kitchen path is a demo limit, not a product rule.
- PR #62 is a draft API version and is not merged. Soft delete and waiter-only order creation are still pending in the team; backlog #55 US-06 AC1 currently says "Waiter or Manager" (open conflict, see `figma-links.md` section 8). For initial stock the drafts say "start at zero, then adjust", and `scr-04d` to `scr-04f` follow it.
- Not shown: stock movements and reservation views, new menu item with its first recipe, staff and permission management. These remain product-owner UI scope questions. Delivery is outside the MVP. A successful demo rehearsal does not prove backend requirements or numeric NFR targets.

## Checklist before the demo

Prototype checks of 18 November 2026 (navigation and displayed content only; no backend):

- [x] Design file and Flow 2 to Flow 7 open without sign-in (private window) at their start screens; result screenshots recorded.
- [x] General demo link opens without sign-in; demo rehearsed from Flow 1 (31-frame version, before the kitchen change).
- [x] Flow 8 and Flow 9 links open at their start frames, signed in and without sign-in.
- [x] Chef path for #1042: `scr-03a` → `scr-03b` → `scr-03c` → `scr-03e`, and `scr-03d` → `scr-03e` (Flow 6). Prototype navigation and displayed counters verified; result screenshots recorded. Ready result: 2 / 1 / 2.
- [x] Kitchen buttons outside the #1042 demo have no prototype connection (checked in Figma).
- [x] Flow 9: 04g → 04h → 04i → 04g verified during the demo rehearsal. An earlier browser check also covered 04h Cancel → 04g.
- [x] File shared as "Anyone can view".
- [ ] Independent reviewer re-check of the Chef path: pending.
