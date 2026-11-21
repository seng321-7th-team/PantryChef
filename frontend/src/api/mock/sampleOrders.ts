import type { Order, OrderItem, OrderStatus, UserSummary } from '../types';

// Sample data from the Figma frame scr-03a-kitchen-board (32-frame export, 18 Nov 2026).
// Counters at the start: Pending 3 / Preparing 1 / Ready 1.

const waiter: UserSummary = { id: '00000000-0000-4000-8000-000000000101', username: 'waiter01', fullName: 'Sample Waiter' };
const chef: UserSummary = { id: '00000000-0000-4000-8000-000000000201', username: 'chef01', fullName: 'Sample Chef' };

const menu = {
  kofte: { id: '00000000-0000-4000-8000-000000000301', name: 'Köfte Plate', price: 320 },
  chicken: { id: '00000000-0000-4000-8000-000000000302', name: 'Grilled Chicken', price: 280 },
  menemen: { id: '00000000-0000-4000-8000-000000000303', name: 'Menemen', price: 150 },
  lentil: { id: '00000000-0000-4000-8000-000000000304', name: 'Lentil Soup', price: 90 },
  salad: { id: '00000000-0000-4000-8000-000000000305', name: 'Shepherd Salad', price: 110 },
  pudding: { id: '00000000-0000-4000-8000-000000000306', name: 'Rice Pudding', price: 70 },
} as const;

type MenuKey = keyof typeof menu;

interface SampleSpec {
  orderNumber: number;
  table: string;
  hour: number;
  minute: number;
  status: OrderStatus;
  lines: Array<[MenuKey, number, number]>; // menu item, quantity, recipe version
}

const specs: SampleSpec[] = [
  { orderNumber: 1039, table: '5', hour: 12, minute: 18, status: 'READY', lines: [['kofte', 2, 1]] },
  { orderNumber: 1040, table: '9', hour: 12, minute: 25, status: 'PENDING', lines: [['chicken', 6, 2]] },
  { orderNumber: 1041, table: '2', hour: 12, minute: 30, status: 'PREPARING', lines: [['menemen', 1, 3]] },
  { orderNumber: 1042, table: '7', hour: 12, minute: 41, status: 'PENDING', lines: [['lentil', 2, 1]] },
  {
    orderNumber: 1043,
    table: '4',
    hour: 12,
    minute: 44,
    status: 'PENDING',
    lines: [
      ['menemen', 1, 3],
      ['salad', 1, 2],
    ],
  },
];

function atLocalTime(base: Date, hour: number, minute: number): string {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function orderId(orderNumber: number): string {
  return `00000000-0000-4000-9000-00000000${orderNumber.toString().padStart(4, '0')}`;
}

export function buildOrder(spec: SampleSpec, base: Date): Order {
  const createdAt = atLocalTime(base, spec.hour, spec.minute);
  const items: OrderItem[] = spec.lines.map(([key, quantity, recipeVersion], index) => ({
    id: `${orderId(spec.orderNumber)}-${index + 1}`,
    menuItemId: menu[key].id,
    menuItemName: menu[key].name,
    quantity,
    unitPrice: menu[key].price,
    recipeVersion,
  }));
  const history: Order['statusHistory'] = [{ toStatus: 'PENDING', changedBy: waiter, changedAt: createdAt }];
  if (spec.status === 'PREPARING' || spec.status === 'READY') {
    history.push({ fromStatus: 'PENDING', toStatus: 'PREPARING', changedBy: chef, changedAt: createdAt });
  }
  if (spec.status === 'READY') {
    history.push({ fromStatus: 'PREPARING', toStatus: 'READY', changedBy: chef, changedAt: createdAt });
  }
  return {
    id: orderId(spec.orderNumber),
    orderNumber: spec.orderNumber,
    tableLabel: spec.table,
    status: spec.status,
    items,
    totalPrice: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    createdBy: waiter,
    createdAt,
    updatedAt: createdAt,
    statusHistory: history,
  };
}

/** The five orders shown in scr-03a: #1039 to #1043. */
export function figmaSampleOrders(base: Date = new Date()): Order[] {
  return specs.map((spec) => buildOrder(spec, base));
}

/** `count` PENDING orders, for checking the first-page limit ("Showing X of Y"). */
export function manyPendingOrders(count: number, base: Date = new Date()): Order[] {
  return Array.from({ length: count }, (_, i) =>
    buildOrder(
      {
        orderNumber: 2000 + i,
        table: String((i % 20) + 1),
        hour: 8 + Math.floor(i / 60),
        minute: i % 60,
        status: 'PENDING',
        lines: [['lentil', 1, 1]],
      },
      base,
    ),
  );
}

export const sampleChef = chef;
export const sampleWaiter = waiter;

/**
 * "Today's orders" from scr-05a-orders-and-audit: the five kitchen orders plus #1038, a Pending
 * order that was cancelled at 12:20 (audit entry ORDER_CANCELLED). Static sample data.
 */
export function todaysSampleOrders(base: Date = new Date()): Order[] {
  const cancelled = buildOrder(
    { orderNumber: 1038, table: '3', hour: 12, minute: 10, status: 'CANCELLED', lines: [['pudding', 1, 1]] },
    base,
  );
  const cancelledAt = atLocalTime(base, 12, 20);
  cancelled.statusHistory.push({ fromStatus: 'PENDING', toStatus: 'CANCELLED', changedBy: waiter, changedAt: cancelledAt });
  cancelled.cancellation = { previousStatus: 'PENDING', late: false, cancelledBy: waiter, cancelledAt };
  cancelled.updatedAt = cancelledAt;
  return [...figmaSampleOrders(base), cancelled].sort((a, b) => b.orderNumber - a.orderNumber);
}
