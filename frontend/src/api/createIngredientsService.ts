import type { OrdersMode } from './createOrdersService';
import type { IngredientsService } from './ingredientsService';
import { createMockIngredientsService } from './mock/mockIngredientsService';
import { sampleIngredients } from './mock/sampleScreens';

/**
 * Mock mode: an in-memory service that starts with the Figma sample ingredients. http mode: no
 * ingredients adapter exists yet, so there is no service (`null`) and the manager screens say they are
 * not connected. There is no fallback from http mode to the mock.
 */
export function createIngredientsService(mode: OrdersMode): IngredientsService | null {
  if (mode === 'http') return null;
  return createMockIngredientsService({ ingredients: sampleIngredients(), latencyMs: 600 });
}
