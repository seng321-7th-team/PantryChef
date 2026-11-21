import { useSyncExternalStore } from 'react';
import { parseRoute, type Route } from './routes';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function readHash(): string {
  return window.location.hash;
}

/** Current route from the location hash. Page changes need no extra package and no server routing. */
export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, readHash, () => '');
  return parseRoute(hash);
}
