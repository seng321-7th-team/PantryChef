import { createHttpOrdersService } from './httpOrdersService';
import { createMockOrdersService } from './mock/mockOrdersService';
import { figmaSampleOrders, manyPendingOrders } from './mock/sampleOrders';
import type { OrdersService } from './ordersService';

export type OrdersMode = 'mock' | 'http';

export interface OrdersConfig {
  mode: OrdersMode;
  /** Used only in http mode. */
  apiBaseUrl: string;
  /** Mock data set: "default", "empty", "many" or "list-error". Used only in mock mode. */
  mockScenario: string;
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export function readOrdersConfig(env: Record<string, string | undefined>, search: string): OrdersConfig {
  const rawMode = (env.VITE_ORDERS_MODE ?? 'mock').trim().toLowerCase();
  if (rawMode !== 'mock' && rawMode !== 'http') {
    throw new ConfigurationError(`VITE_ORDERS_MODE must be "mock" or "http" (got "${rawMode}").`);
  }
  const apiBaseUrl = (env.VITE_API_BASE_URL ?? '/v1').trim();
  if (rawMode === 'http' && apiBaseUrl === '') {
    throw new ConfigurationError('VITE_API_BASE_URL is empty; http mode needs the API base path.');
  }
  const mockScenario = new URLSearchParams(search).get('mock') ?? 'default';
  return { mode: rawMode, apiBaseUrl, mockScenario };
}

/**
 * Creates the orders service for the selected mode. There is no fallback between modes:
 * http mode never switches to mock data when the API is unreachable.
 */
export function createOrdersService(
  config: OrdersConfig,
  getAccessToken: () => string | null | undefined,
): OrdersService {
  if (config.mode === 'http') {
    return createHttpOrdersService({ baseUrl: config.apiBaseUrl, getAccessToken });
  }

  const latency = { listLatencyMs: 300, updateLatencyMs: 900 };
  switch (config.mockScenario) {
    case 'default':
      return createMockOrdersService({ orders: figmaSampleOrders(), ...latency });
    case 'empty':
      return createMockOrdersService({ orders: [], ...latency });
    case 'many':
      return createMockOrdersService({ orders: [...figmaSampleOrders(), ...manyPendingOrders(130)], ...latency });
    case 'list-error': {
      const service = createMockOrdersService({ orders: figmaSampleOrders(), ...latency });
      service.failNext('list', 'server-error');
      return service;
    }
    default:
      throw new ConfigurationError(`Unknown mock scenario "${config.mockScenario}".`);
  }
}
