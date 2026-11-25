import { ApiProblemError, NetworkError, RequestAbortedError, UnexpectedResponseError } from './errors';
import type { Problem } from './types';

export interface HttpClientOptions {
  /** Base path of the API, for example "/v1". */
  baseUrl: string;
  /** Supplies the bearer token. Token storage is not part of this build. */
  getAccessToken: () => string | null | undefined | Promise<string | null | undefined>;
  fetchImpl?: typeof fetch;
}

/** Shared request logic for the HTTP services. It has no mock fallback: errors are thrown to the caller. */
export interface HttpClient {
  /** Sends a request to `baseUrl + path` and returns the parsed JSON body of a 2xx answer. */
  request<T>(path: string, init: RequestInit, signal?: AbortSignal): Promise<T>;
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

export function createHttpClient(options: HttpClientOptions): HttpClient {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const fetchImpl = options.fetchImpl ?? ((input, init) => fetch(input, init));

  async function request<T>(path: string, init: RequestInit, signal?: AbortSignal): Promise<T> {
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

  return { request };
}
