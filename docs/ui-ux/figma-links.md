# PantryChef – Figma Links and UI Documentation

**Course:** BM321 – Software Engineering
**Sprint:** Sprint 2
**Task:** S2-33 – Figma Links & UI Documentation
**Owner:** Tuğçe Çevik · **Reviewer:** Bilgesu Nacak
**Status:** Draft

## 1. Links

The design link and the prototype links are separate. The design link opens the file with all frames. A prototype link starts the clickable prototype at one frame.

| Purpose | Link |
|---|---|
| **Design file** (page "03 Screens v2", all 39 main frames) | https://www.figma.com/design/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=45-2 |
| **General demo prototype** (starts at the login frame `scr-01-login`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=45-1614&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=45%3A1614&show-proto-sidebar=1 |
| **Flow 8: common states** (starts at `scr-07a-states`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=95-2&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=95%3A2&show-proto-sidebar=1 |
| **Flow 9: ingredient lifecycle** (starts at `scr-04g-inventory-edit-ingredient`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=88-469&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=88%3A469&show-proto-sidebar=1 |

Notes:

- The general demo link and the design link were copied from the Figma share dialog, with the personal tracking parameter (`t=`) removed. The Flow 8 and Flow 9 links use the same pattern with the node ID of their start frame.
- Flow 2 to Flow 7 and Flow 10 to Flow 13 are opened from the flow list in the prototype sidebar (`show-proto-sidebar=1`) of the general demo link.
- Sharing is set to "Anyone can view". Access results are listed in section 6.
- Use the general demo link for the sprint demonstration: it starts at login and reaches every role (see [`demo-scenario.md`](demo-scenario.md)).

## 2. Prototype flow starting points

The Figma page "03 Screens v2" defines 13 flow starting points. The names are the names in Figma.

| Figma flow | Starts at | Use |
|---|---|---|
| Flow 1 | `scr-01-login` | General demo: login, then a role button leads to that role's start screen |
| Flow 2 | `scr-03a-kitchen-board` | Chef screens. Demo path for order #1042: `scr-03a` → `scr-03b` → `scr-03c` → `scr-03e` |
| Flow 3 | `scr-04a-inventory` | Manager inventory |
| Flow 4 | `scr-05a-orders-and-audit` | Manager orders and audit log |
| Flow 5 | `scr-06a-recipes` | Manager recipes |
| Flow 6: kitchen conflict | `scr-03d-kitchen-conflict` | Order already started by another chef (`INVALID_STATUS_TRANSITION`). Not linked from Flow 2 on purpose. **Mark as ready** on #1042 leads to `scr-03e-kitchen-ready`. |
| Flow 7: duplicate ingredient | `scr-04f-new-ingredient-duplicate` | `409 DUPLICATE_RESOURCE`. Not linked from the Create button on purpose, so the success path stays unchanged. |
| Flow 8: common states | `scr-07a-states` | Loading, empty and error states (static; no clickable path) |
| Flow 9: ingredient lifecycle | `scr-04g-inventory-edit-ingredient` | Deactivate and reactivate an ingredient |
| Flow 10 - New menu item and initial recipe | `scr-06c-new-menu-item` | D-4: create a menu item with its initial recipe → `scr-06e-menu-item-created` → `scr-06h-recipes-after-create` |
| Flow 11 - Inventory history | `scr-04j-stock-movements` | D-3: stock movements and, through the Reservations tab, `scr-04k-reservations` |
| Flow 12 - Staff late-cancel permissions | `scr-08a-staff-permissions` | D-6: grant or remove `ORDER_LATE_CANCEL` for a waiter |
| Flow 13 - New menu item: zero quantity error | `scr-06f-new-menu-item-validation` | D-4 validation: "Quantity per portion must be greater than 0." Clicking the quantity field returns to `scr-06c` |

Role start frames after login: Waiter → `scr-02a-waiter-default`, Chef → `scr-03a-kitchen-board`, Manager → `scr-04a-inventory`.

**Manager navigation.** The 22 manager frames (`scr-04a` to `scr-04k`, `scr-05a`, `scr-05b`, `scr-05d`, `scr-05e`, `scr-06a` to `scr-06h`, `scr-08a`) share one menu: Inventory / Recipes / Orders & audit / Staff permissions. The selected tab has a light-blue background. Inventory history (`scr-04j`, `scr-04k`) is opened with **History** on `scr-04a` and keeps Inventory selected.

**Kitchen demo scope.** Demo interactions cover order #1042 only. On the kitchen frames, **Start preparing** on #1040 and #1043 and **Mark as ready** on #1041 are drawn at 40% opacity and have no prototype connection. The #1042 buttons on the demo path are drawn at full opacity. This is a limit of the prototype demo, not a product rule: in the application, every order in a valid state can be started or marked as ready.

**Independent scenarios.** The Waiter, Chef and Manager sections are independent, predefined Figma scenarios. Order IDs are reused across sections, but an action in one section does not update the frames of another section, except for the prototype states listed below.

**Prototype states.** Some results are shown with Figma variables on the same frames instead of separate frames. The PDF and PNG files show the start values (for example Menemen v3 with Olive oil 15 ml, Tomatoes on hand 9500 / available 9150). The changed values appear only in the clickable prototype:

| Action | Displayed result in the prototype |
|---|---|
| Cancel order on Pending #1042 (`scr-02d` or `scr-05d`) | #1042 shows `Cancelled` in the manager list and is removed from the waiter's open orders |
| Publish v4 on `scr-06b` | Menemen shows v4 and Olive oil 20 ml; the v1–v3 history stays, and existing orders keep their earlier versions |
| Save adjustment for the Tomatoes example on `scr-04b` | Tomatoes on hand 14500, reserved 350, available 14150 |
| Create ingredient on `scr-04d` (Bulgur example) | Bulgur is added with on hand, reserved and available 0. **Adjust** on Bulgur opens the existing Adjust dialog with an `INITIAL_STOCK` opening-stock example |
| Toggle late-cancel access on `scr-08a` | An unsaved-change message with Cancel and Save appears; it disappears when the toggle returns to the saved value |
| Add ingredient on `scr-06c` | Adds an Olive oil line to the initial recipe |
| Type filter on `scr-04j` | Switches between All types and RESERVE |

## 3. Frames (39)

The 20 Nov 2026 export (PDF 19:36, PNG ZIP 19:40) contains the 39 main frames of the page "03 Screens v2", each 1280 × 800. The names below are the frame names in Figma and the file names of the exported PNGs (`<name>.png`). The PDF column gives the page in `PantryChef_Prototip_v2.pdf`; the PDF follows Figma's export order, not the order of this table. Manager frames show the four-tab menu described in section 2.

| # | Frame | PDF page | Role | What it shows |
|---|---|---|---|---|
| 1 | `scr-01-login` | 23 | All | Login. Prototype-only buttons continue as Waiter, Chef or Manager. |
| 2 | `scr-01b-login-error` | 26 | All | `INVALID_CREDENTIALS` |
| 3 | `scr-01c-session-expired` | 27 | All | `UNAUTHENTICATED`, sign in again |
| 4 | `scr-02a-waiter-default` | 24 | Waiter | New order, portions available, current order, "My open orders" |
| 5 | `scr-02b-waiter-insufficient-stock` | 25 | Waiter | Order not sent: `INSUFFICIENT_STOCK` |
| 6 | `scr-02c-waiter-order-sent` | 1 | Waiter | Order #1043 sent, status `Pending` |
| 7 | `scr-02d-waiter-cancel-dialog` | 31 | Waiter | Cancel a `Pending` order, reservations released |
| 8 | `scr-03a-kitchen-board` | 2 | Chef | Board with `Pending`, `Preparing`, `Ready`; #1042 `Pending`. Counters Pending 3 / Preparing 1 / Ready 1 |
| 9 | `scr-03b-kitchen-deducting` | 3 | Chef | "Deducting stock…" on #1042 (simulated state). Counters unchanged (3 / 1 / 1) |
| 10 | `scr-03c-kitchen-preparing` | 4 | Chef | #1042 moved to `Preparing`, stock deducted once. Counters 2 / 2 / 1 |
| 11 | `scr-03d-kitchen-conflict` | 6 | Chef | "Order #1042 was already started": `INVALID_STATUS_TRANSITION`, board refreshed. Counters 2 / 2 / 1 |
| 12 | `scr-03e-kitchen-ready` | 22 | Chef | #1042 moved to `Ready`, no additional stock deducted. Counters 2 / 1 / 2 |
| 13 | `scr-04a-inventory` | 5 | Manager | Inventory: on hand, reserved, available, threshold, status; Edit and Adjust per row; **History** opens `scr-04j` |
| 14 | `scr-04b-inventory-adjust-dialog` | 9 | Manager | Stock adjustment with required reason |
| 15 | `scr-04c-inventory-adjust-error` | 10 | Manager | `NEGATIVE_AVAILABLE_STOCK` |
| 16 | `scr-04d-inventory-new-ingredient` | 11 | Manager | New ingredient: name, unit, low-stock threshold; starts with 0 stock |
| 17 | `scr-04e-new-ingredient-validation` | 19 | Manager | "Name is required." |
| 18 | `scr-04f-new-ingredient-duplicate` | 28 | Manager | `409 DUPLICATE_RESOURCE` |
| 19 | `scr-04g-inventory-edit-ingredient` | 20 | Manager | Edit ingredient: unit locked, status Active, Deactivate |
| 20 | `scr-04h-deactivate-confirm` | 29 | Manager | Deactivate confirmation |
| 21 | `scr-04i-inventory-inactive-ingredient` | 21 | Manager | Ingredient Inactive: Reactivate; Inactive badge in the list |
| 22 | `scr-04j-stock-movements` | 38 | Manager | Inventory history, Stock movements tab (D-3): Rice sample with `RESERVE`, `CONSUME`, `RELEASE` and `ADJUSTMENT` (`INITIAL_STOCK`); change, on hand after, reserved after, performed by, order or reason; filters Ingredient, Order ID, Type, Date range |
| 23 | `scr-04k-reservations` | 36 | Manager | Inventory history, Reservations tab (D-3): Rice sample with `ACTIVE`, `CONSUMED`, `RELEASED`; quantity, created, resolved, order item ID; filters Ingredient, Order ID, Status |
| 24 | `scr-05a-orders-and-audit` | 12 | Manager | Today's orders and audit log |
| 25 | `scr-05b-late-cancel-dialog` | 13 | Manager | Late cancel of a `Preparing` order, reason required (3–500 characters) |
| 26 | `scr-05c-not-permitted-403` | 14 | Waiter | `LATE_CANCEL_NOT_PERMITTED` |
| 27 | `scr-05d-pending-cancel-dialog` | 15 | Manager | Cancel a `Pending` order |
| 28 | `scr-05e-late-cancel-audit` | 16 | Manager | After a late cancel: `ORDER_LATE_CANCELLED` in the audit log |
| 29 | `scr-05f-authorized-waiter-late-cancel` | 32 | Waiter | Late-cancel dialog for a waiter with permission |
| 30 | `scr-05g-authorized-waiter-orders` | 34 | Waiter | Orders list, "Authorized waiter" preview |
| 31 | `scr-05h-authorized-waiter-late-cancelled` | 35 | Waiter | #1041 `Cancelled` after the late cancel |
| 32 | `scr-06a-recipes` | 17 | Manager | Menu items, current recipe, version history; **New menu item** opens `scr-06c` |
| 33 | `scr-06b-recipes-edit-dialog` | 18 | Manager | Edit recipe, publishes a new version |
| 34 | `scr-06c-new-menu-item` | 7 | Manager | New menu item (D-4): name, price (TRY), description, active; initial recipe with ingredient, quantity per portion and unit; "At least one ingredient is required. The initial recipe is version 1." |
| 35 | `scr-06e-menu-item-created` | 30 | Manager | Created menu item: Rice Bowl, 90.00 TRY, Active, initial recipe v1 (Rice 100 g per portion); Back to recipes, New menu item |
| 36 | `scr-06f-new-menu-item-validation` | 8 | Manager | Quantity 0: "Quantity per portion must be greater than 0." |
| 37 | `scr-06h-recipes-after-create` | 39 | Manager | Recipes list including Rice Bowl (recipe v1); the row opens the saved detail `scr-06e` |
| 38 | `scr-07a-states` | 33 | All | Loading, empty, `INTERNAL_ERROR`, connection error, `MENU_ITEM_UNAVAILABLE` (422) |
| 39 | `scr-08a-staff-permissions` | 37 | Manager | Staff permissions (D-6): active waiters Deniz Yilmaz and Elif Kaya with saved late-cancel access; "Allow late cancellation" toggle for Deniz Yilmaz; "Other permissions and account details remain unchanged." |

**Not counted.** The page "04 Optional states - excluded" holds seven optional frames (`scr-04l-stock-movements-reserve-filter`, `scr-06d-new-menu-item-add-ingredient`, `scr-06g-menu-item-created-two-ingredients`, `scr-08b-permission-grant-unsaved`, `scr-08c-permission-granted`, `scr-08d-permission-revoke-unsaved`, `scr-08e-permission-revoked`). They are not part of the delivery and are not exported. The page "05 Components" is not a screen page. The page "02 Screens — Archive (old)" holds earlier versions.

## 4. Export package

| File | Content |
|---|---|
| `docs/ui-ux/exports/PantryChef_Prototip_v2.pdf` | Figma PDF export of 20 Nov 2026 (19:36). 39 pages, 1280 × 800, one frame per page. Page numbers are in section 3. |
| `docs/ui-ux/screens/` | 39 PNG files, `<frame name>.png`, 1280 × 800, from the Figma PNG export of 20 Nov 2026 (19:40). |

Export checks (20 Nov): the 39 PNG names match the 39 frame names on "03 Screens v2"; no file is missing, extra or duplicated; every PNG and PDF page is 1280 × 800. Each PDF page matches exactly one PNG (pixel comparison at 1280 × 800). The menu text "Staff permissions" appears on the 22 manager pages, and the selected tab is the only light-blue tab on each of them. `scr-03a` to `scr-03e`, `scr-05c`, `scr-05f` to `scr-05h`, `scr-01`, `scr-01b`, `scr-01c` and `scr-02d` are pixel-identical to the 18 Nov (23:47) export; `scr-02a` to `scr-02c` and `scr-07a` differ by one anti-aliased pixel. The other manager frames changed only in the menu bar, plus the History entry on `scr-04a` and the New menu item entry on `scr-06a`.

Earlier exports (superseded): 18 Nov, 23:47 – 32 frames, before the manager menu and the D-3, D-4 and D-6 frames. 18 Nov, about 01:35 – 31 frames, `scr-04d` to `scr-04f` without the Initial stock field, #1042 shown under `Pending` beside #1040 and #1043, no `scr-03e`, no Mark as ready target. Before 01:35 – 31 frames with an optional Initial stock field.

## 5. Related documents

- User flows: [`user-flows.md`](user-flows.md) (S2-30, merged into `develop` by [PR #70](https://github.com/seng321-7th-team/PantryChef/pull/70) on 20 Nov)
- Prototype description: [`ui-prototype.md`](ui-prototype.md)
- Demo script: [`demo-scenario.md`](demo-scenario.md)
- Consistency review of the screens against the User Stories: [`ui-user-story-review.md`](ui-user-story-review.md) (S2-31, merged into `develop` by [PR #50](https://github.com/seng321-7th-team/PantryChef/pull/50) on 20 Nov)
- API contract: [`../../api/openapi.yaml`](../../api/openapi.yaml) (`develop`, version 0.2.1 since PR #91 was merged on 20 Nov; 0.2.1 changes wording only, no schema change). Ingredient and order-creation behavior in the frames follows API 0.2.0 (PR #62); `scr-04d` to `scr-04f` follow its zero-stock rule.

## 6. Verification

The checks below cover screen navigation and displayed content only, not backend behavior, stock changes, concurrency or idempotency.

| Item | Result |
|---|---|
| Design file, Flow 2 to Flow 7 opened without sign-in (private window) | Verified on 18 Nov; result screenshots recorded. Design canvas opens. Flow 2: Kitchen board, #1042 `Pending`, 3 / 1 / 1. Flow 3: Inventory. Flow 4: Orders & audit. Flow 5: Recipes. Flow 6: "Order #1042 was already started" (`INVALID_STATUS_TRANSITION`). Flow 7: New ingredient with the duplicate-name warning. |
| General demo link (Flow 1) without sign-in; demo rehearsal from Flow 1 | Verified with the 31-frame version, before the kitchen change (18 Nov). |
| Flow 8 and Flow 9 without sign-in | Verified at their start frames on 18 Nov (`scr-07a-states`, static; `scr-04g-inventory-edit-ingredient`). |
| #1042 path `scr-03a` → `scr-03b` → `scr-03c` → `scr-03e` | Prototype navigation and displayed counters verified on 18 Nov; result screenshots recorded. Ready result: 2 / 1 / 2. |
| #1042 path `scr-03d` → `scr-03e` (Flow 6) | Prototype navigation and displayed counters verified on 18 Nov; result screenshots recorded. Ready result: 2 / 1 / 2. |
| Kitchen buttons outside the #1042 demo | No prototype connection (checked in Figma). The exported buttons match the full-colour button at 40% opacity. |
| Flow 9 transitions 04g → 04h → 04i → 04g | Verified during the demo rehearsal (18 Nov). An earlier browser check also covered 04h Cancel → 04g. |
| File sharing | "Anyone can view" (checked in a signed-in Figma session). |
| Manual prototype check of the 39-frame version (20 Nov), by the task owner in the Figma prototype | Expected results seen for: the manager menu and selected tab; Keep order / Cancel order on Pending #1042; Cancel / Publish v4 and the version history on the recipe edit; Cancel / Save adjustment on the stock adjustment; Cancel / Create ingredient for Bulgur; the Bulgur `INITIAL_STOCK` opening-stock example; the unsaved-change message disappearing when the permission toggle returns to its saved value; granting, cancelling and removing the late-cancel permission with Save; creating a menu item with Olive oil, returning to the list and opening the saved detail; the Chef #1042 path Pending → Preparing → Ready. Results are listed in section 2 ("Prototype states"). |
| Reaction simulation (before the manual check) | 14 scenarios were simulated from the Figma reaction definitions. This is not a live browser test. |
| Flow 10 to Flow 13 opened without sign-in (private Chrome window) | Verified on 20 Nov: all four open at their start frames (`scr-06c-new-menu-item`, `scr-04j-stock-movements`, `scr-08a-staff-permissions`, `scr-06f-new-menu-item-validation`). Access check only; the interactions were not re-tested in this check. |
| Prototype links outside the demo scenario | Pending |
| Independent reviewer re-check of the Chef path | Approved on 19 November 2026 at `44ea8c4` ([approval](https://github.com/seng321-7th-team/PantryChef/pull/71#pullrequestreview-5982246341)). The approval covers the UI/UX prototype and documentation scope of that time (32-frame version). The commits after it up to `2bb8863` changed documentation text only (F-07 wording, links, this review record and the `develop` alignment) and were not reviewed separately. The Chef frames `scr-03a` to `scr-03e` in the 20 Nov export are pixel-identical to the approved export. |
| Review of the 39-frame additions of 20 Nov (D-3, D-4, D-6 frames, manager menu, PNG/PDF export and documentation) | D-3, D-4 and D-6 frames: Burcu approved PR #50 at `a745b47` after checking them against her decisions; her approval covers design and requirements consistency, not implementation testing ([review](https://github.com/seng321-7th-team/PantryChef/pull/50#pullrequestreview-5997276396)). Bilgesu reviewed the static exports of the seven added frames and found no blocking visual inconsistencies ([PR #71 comment](https://github.com/seng321-7th-team/PantryChef/pull/71#issuecomment-7046524812)). Neither is a live prototype interaction test or an access check. Manager menu changes on the other frames, the rest of the PNG/PDF export and the documentation updates: Pending (no separate review recorded). The 19 Nov approval does not cover them. |

Related status:

- API 0.2.0 (PR #62) and API 0.2.1 (PR #91, wording only) are merged into `develop`. Frames that follow the API are marked in `ui-prototype.md`.
- Initial stock (D-9b) is done in Figma: no Initial stock field; helper "Starts with 0 stock. Add stock using Adjust." CR-01 is confirmed in the [PR #68 review](https://github.com/seng321-7th-team/PantryChef/pull/68#pullrequestreview-5957095073). SRS FR-02, backlog US-02 and the API state the rule and are merged.

## 7. Known limits of the prototype

- The role buttons on the login frames and the "Preview as" switch on the orders frames exist only for the prototype. In the real application, the role and permissions come from the signed-in account.
- Demo interactions on the kitchen board cover order #1042 only (section 2). "Deducting stock…" in `scr-03b` is a simulated state; no backend call is made. The Chef scenario is independent and limited to #1042.
- The Waiter, Chef and Manager sections are independent scenarios; an action in one section does not change another section, except for the prototype states in section 2.
- Deactivate and Reactivate change the state immediately in the prototype (04g → 04h → 04i). They are separate actions and are **not** part of "Save changes". See `ui-prototype.md`.
- No real backend, authentication, concurrency or NFR test was performed.
- Fields use fixed sample values; there is no free-form input.
- The staff example works for Deniz Yilmaz only; Elif Kaya cannot be selected.
- Saving a staff permission does not change the separate "Preview as" role preview on the orders frames.
- In the stock history, only the All types / RESERVE type filter is interactive.
- The samples show one example of each action. They do not represent unlimited create, update or delete operations or repeated stock operations.
- The PDF and PNG files show start states. They do not show every interactive variable state of the Figma prototype.

## 8. Requirement and architecture alignment checkpoint

### Status update of 21 Nov

Checked against `develop` at `eb41d74`. SRS, refined backlog and API 0.2.1 are unchanged since `7270d63`.

- The schema ([PR #66](https://github.com/seng321-7th-team/PantryChef/pull/66)) and the ADR status update ([PR #87](https://github.com/seng321-7th-team/PantryChef/pull/87)) are merged. ADR-006 (including WAITER-only order creation) and ADR-008 are Accepted. ADR-004, ADR-005 and ADR-007 stay Proposed.
- The S2-30 user flows (PR #70), the S2-31 review (PR #50) and this document set with the 39-frame export (PR #71) are merged.
- D-3, D-4 and D-6 frames: reviewed by the product owner (PR #50 approval) and, as static exports, by the Scrum Master (PR #71 comment); see section 6. No separate review is recorded for the manager menu changes on the other frames or for the U10–U12 flows in PR #70.
- The API questions for these views in [`ui-user-story-review.md`](ui-user-story-review.md) section 7b stay open. They are not Sprint 2 release blockers; Ayşe will answer them for Sprint 3 ([PR #96 review](https://github.com/seng321-7th-team/PantryChef/pull/96#pullrequestreview-5999423412)).

### Check of 20 Nov (kept as recorded)

Checked against `develop` at `7270d63` (20 Nov): [SRS](https://github.com/seng321-7th-team/PantryChef/blob/7270d63c6d9e23b87ad46d2d0ea3f5153088af34/docs/srs.md) (PR #54), [refined backlog](https://github.com/seng321-7th-team/PantryChef/blob/7270d63c6d9e23b87ad46d2d0ea3f5153088af34/docs/product-backlog.md) (PR #55), FR/NFR (PR #51), [API 0.2.1](https://github.com/seng321-7th-team/PantryChef/blob/7270d63c6d9e23b87ad46d2d0ea3f5153088af34/api/openapi.yaml) with C4/UML/ER (PR #62; wording update PR #91), the SRS FR-14 clarification (PR #89), the ADR document (PR #64) and the consistency review (PR #68) are merged. Schema #66 is open. ADR records keep their own status; ADR-006 and ADR-008 stay Proposed while PR #87 is open. PR #50's current mapping uses FR-01–FR-14; the older FR-001–FR-027 mapping is historical. SRS and backlog are unchanged since the previous check at `e197628`.

- Waiter-only order creation: SRS FR-06, backlog US-06 AC1 and the API (`createOrder`, "Roles: WAITER") are merged into `develop`, and the Figma design keeps order creation on the waiter screen. The earlier conflict (US-06 AC1 "Waiter or Manager" at `beba8c6`) is recorded as F-07 in PR #50.
- Deactivated ingredients raise no low-stock alerts: SRS FR-14 (PR #89) and the API state this; `scr-04h` shows it in the confirmation text. #68 records CR-03 as resolved. No implementation or test covers it yet.
- The deactivation screen gap is resolved (#68 CR-04). D-3, D-4 and D-6 were decided by the product owner on 20 Nov ([decision](https://github.com/seng321-7th-team/PantryChef/pull/50#issuecomment-7038140749)). Their frames were added to the Sprint 2 prototype in the 39-frame export: Inventory history (`scr-04j`, `scr-04k`), New menu item (`scr-06c`, `scr-06e`, `scr-06f`, `scr-06h`) and Staff permissions (`scr-08a`). Team review of these frames is pending. Open API questions for these views are listed in PR #50, section 7b.
