import { describe, expect, it, vi } from 'vitest';
import { ApiProblemError, NetworkError, RequestAbortedError, UnexpectedResponseError } from './errors';
import { createHttpOrdersService } from './httpOrdersService';

const emptyPage = { items: [], page: { number: 1, size: 100, totalItems: 0, totalPages: 0 } };

function jsonResponse(body: unknown, status = 200, type = 'application/json') {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': type } });
}

function setup(token: string | null = 'token-123', response: () => Promise<Response> = async () => jsonResponse(emptyPage)) {
  const fetchImpl = vi.fn<typeof fetch>(() => response());
  const service = createHttpOrdersService({ baseUrl: '/v1/', getAccessToken: () => token, fetchImpl });
  return { service, fetchImpl };
}

function requestOf(fetchImpl: ReturnType<typeof setup>['fetchImpl']) {
  const [url, init] = fetchImpl.mock.calls[0]!;
  return { url: String(url), init: init!, headers: new Headers(init!.headers) };
}

describe('createHttpOrdersService', () => {
  it('lists orders with the board query and a bearer token', async () => {
    const { service, fetchImpl } = setup();
    await service.listOrders({ status: 'READY', sort: '-createdAt', page: 1, size: 100 });

    const { url, init, headers } = requestOf(fetchImpl);
    expect(url).toBe('/v1/orders?status=READY&sort=-createdAt&page=1&size=100');
    expect(init.method).toBe('GET');
    expect(headers.get('Authorization')).toBe('Bearer token-123');
    expect(headers.get('Accept')).toContain('application/problem+json');
  });

  it('sends no Authorization header when no token is available', async () => {
    const { service, fetchImpl } = setup(null);
    await service.listOrders({ status: 'PENDING', sort: 'createdAt', page: 1, size: 100 });
    expect(requestOf(fetchImpl).headers.has('Authorization')).toBe(false);
  });

  it('changes status with PATCH, a JSON body and the Idempotency-Key header', async () => {
    const order = { id: 'o-1', status: 'PREPARING' };
    const { service, fetchImpl } = setup('t', async () => jsonResponse(order));
    const result = await service.updateOrderStatus('o-1', { status: 'PREPARING' }, 'key-1');

    const { url, init, headers } = requestOf(fetchImpl);
    expect(url).toBe('/v1/orders/o-1/status');
    expect(init.method).toBe('PATCH');
    expect(init.body).toBe('{"status":"PREPARING"}');
    expect(headers.get('Idempotency-Key')).toBe('key-1');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(result).toEqual(order);
  });

  it('parses application/problem+json errors', async () => {
    const problem = { type: 'about:blank', title: 'Invalid status transition', status: 409, code: 'INVALID_STATUS_TRANSITION' };
    const { service } = setup('t', async () => jsonResponse(problem, 409, 'application/problem+json'));

    const error = await service.updateOrderStatus('o-1', { status: 'PREPARING' }, 'k').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiProblemError);
    expect((error as ApiProblemError).status).toBe(409);
    expect((error as ApiProblemError).code).toBe('INVALID_STATUS_TRANSITION');
    expect((error as ApiProblemError).problem).toEqual(problem);
  });

  it('keeps the status of error responses that are not Problem Details', async () => {
    const { service } = setup('t', async () => new Response('<html>Bad gateway</html>', { status: 502, headers: { 'Content-Type': 'text/html' } }));
    const error = await service.listOrders({ status: 'PENDING', sort: 'createdAt', page: 1, size: 100 }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiProblemError);
    expect((error as ApiProblemError).status).toBe(502);
    expect((error as ApiProblemError).problem).toBeUndefined();
  });

  it('rejects a successful response that is not JSON', async () => {
    const { service } = setup('t', async () => new Response('ok', { status: 200, headers: { 'Content-Type': 'text/plain' } }));
    await expect(service.listOrders({ status: 'PENDING', sort: 'createdAt', page: 1, size: 100 })).rejects.toBeInstanceOf(
      UnexpectedResponseError,
    );
  });

  it('separates network failures from cancelled requests', async () => {
    const failing = setup('t', async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(
      failing.service.listOrders({ status: 'PENDING', sort: 'createdAt', page: 1, size: 100 }),
    ).rejects.toBeInstanceOf(NetworkError);

    const controller = new AbortController();
    const aborted = setup('t', async () => {
      controller.abort();
      throw new DOMException('The operation was aborted.', 'AbortError');
    });
    await expect(
      aborted.service.listOrders({ status: 'PENDING', sort: 'createdAt', page: 1, size: 100 }, { signal: controller.signal }),
    ).rejects.toBeInstanceOf(RequestAbortedError);
  });
});
