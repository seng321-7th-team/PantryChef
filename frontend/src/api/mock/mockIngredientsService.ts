import { ApiProblemError, NetworkError } from '../errors';
import type { IngredientsService } from '../ingredientsService';
import type { RequestOptions } from '../ordersService';
import type { Ingredient, IngredientCreate, Problem } from '../types';
import { wait } from './wait';

// In-memory stand-in for POST /ingredients, so the New ingredient form can be used without a backend.
// It does not check the field values: input validation is S3-05 (client) and the API (server).
// The only rule it applies is the unique name from api/openapi.yaml (409 DUPLICATE_RESOURCE), and it
// compares names exactly as typed, because the contract does not say whether case or surrounding
// spaces count. A success here is not evidence of server-side validation or of the real API.

export type MockIngredientsFault =
  | 'network' // request fails before the server applies it
  | 'server-error' // 500 INTERNAL_ERROR, nothing created
  | 'forbidden'; // 403 FORBIDDEN

export interface MockIngredientsServiceOptions {
  /** Existing ingredients, for example the Figma sample records. They are copied, not changed. */
  ingredients: Ingredient[];
  /** Simulated response time, in ms. */
  latencyMs?: number;
  now?: () => Date;
  newId?: () => string;
}

export interface MockIngredientsService extends IngredientsService {
  /** Makes the next create call fail once. */
  failNext(fault: MockIngredientsFault): void;
  snapshot(): Ingredient[];
  /** Request bodies in the order they were received, including rejected ones. */
  readonly calls: IngredientCreate[];
}

function problem(status: number, code: string, title: string, detail?: string): ApiProblemError {
  const body: Problem = { type: 'about:blank', title, status, code, ...(detail ? { detail } : {}) };
  return new ApiProblemError(status, body);
}

export function createMockIngredientsService(options: MockIngredientsServiceOptions): MockIngredientsService {
  const ingredients = options.ingredients.map((ingredient) => structuredClone(ingredient));
  const latency = options.latencyMs ?? 0;
  const now = options.now ?? (() => new Date());
  const newId = options.newId ?? (() => crypto.randomUUID());
  const faults: MockIngredientsFault[] = [];
  const calls: IngredientCreate[] = [];

  return {
    calls,
    failNext(fault) {
      faults.push(fault);
    },
    snapshot() {
      return structuredClone(ingredients);
    },
    async createIngredient(input: IngredientCreate, requestOptions?: RequestOptions) {
      calls.push(structuredClone(input));
      await wait(latency, requestOptions?.signal);

      const fault = faults.shift();
      if (fault === 'network') throw new NetworkError();
      if (fault === 'server-error') throw problem(500, 'INTERNAL_ERROR', 'Internal server error');
      if (fault === 'forbidden') {
        throw problem(403, 'FORBIDDEN', 'Forbidden', 'Only managers can create ingredients.');
      }

      if (ingredients.some((ingredient) => ingredient.name === input.name)) {
        throw problem(409, 'DUPLICATE_RESOURCE', 'Duplicate resource', `An ingredient named "${input.name}" already exists.`);
      }

      const timestamp = now().toISOString();
      const created: Ingredient = {
        id: newId(),
        name: input.name,
        unit: input.unit,
        lowStockThreshold: input.lowStockThreshold,
        active: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      ingredients.push(created);
      return structuredClone(created);
    },
  };
}
