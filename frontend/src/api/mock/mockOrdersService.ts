import { ApiProblemError, NetworkError, RequestAbortedError, UnexpectedResponseError } from '../errors';
import type { OrdersService, RequestOptions } from '../ordersService';
import type { ListOrdersQuery, Order, OrderPage, OrderStatus, OrderStatusUpdate, Problem } from '../types';
import { sampleChef } from './sampleOrders';

// In-memory stand-in for the orders API. It follows the status transitions and error
// shapes of api/openapi.yaml so the screen can be exercised without a backend.
// It does not model stock, reservations, transactions or concurrency, and its results
// are not evidence for backend behaviour.

export type MockFault =
  | 'network' // request fails before the server applies it
  | 'network-after-apply' // write is applied, then the response is lost
  | 'unreadable-after-apply' // write is applied, then the 2xx response body cannot be read
  | 'server-error' // 500 INTERNAL_ERROR
  | 'conflict'; // 409 INVALID_STATUS_TRANSITION

export interface MockOrdersServiceOptions {
  orders: Order[];
  /** Simulated response time for list requests, in ms. */
  listLatencyMs?: number;
  /** Simulated response time for status changes, in ms. */
  updateLatencyMs?: number;
  now?: () => Date;
}

export interface MockOrdersService extends OrdersService {
  /** Makes the next call of the given operation fail once. */
  failNext(operation: 'list' | 'update', fault: MockFault): void;
  /** Changes an order's status directly, as if another user had done it. */
  setStatusExternally(orderNumber: number, status: OrderStatus): void;
  snapshot(): Order[];
  readonly calls: {
    list: ListOrdersQuery[];
    update: Array<{ orderId: string; update: OrderStatusUpdate; idempotencyKey: string }>;
  };
}

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['CANCELLED'],
  CANCELLED: [],
};

function problem(status: number, code: string, title: string, detail?: string): ApiProblemError {
  const body: Problem = { type: `about:blank`, title, status, code, ...(detail ? { detail } : {}) };
  return new ApiProblemError(status, body);
}

function wait(ms: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new RequestAbortedError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new RequestAbortedError());
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

const clone = <T,>(value: T): T => structuredClone(value);

export function createMockOrdersService(options: MockOrdersServiceOptions): MockOrdersService {
  const orders = new Map(options.orders.map((order) => [order.id, clone(order)]));
  const listLatency = options.listLatencyMs ?? 0;
  const updateLatency = options.updateLatencyMs ?? 0;
  const now = options.now ?? (() => new Date());
  const faults: Record<'list' | 'update', MockFault[]> = { list: [], update: [] };
  const replays = new Map<string, { body: string; result: Order }>();
  const calls: MockOrdersService['calls'] = { list: [], update: [] };

  function applyTransition(order: Order, target: OrderStatus): Order {
    const changedAt = now().toISOString();
    order.statusHistory.push({ fromStatus: order.status, toStatus: target, changedBy: sampleChef, changedAt });
    order.status = target;
    order.updatedAt = changedAt;
    return clone(order);
  }

  return {
    calls,

    failNext(operation, fault) {
      faults[operation].push(fault);
    },

    setStatusExternally(orderNumber, status) {
      const order = [...orders.values()].find((o) => o.orderNumber === orderNumber);
      if (!order) throw new Error(`Unknown order #${orderNumber}`);
      applyTransition(order, status);
    },

    snapshot() {
      return [...orders.values()].map(clone);
    },

    async listOrders(query: ListOrdersQuery, requestOptions?: RequestOptions): Promise<OrderPage> {
      calls.list.push({ ...query });
      await wait(listLatency, requestOptions?.signal);
      const fault = faults.list.shift();
      if (fault === 'network' || fault === 'network-after-apply') throw new NetworkError();
      if (fault === 'server-error') throw problem(500, 'INTERNAL_ERROR', 'Internal server error');

      const direction = query.sort === 'createdAt' ? 1 : -1;
      const matching = [...orders.values()]
        .filter((order) => order.status === query.status)
        .sort((a, b) => direction * a.createdAt.localeCompare(b.createdAt));
      const start = (query.page - 1) * query.size;
      return {
        items: matching.slice(start, start + query.size).map(clone),
        page: {
          number: query.page,
          size: query.size,
          totalItems: matching.length,
          totalPages: Math.ceil(matching.length / query.size),
        },
      };
    },

    async updateOrderStatus(orderId, update, idempotencyKey, requestOptions): Promise<Order> {
      calls.update.push({ orderId, update: { ...update }, idempotencyKey });
      await wait(updateLatency, requestOptions?.signal);
      const fault = faults.update.shift();
      if (fault === 'network') throw new NetworkError();
      if (fault === 'server-error') throw problem(500, 'INTERNAL_ERROR', 'Internal server error');

      const body = JSON.stringify({ orderId, update });
      const replay = replays.get(idempotencyKey);
      if (replay) {
        if (replay.body !== body) {
          throw problem(422, 'IDEMPOTENCY_KEY_REUSED', 'Idempotency key reused with a different request');
        }
        return clone(replay.result);
      }

      const order = orders.get(orderId);
      if (!order) throw problem(404, 'RESOURCE_NOT_FOUND', 'Order not found');
      if (fault === 'conflict' || !allowedTransitions[order.status].includes(update.status)) {
        throw problem(
          409,
          'INVALID_STATUS_TRANSITION',
          'Invalid status transition',
          `Order ${order.orderNumber} is ${order.status}; ${update.status} is not allowed.`,
        );
      }

      const result = applyTransition(order, update.status);
      replays.set(idempotencyKey, { body, result });
      if (fault === 'network-after-apply') throw new NetworkError();
      if (fault === 'unreadable-after-apply') throw new UnexpectedResponseError(200, 'Response body is not valid JSON');
      return result;
    },
  };
}
