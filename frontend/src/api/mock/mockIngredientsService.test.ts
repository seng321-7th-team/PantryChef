import { describe, expect, it } from 'vitest';
import { ApiProblemError, NetworkError, RequestAbortedError } from '../errors';
import type { IngredientsService } from '../ingredientsService';
import { createIngredientsService } from '../createIngredientsService';
import { createMockIngredientsService } from './mockIngredientsService';
import { sampleIngredients, sampleInventory } from './sampleScreens';

// These tests cover the in-memory mock only. They are not tests of the API or of server-side validation.

const NOW = new Date('2026-11-25T10:00:00.000Z');

function mock() {
  return createMockIngredientsService({
    ingredients: sampleIngredients(),
    now: () => NOW,
    newId: () => '00000000-0000-4000-8000-000000000599',
  });
}

describe('mock ingredients service', () => {
  it('returns an active ingredient with the request values and records the request body', async () => {
    const service = mock();
    const created = await service.createIngredient({ name: 'Bulgur', unit: 'g', lowStockThreshold: 2000 });

    expect(created).toEqual({
      id: '00000000-0000-4000-8000-000000000599',
      name: 'Bulgur',
      unit: 'g',
      lowStockThreshold: 2000,
      active: true,
      createdAt: '2026-11-25T10:00:00.000Z',
      updatedAt: '2026-11-25T10:00:00.000Z',
    });
    expect(service.calls).toEqual([{ name: 'Bulgur', unit: 'g', lowStockThreshold: 2000 }]);
    expect(service.snapshot().map((ingredient) => ingredient.name)).toContain('Bulgur');
  });

  it('answers 409 DUPLICATE_RESOURCE for a name that exists, including one created before', async () => {
    const service = mock();
    await expect(service.createIngredient({ name: 'Rice', unit: 'g', lowStockThreshold: 1 })).rejects.toMatchObject({
      status: 409,
      code: 'DUPLICATE_RESOURCE',
    });

    await service.createIngredient({ name: 'Bulgur', unit: 'g', lowStockThreshold: 1 });
    const again = service.createIngredient({ name: 'Bulgur', unit: 'ml', lowStockThreshold: 5 });
    await expect(again).rejects.toBeInstanceOf(ApiProblemError);
    expect(service.snapshot().filter((ingredient) => ingredient.name === 'Bulgur')).toHaveLength(1);
  });

  it('compares names exactly, because the contract does not define case or space handling', async () => {
    const service = mock();
    await expect(service.createIngredient({ name: 'rice', unit: 'g', lowStockThreshold: 1 })).resolves.toMatchObject({
      name: 'rice',
    });
  });

  it('fails the next call once with the chosen fault and creates nothing', async () => {
    const service = mock();
    const before = service.snapshot().length;

    service.failNext('network');
    await expect(service.createIngredient({ name: 'A', unit: 'g', lowStockThreshold: 1 })).rejects.toBeInstanceOf(NetworkError);
    service.failNext('server-error');
    await expect(service.createIngredient({ name: 'A', unit: 'g', lowStockThreshold: 1 })).rejects.toMatchObject({
      status: 500,
      code: 'INTERNAL_ERROR',
    });
    service.failNext('forbidden');
    await expect(service.createIngredient({ name: 'A', unit: 'g', lowStockThreshold: 1 })).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
    });
    expect(service.snapshot()).toHaveLength(before);

    await expect(service.createIngredient({ name: 'A', unit: 'g', lowStockThreshold: 1 })).resolves.toMatchObject({ name: 'A' });
  });

  it('rejects with RequestAbortedError when the signal aborts', async () => {
    const service = createMockIngredientsService({ ingredients: [], latencyMs: 1000 });
    const controller = new AbortController();
    const request = service.createIngredient({ name: 'A', unit: 'g', lowStockThreshold: 1 }, { signal: controller.signal });
    controller.abort();
    await expect(request).rejects.toBeInstanceOf(RequestAbortedError);
    expect(service.snapshot()).toHaveLength(0);
  });

  it('keeps the sample records separate: the seed list is copied, not changed', async () => {
    const seed = sampleIngredients();
    const service = createMockIngredientsService({ ingredients: seed });
    await service.createIngredient({ name: 'Bulgur', unit: 'g', lowStockThreshold: 1 });
    expect(seed).toHaveLength(8);
  });
});

describe('sample ingredients', () => {
  it('match the inventory sample rows by id, name, unit and threshold', () => {
    const inventory = sampleInventory();
    expect(sampleIngredients()).toEqual(
      inventory.map((item) =>
        expect.objectContaining({
          id: item.ingredientId,
          name: item.ingredientName,
          unit: item.unit,
          lowStockThreshold: item.lowStockThreshold,
          active: true,
        }),
      ),
    );
  });
});

describe('createIngredientsService', () => {
  it('gives the mock in mock mode and no service in http mode (no fallback)', () => {
    const service: IngredientsService | null = createIngredientsService('mock');
    expect(service).not.toBeNull();
    expect(createIngredientsService('http')).toBeNull();
  });
});
