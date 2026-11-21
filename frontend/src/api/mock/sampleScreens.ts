import type { AuditLogEntry, InventoryItem, MenuItem, Recipe, User, UserSummary } from '../types';
import { sampleWaiter } from './sampleOrders';

// Read-only sample data for the waiter and manager screens. Values are the start states of the
// Figma frames scr-02a, scr-04a, scr-05a, scr-06a and scr-08a (export of 20 Nov 2026). No request
// returns this data; the screens show it only in mock mode.

const manager: UserSummary = { id: '00000000-0000-4000-8000-000000000401', username: 'manager01', fullName: 'Sample Manager' };

function today(hour: number, minute: number, base: Date = new Date()): string {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function onDate(month: number, day: number, hour: number, minute: number, base: Date = new Date()): string {
  return new Date(base.getFullYear(), month - 1, day, hour, minute).toISOString();
}

const ingredientId = (n: number) => `00000000-0000-4000-8000-0000000005${n.toString().padStart(2, '0')}`;
const INGREDIENT_NAMES = ['Eggs', 'Tomatoes', 'Red lentils', 'Chicken breast', 'Minced beef', 'Rice', 'Milk', 'Olive oil'];
const ingredientIdByName = (name: string) => ingredientId(INGREDIENT_NAMES.indexOf(name) + 1);
const menuItemId = (n: number) => `00000000-0000-4000-8000-0000000003${n.toString().padStart(2, '0')}`;

type StockRow = [name: string, unit: InventoryItem['unit'], onHand: number, reserved: number, threshold: number];

/** scr-04a-inventory. `available` and `lowStock` follow the contract rules. */
export function sampleInventory(): InventoryItem[] {
  const rows: StockRow[] = [
    ['Eggs', 'piece', 120, 2, 40],
    ['Tomatoes', 'g', 9500, 350, 5000],
    ['Red lentils', 'g', 3000, 200, 4000],
    ['Chicken breast', 'g', 1800, 1800, 3000],
    ['Minced beef', 'g', 500, 0, 2000],
    ['Rice', 'g', 14000, 0, 5000],
    ['Milk', 'ml', 11000, 0, 4000],
    ['Olive oil', 'ml', 6000, 115, 2000],
  ];
  return rows.map(([name, unit, onHand, reserved, threshold]) => {
    const available = onHand - reserved;
    return {
      ingredientId: ingredientIdByName(name),
      ingredientName: name,
      ingredientActive: true,
      unit,
      onHand,
      reserved,
      available,
      lowStockThreshold: threshold,
      lowStock: available <= threshold,
      updatedAt: today(12, 31),
    };
  });
}

/** scr-02a-waiter-default: portions available now. */
export function sampleMenuItems(): MenuItem[] {
  const rows: Array<[string, number, number]> = [
    ['Menemen', 150, 47],
    ['Lentil Soup', 90, 28],
    ['Grilled Chicken', 280, 0],
    ['Shepherd Salad', 110, 63],
    ['Köfte Plate', 320, 2],
    ['Rice Pudding', 70, 44],
  ];
  return rows.map(([name, price, availablePortions], index) => ({
    id: menuItemId(index + 1),
    name,
    price,
    active: true,
    availablePortions,
    createdAt: onDate(11, 1, 9, 0),
    updatedAt: onDate(11, 1, 9, 0),
  }));
}

/** Draft order shown in scr-02a ("Current order", table 4). Menu item name → quantity. */
export const SAMPLE_DRAFT: { tableLabel: string; lines: Array<[string, number]> } = {
  tableLabel: '4',
  lines: [
    ['Menemen', 1],
    ['Shepherd Salad', 1],
  ],
};

type LineSpec = [name: string, unit: InventoryItem['unit'], quantity: number];

function recipe(menuNumber: number, name: string, version: number, current: boolean, updatedAt: string, lines: LineSpec[]): Recipe {
  return {
    menuItemId: menuItemId(menuNumber),
    menuItemName: name,
    version,
    current,
    updatedBy: manager,
    updatedAt,
    lines: lines.map(([ingredientName, unit, quantity]) => ({
      ingredientId: ingredientIdByName(ingredientName),
      ingredientName,
      unit,
      quantity,
    })),
  };
}

export interface SampleRecipeHistory {
  menuItemName: string;
  /** Newest first; the first entry is the current version. */
  versions: Recipe[];
}

/**
 * scr-06a-recipes. Menemen has the three versions drawn in Figma. The other items show their
 * current version number from the menu list; their ingredient lines are not drawn in Figma and
 * are not invented here.
 */
export function sampleRecipes(): SampleRecipeHistory[] {
  const menemenLines: LineSpec[] = [
    ['Eggs', 'piece', 2],
    ['Tomatoes', 'g', 200],
    ['Olive oil', 'ml', 15],
  ];
  const others: Array<[number, string, number]> = [
    [2, 'Lentil Soup', 1],
    [3, 'Grilled Chicken', 2],
    [4, 'Shepherd Salad', 2],
    [5, 'Köfte Plate', 1],
    [6, 'Rice Pudding', 1],
  ];
  return [
    {
      menuItemName: 'Menemen',
      versions: [
        recipe(1, 'Menemen', 3, true, today(12, 26), menemenLines),
        recipe(1, 'Menemen', 2, false, onDate(11, 11, 9, 40), []),
        recipe(1, 'Menemen', 1, false, onDate(11, 1, 9, 0), []),
      ],
    },
    ...others.map(([n, name, version]) => ({
      menuItemName: name,
      versions: [recipe(n, name, version, true, onDate(11, 1, 9, 0), [])],
    })),
  ];
}

export interface SampleAuditRow {
  entry: AuditLogEntry;
  /** What the entry is about (ingredient, menu item or order), as shown in Figma. */
  subject: string;
  /** Display text drawn in Figma. The contract does not define the `details` keys behind it. */
  summary: string;
  actorRole: string;
}

/** Audit log of scr-05a-orders-and-audit, newest first. */
export function sampleAuditLog(): SampleAuditRow[] {
  return [
    {
      entry: { id: '00000000-0000-4000-8000-000000000601', action: 'STOCK_ADJUSTED', actor: manager, entityType: 'INGREDIENT', entityId: ingredientIdByName('Rice'), occurredAt: today(12, 31) },
      subject: 'Rice',
      summary: '+5000 g · reason: Purchase received',
      actorRole: 'Manager',
    },
    {
      entry: { id: '00000000-0000-4000-8000-000000000602', action: 'RECIPE_UPDATED', actor: manager, entityType: 'MENU_ITEM', entityId: menuItemId(1), occurredAt: today(12, 26) },
      subject: 'Menemen',
      summary: 'Recipe v2 → v3 · existing orders keep v2',
      actorRole: 'Manager',
    },
    {
      entry: { id: '00000000-0000-4000-8000-000000000603', action: 'ORDER_CANCELLED', actor: sampleWaiter, entityType: 'ORDER', entityId: '00000000-0000-4000-9000-000000001038', previousStatus: 'PENDING', occurredAt: today(12, 20) },
      subject: '#1038',
      summary: 'Pending → Cancelled · reservations released',
      actorRole: 'Waiter',
    },
  ];
}

/** Active waiters of scr-08a-staff-permissions. Only Deniz Yilmaz is selectable in Figma. */
export function sampleStaff(): User[] {
  return [
    { id: '00000000-0000-4000-8000-000000000101', username: 'waiter01', fullName: 'Deniz Yilmaz', role: 'WAITER', permissions: [], active: true, createdAt: onDate(11, 1, 9, 0) },
    { id: '00000000-0000-4000-8000-000000000102', username: 'waiter02', fullName: 'Elif Kaya', role: 'WAITER', permissions: [], active: true, createdAt: onDate(11, 1, 9, 0) },
  ];
}

/** "My open orders" in scr-02a. The API has no "created by me" filter, so this list is sample data only. */
export const SAMPLE_MY_OPEN_ORDER_NUMBERS = [1042, 1041];
