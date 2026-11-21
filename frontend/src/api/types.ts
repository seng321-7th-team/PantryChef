// Subset of api/openapi.yaml used by this frontend.
// Compared field by field with api/openapi.yaml 0.2.1 on develop (7270d63). The order schemas below
// are used by the kitchen board requests (GET /orders, PATCH /orders/{orderId}/status). The schemas in
// the "Sample-data screens" section only type the read-only sample data of the waiter and manager
// screens; no request for them exists in this build.

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'CANCELLED';

export type Unit = 'g' | 'ml' | 'piece';

export interface UserSummary {
  id: string;
  username: string;
  fullName: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  recipeVersion: number;
  note?: string;
}

export interface StatusChange {
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  changedBy: UserSummary;
  changedAt: string;
  reason?: string;
}

export interface Cancellation {
  previousStatus: OrderStatus;
  late: boolean;
  reason?: string;
  cancelledBy: UserSummary;
  cancelledAt: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  tableLabel?: string;
  note?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  createdBy: UserSummary;
  createdAt: string;
  updatedAt: string;
  preparationStartedAt?: string;
  readyAt?: string;
  statusHistory: StatusChange[];
  cancellation?: Cancellation;
}

export interface PageMeta {
  number: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface OrderPage {
  items: Order[];
  page: PageMeta;
}

/** Target statuses that the kitchen board requests. CANCELLED is not offered on this screen. */
export type KitchenTargetStatus = 'PREPARING' | 'READY';

export interface OrderStatusUpdate {
  status: 'PREPARING' | 'READY' | 'CANCELLED';
  reason?: string;
}

export interface ListOrdersQuery {
  status: OrderStatus;
  sort: 'createdAt' | '-createdAt';
  page: number;
  size: number;
}

export interface FieldError {
  field: string;
  message: string;
}

/** One short ingredient in a `409 INSUFFICIENT_STOCK` answer. */
export interface StockShortage {
  ingredientId: string;
  ingredientName: string;
  unit: Unit;
  required: number;
  available: number;
}

/**
 * RFC 9457 Problem Details with the PantryChef `code` extension. `code` is an `ErrorCode` value in
 * the contract; it is kept as a string so that an unknown code is still shown instead of dropped.
 */
export interface Problem {
  type: string;
  title: string;
  status: number;
  code: string;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: FieldError[];
  shortages?: StockShortage[];
}

// ---------------------------------------------------------------------------------------------
// Sample-data screens (waiter and manager). Same field names and required fields as API 0.2.1.

export type Role = 'WAITER' | 'CHEF' | 'MANAGER';

export type Permission = 'ORDER_LATE_CANCEL';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  permissions: Permission[];
  active: boolean;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  availablePortions: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeLine {
  ingredientId: string;
  ingredientName: string;
  unit: Unit;
  quantity: number;
}

export interface Recipe {
  menuItemId: string;
  menuItemName: string;
  version: number;
  current: boolean;
  updatedBy?: UserSummary;
  lines: RecipeLine[];
  updatedAt: string;
}

export interface InventoryItem {
  ingredientId: string;
  ingredientName: string;
  ingredientActive: boolean;
  unit: Unit;
  onHand: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  /** `true` when the ingredient is active and `available <= lowStockThreshold`. */
  lowStock: boolean;
  updatedAt: string;
}

export type AuditAction =
  | 'ORDER_CANCELLED'
  | 'ORDER_LATE_CANCELLED'
  | 'STOCK_ADJUSTED'
  | 'RECIPE_UPDATED'
  | 'USER_PERMISSIONS_CHANGED'
  | 'INGREDIENT_DEACTIVATED'
  | 'INGREDIENT_REACTIVATED';

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  actor: UserSummary;
  entityType: 'ORDER' | 'INGREDIENT' | 'MENU_ITEM' | 'USER';
  entityId: string;
  previousStatus?: OrderStatus;
  reason?: string;
  /** Free-form object in the contract; its keys are not specified. */
  details?: Record<string, unknown>;
  occurredAt: string;
}
