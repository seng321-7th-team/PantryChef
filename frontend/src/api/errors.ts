import type { Problem } from './types';

/** The server answered with an error status. `problem` is set when the body was application/problem+json. */
export class ApiProblemError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly problem: Problem | undefined;

  constructor(status: number, problem?: Problem) {
    super(problem?.title ?? `Request failed with status ${status}`);
    this.name = 'ApiProblemError';
    this.status = status;
    this.problem = problem;
    this.code = problem?.code;
  }
}

/** No HTTP response was received. The server may or may not have applied a write request. */
export class NetworkError extends Error {
  constructor(message = 'Network request failed', options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'NetworkError';
  }
}

/** A response arrived but could not be read as the expected JSON. */
export class UnexpectedResponseError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'UnexpectedResponseError';
    this.status = status;
  }
}

/** The caller cancelled the request (for example when the board is closed). */
export class RequestAbortedError extends Error {
  constructor() {
    super('Request aborted');
    this.name = 'RequestAbortedError';
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof RequestAbortedError;
}

/**
 * True when a write request may or may not have been applied: no response, or a 5xx answer.
 * A retry of the same logical operation must reuse its Idempotency-Key and body.
 */
export function isUncertainOutcome(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof ApiProblemError) return error.status >= 500;
  if (error instanceof UnexpectedResponseError) return error.status >= 500;
  return false;
}
