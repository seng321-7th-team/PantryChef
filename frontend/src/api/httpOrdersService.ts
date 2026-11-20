import { ApiProblemError, NetworkError, RequestAbortedError, UnexpectedResponseError } from './errors';
import type { OrdersService, RequestOptions } from './ordersService';
import type { ListOrdersQuery, Order, OrderPage, OrderStatusUpdate, Problem } from './types';

export interface HttpOrdersServiceOptions {
  /** Base path of the API, for example "/v1". */
  baseUrl: string;
  /** Supplies the bearer token. Token storage is not part of this build. */
  getAccessToken: () => string | null | undefined | Promise<string | null | undefined>;
  fetchImpl?: typeof fetch;
}

function isProblem(value: unknown): value is Problem {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Problem).status === 'number' &&
    typeof (value as Problem).code === 'string'
  );
}

function mediaType(response: Response): string {
  return (response.headers.get('Content-Type') ?? '').split(';')[0]!.trim().toLowerCase();
}

export function createHttpOrdersService(options: HttpOrdersServiceOptions): OrdersService {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const fetchImpl = options.fetchImpl ?? ((input, init) => fetch(input, init));

  async function request<T>(path: string, init: RequestInit, signal: AbortSignal | undefined): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json, application/problem+json');
    const token = await options.getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let response: Response;
    try {
      response = await fetchImpl(`${baseUrl}${path}`, { ...init, headers, signal: signal ?? null });
    } catch (error) {
      if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
        throw new RequestAbortedError();
      }
      throw new NetworkError('Network request failed', { cause: error });
    }

    const type = mediaType(response);
    if (!response.ok) {
      let problem: Problem | undefined;
      if (type === 'application/problem+json' || type === 'application/json') {
        const body: unknown = await response.json().catch(() => undefined);
        if (isProblem(body)) problem = body;
      }
      throw new ApiProblemError(response.status, problem);
    }

    if (type !== 'application/json') {
      throw new UnexpectedResponseError(response.status, `Expected application/json, got "${type || 'none'}"`);
    }
    try {
      return (await response.json()) as T;
    } catch {
      throw new UnexpectedResponseError(response.status, 'Response body is not valid JSON');
    }
  }

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
