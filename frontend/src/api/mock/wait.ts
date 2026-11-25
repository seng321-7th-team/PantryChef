import { RequestAbortedError } from '../errors';

/** Simulated response time of the mock services. Rejects with `RequestAbortedError` when the signal aborts. */
export function wait(ms: number, signal: AbortSignal | undefined): Promise<void> {
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
