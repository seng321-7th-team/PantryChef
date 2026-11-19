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
| **Design file** (page "03 Screens v2", all 32 frames) | https://www.figma.com/design/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=45-2 |
| **General demo prototype** (starts at the login frame `scr-01-login`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=45-1614&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=45%3A1614&show-proto-sidebar=1 |
| **Flow 8: common states** (starts at `scr-07a-states`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=95-2&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=95%3A2&show-proto-sidebar=1 |
| **Flow 9: ingredient lifecycle** (starts at `scr-04g-inventory-edit-ingredient`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=88-469&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=88%3A469&show-proto-sidebar=1 |

Notes:

- The general demo link and the design link were copied from the Figma share dialog, with the personal tracking parameter (`t=`) removed. The Flow 8 and Flow 9 links use the same pattern with the node ID of their start frame.
- Flow 2 to Flow 7 are opened from the flow list in the prototype sidebar (`show-proto-sidebar=1`) of the general demo link.
- Sharing is set to "Anyone can view". Access results are listed in section 6.
- Use the general demo link for the sprint demonstration: it starts at login and reaches every role (see [`demo-scenario.md`](demo-scenario.md)).

## 2. Prototype flow starting points

The Figma page defines nine flow starting points. The names are the names in Figma.

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

Role start frames after login: Waiter → `scr-02a-waiter-default`, Chef → `scr-03a-kitchen-board`, Manager → `scr-04a-inventory`.

**Kitchen demo scope.** Demo interactions cover order #1042 only. On the kitchen frames, **Start preparing** on #1040 and #1043 and **Mark as ready** on #1041 are drawn at 40% opacity and have no prototype connection. The #1042 buttons on the demo path are drawn at full opacity. This is a limit of the prototype demo, not a product rule: in the application, every order in a valid state can be started or marked as ready.

**Independent scenarios.** The Waiter, Chef and Manager sections are independent, predefined Figma scenarios. Order IDs are reused across sections, but an action in one section does not update the frames of another section.

## 3. Frames (32)

The 18 Nov 2026 export (23:47) contains 32 frames, each 1280 × 800. The names below are the frame names in Figma and the file names of the exported PNGs (`<name>.png`). The PDF column gives the page in `PantryChef_Prototip_v2.pdf`; the PDF follows Figma's page order, not the order of this table.

| # | Frame | PDF page | Role | What it shows |
|---|---|---|---|---|
| 1 | `scr-01-login` | 21 | All | Login. Prototype-only buttons continue as Waiter, Chef or Manager. |
| 2 | `scr-01b-login-error` | 24 | All | `INVALID_CREDENTIALS` |
| 3 | `scr-01c-session-expired` | 25 | All | `UNAUTHENTICATED`, sign in again |
| 4 | `scr-02a-waiter-default` | 22 | Waiter | New order, portions available, current order, "My open orders" |
| 5 | `scr-02b-waiter-insufficient-stock` | 23 | Waiter | Order not sent: `INSUFFICIENT_STOCK` |
| 6 | `scr-02c-waiter-order-sent` | 1 | Waiter | Order #1043 sent, status `Pending` |
| 7 | `scr-02d-waiter-cancel-dialog` | 28 | Waiter | Cancel a `Pending` order, reservations released |
| 8 | `scr-03a-kitchen-board` | 2 | Chef | Board with `Pending`, `Preparing`, `Ready`; #1042 `Pending`. Counters Pending 3 / Preparing 1 / Ready 1 |
| 9 | `scr-03b-kitchen-deducting` | 3 | Chef | "Deducting stock…" on #1042 (simulated state). Counters unchanged (3 / 1 / 1) |
| 10 | `scr-03c-kitchen-preparing` | 4 | Chef | #1042 moved to `Preparing`, stock deducted once. Counters 2 / 2 / 1 |
| 11 | `scr-03d-kitchen-conflict` | 6 | Chef | "Order #1042 was already started": `INVALID_STATUS_TRANSITION`, board refreshed. Counters 2 / 2 / 1 |
| 12 | `scr-03e-kitchen-ready` | 12 | Chef | #1042 moved to `Ready`, no additional stock deducted. Counters 2 / 1 / 2 |
| 13 | `scr-04a-inventory` | 5 | Manager | Inventory: on hand, reserved, available, threshold, status; Edit and Adjust per row |
| 14 | `scr-04b-inventory-adjust-dialog` | 7 | Manager | Stock adjustment with required reason |
| 15 | `scr-04c-inventory-adjust-error` | 8 | Manager | `NEGATIVE_AVAILABLE_STOCK` |
| 16 | `scr-04d-inventory-new-ingredient` | 9 | Manager | New ingredient: name, unit, low-stock threshold; starts with 0 stock |
| 17 | `scr-04e-new-ingredient-validation` | 18 | Manager | "Name is required." |
| 18 | `scr-04f-new-ingredient-duplicate` | 26 | Manager | `409 DUPLICATE_RESOURCE` |
| 19 | `scr-04g-inventory-edit-ingredient` | 19 | Manager | Edit ingredient: unit locked, status Active, Deactivate |
| 20 | `scr-04h-deactivate-confirm` | 27 | Manager | Deactivate confirmation |
| 21 | `scr-04i-inventory-inactive-ingredient` | 20 | Manager | Ingredient Inactive: Reactivate; Inactive badge in the list |
| 22 | `scr-05a-orders-and-audit` | 10 | Manager | Today's orders and audit log |
| 23 | `scr-05b-late-cancel-dialog` | 11 | Manager | Late cancel of a `Preparing` order, reason required (3–500 characters) |
| 24 | `scr-05c-not-permitted-403` | 13 | Waiter | `LATE_CANCEL_NOT_PERMITTED` |
| 25 | `scr-05d-pending-cancel-dialog` | 14 | Manager | Cancel a `Pending` order |
| 26 | `scr-05e-late-cancel-audit` | 15 | Manager | After a late cancel: `ORDER_LATE_CANCELLED` in the audit log |
| 27 | `scr-05f-authorized-waiter-late-cancel` | 29 | Waiter | Late-cancel dialog for a waiter with permission |
| 28 | `scr-05g-authorized-waiter-orders` | 31 | Waiter | Orders list, "Authorized waiter" preview |
| 29 | `scr-05h-authorized-waiter-late-cancelled` | 32 | Waiter | #1041 `Cancelled` after the late cancel |
| 30 | `scr-06a-recipes` | 16 | Manager | Menu items, current recipe, version history |
| 31 | `scr-06b-recipes-edit-dialog` | 17 | Manager | Edit recipe, publishes a new version |
| 32 | `scr-07a-states` | 30 | All | Loading, empty, `INTERNAL_ERROR`, connection error, `MENU_ITEM_UNAVAILABLE` (422) |

## 4. Export package

| File | Content |
|---|---|
| `docs/ui-ux/exports/PantryChef_Prototip_v2.pdf` | Figma PDF export of 18 Nov 2026 (23:47). 32 pages, 1280 × 800, one frame per page. Page numbers are in section 3. |
| `docs/ui-ux/screens/` | 32 PNG files, `<frame name>.png`, 1280 × 800. `scr-03a` to `scr-03e` come from the Figma PNG export of 18 Nov (23:47); the other 27 files are unchanged from the previous export. |

Checks: frame names, file count and export dimensions checked. Each PDF page matches exactly one PNG (pixel comparison at 1280 × 800). The PNG export did not include `scr-07a-states`; the repository file matches PDF page 30 and was kept. The other PNG files in that export differ from the repository files only by anti-aliasing and were not replaced.

Earlier exports (superseded): 18 Nov, about 01:35 – 31 frames, `scr-04d` to `scr-04f` without the Initial stock field, #1042 shown under `Pending` beside #1040 and #1043, no `scr-03e`, no Mark as ready target. Before 01:35 – 31 frames with an optional Initial stock field.

## 5. Related documents

- User flows: [`user-flows.md`](https://github.com/seng321-7th-team/PantryChef/blob/dc91ff631972be1560705cbcfc325b0c5ea7aa80/docs/ui-ux/user-flows.md) (S2-30, PR #70, commit `dc91ff6`; not on `develop` yet)
- Prototype description: [`ui-prototype.md`](ui-prototype.md)
- Demo script: [`demo-scenario.md`](demo-scenario.md)
- Consistency review of the screens against the User Stories: [`ui-user-story-review.md`](https://github.com/seng321-7th-team/PantryChef/blob/c1dbd05ad186c4194fb8789178cb5e77f656fae9/docs/ui-ux/ui-user-story-review.md) (S2-31, PR #50, commit `c1dbd05`; not on `develop` yet)
- API contract: [`../../api/openapi.yaml`](../../api/openapi.yaml) (`develop`, version 0.1.0). Ingredient and order-creation behavior in the frames follows API draft **PR #62** at `f061da2` (version 0.2.0, **not merged**; OpenAPI content unchanged since `866122e`). `scr-04d` to `scr-04f` follow its zero-stock rule.

## 6. Verification

All checks below are prototype checks of 18 November 2026. They cover screen navigation and displayed content only, not backend behavior, stock changes, concurrency or idempotency.

| Item | Result |
|---|---|
| Design file, Flow 2 to Flow 7 opened without sign-in (private window) | Verified; result screenshots recorded. Design canvas opens. Flow 2: Kitchen board, #1042 `Pending`, 3 / 1 / 1. Flow 3: Inventory. Flow 4: Orders & audit. Flow 5: Recipes. Flow 6: "Order #1042 was already started" (`INVALID_STATUS_TRANSITION`). Flow 7: New ingredient with the duplicate-name warning. |
| General demo link (Flow 1) without sign-in; demo rehearsal from Flow 1 | Verified with the 31-frame version, before the kitchen change. |
| Flow 8 and Flow 9 without sign-in | Verified at their start frames (`scr-07a-states`, static; `scr-04g-inventory-edit-ingredient`). |
| #1042 path `scr-03a` → `scr-03b` → `scr-03c` → `scr-03e` | Prototype navigation and displayed counters verified; result screenshots recorded. Ready result: 2 / 1 / 2. |
| #1042 path `scr-03d` → `scr-03e` (Flow 6) | Prototype navigation and displayed counters verified; result screenshots recorded. Ready result: 2 / 1 / 2. |
| Kitchen buttons outside the #1042 demo | No prototype connection (checked in Figma). The exported buttons match the full-colour button at 40% opacity. |
| Flow 9 transitions 04g → 04h → 04i → 04g | Verified during the demo rehearsal. An earlier browser check also covered 04h Cancel → 04g. |
| File sharing | "Anyone can view" (checked in a signed-in Figma session). |
| Prototype links outside the demo scenario | Pending |
| Independent reviewer re-check of the Chef path | Pending |

Related status:

- PR #62 (API 0.2.0 draft) is not merged. Frames that depend on it are marked in `ui-prototype.md`.
- Initial stock (D-9b) is done in Figma: no Initial stock field; helper "Starts with 0 stock. Add stock using Adjust." CR-01 is confirmed in the [PR #68 review](https://github.com/seng321-7th-team/PantryChef/pull/68#pullrequestreview-5957095073). SRS #54, backlog #55 and API #62 are not merged.

## 7. Known limits of the prototype

- The role buttons on the login frames and the "Preview as" switch on the orders frames exist only for the prototype. In the real application, the role and permissions come from the signed-in account.
- Demo interactions on the kitchen board cover order #1042 only (section 2). "Deducting stock…" in `scr-03b` is a simulated state; no backend call is made.
- The Waiter, Chef and Manager sections are independent scenarios; an action in one section does not change another section.
- Deactivate and Reactivate change the state immediately in the prototype (04g → 04h → 04i). They are separate actions and are **not** part of "Save changes". See `ui-prototype.md`.
- Screens that the review lists as missing or undecided are not part of these 32 frames.

## 8. Requirement and architecture alignment checkpoint

Current reviewed sources (20 Nov): SRS #54 `0ad80b3`, backlog #55 `986583e`, FR/NFR #51 `fc70b81`, API/diagrams #62 `f061da2`, schema #66 `fa446c1` and consistency review #68 `46e8d1c` are open. ADR PR #64 (`60d1a8b`) is merged into `develop` (`3688747`); its records keep their own Accepted, Proposed or Rejected status. PR #50's current mapping uses FR-01–FR-14; the older FR-001–FR-027 mapping is historical. Commit-pinned links above are snapshots.

- Waiter-only order creation is aligned in the current drafts: SRS #54 FR-06, backlog #55 US-06 AC1 at `986583e` and API draft #62 say WAITER, and the Figma design keeps order creation on the waiter screen. The earlier conflict (US-06 AC1 "Waiter or Manager" at `beba8c6`) is recorded as F-07 in PR #50. Re-review of #55 and the merges of #54, #55 and #62 are pending; `develop` API 0.1.0 still lists WAITER and MANAGER.
- The deactivation screen gap is resolved (#68 CR-04). Recipe creation (D-4), reservation/consumption-history views (D-3) and staff/permission-management UI (D-6) remain product-owner scope questions, not new screens.
