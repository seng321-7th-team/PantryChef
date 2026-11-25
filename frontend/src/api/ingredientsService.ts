import type { RequestOptions } from './ordersService';
import type { Ingredient, IngredientCreate } from './types';

/**
 * The ingredient operations that screens use. Only `createIngredient` exists so far (New ingredient
 * form). The only implementation in this build is the in-memory mock; there is no HTTP adapter yet.
 */
export interface IngredientsService {
  /** `POST /ingredients`. Rejects with the errors of `./errors` (for example `ApiProblemError`). */
  createIngredient(input: IngredientCreate, options?: RequestOptions): Promise<Ingredient>;
}
