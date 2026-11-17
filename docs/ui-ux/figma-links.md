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
| **Design file** (page "03 Screens v2", all 31 frames) | https://www.figma.com/design/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=45-2 |
| **General demo prototype** (starts at the login frame `scr-01-login`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=45-1614&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=45%3A1614&show-proto-sidebar=1 |
| **Flow 8: common states** (starts at `scr-07a-states`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=95-2&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=95%3A2&show-proto-sidebar=1 |
| **Flow 9: ingredient lifecycle** (starts at `scr-04g-inventory-edit-ingredient`) | https://www.figma.com/proto/5qFd8FAjX4ETh6pRipr0pD/PantryChef-Prototip?node-id=88-469&p=f&scaling=min-zoom&content-scaling=fixed&page-id=45%3A2&starting-point-node-id=88%3A469&show-proto-sidebar=1 |

Notes:

- The general demo link and the design link were copied from the Figma share dialog, with the personal tracking parameter (`t=`) removed. The Flow 8 and Flow 9 links use the same pattern with the node ID of their start frame. Opening them has **not** been checked yet (checklist in section 6).
- Before submission, the file must be shared as "anyone with the link can view".
- Use the general demo link for the sprint demonstration: it starts at login and reaches every role (see [`demo-scenario.md`](demo-scenario.md)).

## 2. Prototype flow starting points

The Figma page defines nine flow starting points. The names are the names in Figma.

| Figma flow | Starts at | Use |
|---|---|---|
| Flow 1 | `scr-01-login` | General demo: login, then a role button leads to that role's start screen |
| Flow 2 | `scr-03a-kitchen-board` | Chef screens |
| Flow 3 | `scr-04a-inventory` | Manager inventory |
| Flow 4 | `scr-05a-orders-and-audit` | Manager orders and audit log |
| Flow 5 | `scr-06a-recipes` | Manager recipes |
| Flow 6: kitchen conflict | `scr-03d-kitchen-conflict` | Order already started by another chef (`INVALID_STATUS_TRANSITION`). Not linked from Flow 2 on purpose. |
| Flow 7: duplicate ingredient | `scr-04f-new-ingredient-duplicate` | `409 DUPLICATE_RESOURCE`. Not linked from the Create button on purpose, so the success path stays unchanged. |
| Flow 8: common states | `scr-07a-states` | Loading, empty and error states (static; no clickable path) |
| Flow 9: ingredient lifecycle | `scr-04g-inventory-edit-ingredient` | Deactivate and reactivate an ingredient |

Role start frames after login: Waiter → `scr-02a-waiter-default`, Chef → `scr-03a-kitchen-board`, Manager → `scr-04a-inventory`.

## 3. Frames (31)

Live check on the page "03 Screens v2": 31 frames, each 1280 × 800. The names below are exactly the frame names in Figma and the file names of the exported PNGs (`<name>.png`).

| # | Frame | Role | What it shows |
|---|---|---|---|
| 1 | `scr-01-login` | All | Login. Prototype-only buttons continue as Waiter, Chef or Manager. |
| 2 | `scr-01b-login-error` | All | `INVALID_CREDENTIALS` |
| 3 | `scr-01c-session-expired` | All | `UNAUTHENTICATED`, sign in again |
| 4 | `scr-02a-waiter-default` | Waiter | New order, portions available, current order, "My open orders" |
| 5 | `scr-02b-waiter-insufficient-stock` | Waiter | Order not sent: `INSUFFICIENT_STOCK` |
| 6 | `scr-02c-waiter-order-sent` | Waiter | Order #1043 sent, status `Pending` |
| 7 | `scr-02d-waiter-cancel-dialog` | Waiter | Cancel a `Pending` order, reservations released |
| 8 | `scr-03a-kitchen-board` | Chef | Board with `Pending`, `Preparing`, `Ready` |
| 9 | `scr-03b-kitchen-deducting` | Chef | "Deducting stock…" on one order |
| 10 | `scr-03c-kitchen-preparing` | Chef | Order moved to `Preparing`, stock deducted once |
| 11 | `scr-03d-kitchen-conflict` | Chef | Order already started: `INVALID_STATUS_TRANSITION` |
| 12 | `scr-04a-inventory` | Manager | Inventory: on hand, reserved, available, threshold, status; Edit and Adjust per row |
| 13 | `scr-04b-inventory-adjust-dialog` | Manager | Stock adjustment with required reason |
| 14 | `scr-04c-inventory-adjust-error` | Manager | `NEGATIVE_AVAILABLE_STOCK` |
| 15 | `scr-04d-inventory-new-ingredient` | Manager | New ingredient: name, unit, low-stock threshold, optional initial stock |
| 16 | `scr-04e-new-ingredient-validation` | Manager | "Name is required." |
| 17 | `scr-04f-new-ingredient-duplicate` | Manager | `409 DUPLICATE_RESOURCE` |
| 18 | `scr-04g-inventory-edit-ingredient` | Manager | Edit ingredient: unit locked, status Active, Deactivate |
| 19 | `scr-04h-deactivate-confirm` | Manager | Deactivate confirmation |
| 20 | `scr-04i-inventory-inactive-ingredient` | Manager | Ingredient Inactive: Reactivate; Inactive badge in the list |
| 21 | `scr-05a-orders-and-audit` | Manager | Today's orders and audit log |
| 22 | `scr-05b-late-cancel-dialog` | Manager | Late cancel of a `Preparing` order, reason required (3–500 characters) |
| 23 | `scr-05c-not-permitted-403` | Waiter | `LATE_CANCEL_NOT_PERMITTED` |
| 24 | `scr-05d-pending-cancel-dialog` | Manager | Cancel a `Pending` order |
| 25 | `scr-05e-late-cancel-audit` | Manager | After a late cancel: `ORDER_LATE_CANCELLED` in the audit log |
| 26 | `scr-05f-authorized-waiter-late-cancel` | Waiter | Late-cancel dialog for a waiter with permission |
| 27 | `scr-05g-authorized-waiter-orders` | Waiter | Orders list, "Authorized waiter" preview |
| 28 | `scr-05h-authorized-waiter-late-cancelled` | Waiter | #1041 `Cancelled` after the late cancel |
| 29 | `scr-06a-recipes` | Manager | Menu items, current recipe, version history |
| 30 | `scr-06b-recipes-edit-dialog` | Manager | Edit recipe, publishes a new version |
| 31 | `scr-07a-states` | All | Loading, empty, `INTERNAL_ERROR`, connection error, `MENU_ITEM_UNAVAILABLE` (422) |

## 4. Export package

- `docs/ui-ux/screens/`: 31 PNG files named `<frame name>.png` (1280 × 800), exported from the live file on 18 Nov 2026. Check performed: 31 files, 31 different contents, every frame name above present.
- `docs/ui-ux/exports/PantryChef_Prototip_v2.pdf`: 31 pages, one per frame, in the order of the table above (the page bar shows the frame name).

## 5. Related documents

- User flows: [`user-flows.md`](user-flows.md) (S2-30)
- Prototype description: [`ui-prototype.md`](ui-prototype.md)
- Demo script: [`demo-scenario.md`](demo-scenario.md)
- Consistency review of the screens against the User Stories: [`ui-user-story-review.md`](ui-user-story-review.md) (S2-31)
- API contract: [`../../api/openapi.yaml`](../../api/openapi.yaml) (`develop` at `0c3e244`, identical at `5dd8253`, version 0.1.0). The latest ingredient and order-creation behavior shown in the frames follows the API draft in **PR #62**, head `dbb06be` (version 0.2.0, **not merged**).

## 6. Status and open items

| Item | Status |
|---|---|
| 31 frames on the live page | Verified (18 Nov) |
| Flow 9 transitions (04g Deactivate → 04h, 04h Cancel → 04g, 04h Deactivate → 04i, 04i Reactivate → 04g) | Verified in the live prototype in a browser by Codex (18 Nov). Only the prototype was checked; no backend call is involved. |
| Other prototype links and the Flow 8 / Flow 9 URLs open without error | Not checked yet |
| File sharing "anyone with the link can view" | Not checked yet |
| Repository location of the PNG and PDF files | `docs/ui-ux/screens/` and `docs/ui-ux/exports/` |
| PR #62 (API 0.2.0 draft) merged | No. Frames that depend on it are marked in `ui-prototype.md`. |
| SRS #54 FR-02 and backlog US-02 AC1 on initial stock | **Open.** Both say stock starts at zero and initial stock is a separate adjustment. API draft #62 and frame `scr-04d` allow an optional initial quantity. Decision pending (section 4 of `ui-prototype.md`). |

## 7. Known limits of the prototype

- The role buttons on the login frames and the "Preview as" switch on the orders frames exist only for the prototype. In the real application, the role and permissions come from the signed-in account.
- Deactivate and Reactivate change the state immediately in the prototype (04g → 04h → 04i). They are separate actions and are **not** part of "Save changes". See `ui-prototype.md`.
- Screens that the review lists as missing or undecided are not part of these 31 frames.
