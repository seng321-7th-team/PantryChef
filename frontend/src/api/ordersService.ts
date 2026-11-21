import type { ListOrdersQuery, Order, OrderPage, OrderStatusUpdate } from './types';

export interface RequestOptions {
  signal?: AbortSignal;
}

/** The only API boundary that screens use. Implementations: HTTP adapter and in-memory mock. */
export interface OrdersService {
  listOrders(query: ListOrdersQuery, options?: RequestOptions): Promise<OrderPage>;
  updateOrderStatus(
    orderId: string,
    update: OrderStatusUpdate,
    idempotencyKey: string,
    options?: RequestOptions,
  ): Promise<Order>;
}
