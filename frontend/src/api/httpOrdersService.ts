import { createHttpClient, type HttpClientOptions } from './httpClient';
import type { OrdersService, RequestOptions } from './ordersService';
import type { ListOrdersQuery, Order, OrderPage, OrderStatusUpdate } from './types';

export type HttpOrdersServiceOptions = HttpClientOptions;

export function createHttpOrdersService(options: HttpOrdersServiceOptions): OrdersService {
  const { request } = createHttpClient(options);

  return {
    listOrders(query: ListOrdersQuery, requestOptions?: RequestOptions) {
      const params = new URLSearchParams({
        status: query.status,
        sort: query.sort,
        page: String(query.page),
        size: String(query.size),
      });
      return request<OrderPage>(`/orders?${params.toString()}`, { method: 'GET' }, requestOptions?.signal);
    },

    updateOrderStatus(orderId: string, update: OrderStatusUpdate, idempotencyKey: string, requestOptions?: RequestOptions) {
      return request<Order>(
        `/orders/${encodeURIComponent(orderId)}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
          body: JSON.stringify(update),
        },
        requestOptions?.signal,
      );
    },
  };
}
