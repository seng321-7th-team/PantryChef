import { describe, expect, it } from 'vitest';
import { ApiProblemError, NetworkError, UnexpectedResponseError } from '../../api/errors';
import type { Problem } from '../../api/types';
import {
  describeCreateFailure,
  DUPLICATE_NAME,
  THRESHOLD_NOT_A_NUMBER,
  toIngredientCreate,
  validateIngredientForm,
} from './ingredientForm';

function problemError(status: number, code: string, extra: Partial<Problem> = {}) {
  return new ApiProblemError(status, { type: 'about:blank', title: `Title ${status}`, status, code, ...extra });
}

describe('toIngredientCreate', () => {
  it('builds the POST /ingredients body with a number threshold', () => {
    expect(toIngredientCreate({ name: 'Bulgur', unit: 'g', lowStockThreshold: '2000' })).toEqual({
      ok: true,
      body: { name: 'Bulgur', unit: 'g', lowStockThreshold: 2000 },
    });
    expect(toIngredientCreate({ name: 'Oil', unit: 'ml', lowStockThreshold: ' 0.5 ' })).toEqual({
      ok: true,
      body: { name: 'Oil', unit: 'ml', lowStockThreshold: 0.5 },
    });
  });

  it('sends name and unit as typed; range and text checks are left to S3-05 and the API', () => {
    expect(toIngredientCreate({ name: '  ', unit: 'piece', lowStockThreshold: '-1' })).toEqual({
      ok: true,
      body: { name: '  ', unit: 'piece', lowStockThreshold: -1 },
    });
  });

  it.each(['', '   ', 'abc', 'Infinity', '1e999'])('does not turn %j into 0 or NaN', (text) => {
    expect(toIngredientCreate({ name: 'Bulgur', unit: 'g', lowStockThreshold: text })).toEqual({
      ok: false,
      errors: { lowStockThreshold: THRESHOLD_NOT_A_NUMBER },
    });
  });
});

describe('validateIngredientForm (S3-05 extension point)', () => {
  it('reports nothing until S3-05 adds its rules', () => {
    expect(validateIngredientForm({ name: '', unit: 'g', lowStockThreshold: '-5' })).toEqual({});
  });
});

describe('describeCreateFailure', () => {
  it('puts 409 DUPLICATE_RESOURCE under Name (scr-04f)', () => {
    expect(describeCreateFailure(problemError(409, 'DUPLICATE_RESOURCE'))).toEqual({ fields: { name: DUPLICATE_NAME } });
  });

  it('puts contract field errors under their fields when the field name matches exactly', () => {
    const error = problemError(422, 'VALIDATION_FAILED', {
      errors: [
        { field: 'name', message: 'Name is required.' },
        { field: 'lowStockThreshold', message: 'Must be 0 or more.' },
      ],
    });
    expect(describeCreateFailure(error)).toEqual({
      fields: { name: 'Name is required.', lowStockThreshold: 'Must be 0 or more.' },
    });
  });

  it('lists field errors with another field spelling above the form instead of guessing', () => {
    const error = problemError(400, 'VALIDATION_FAILED', {
      errors: [
        { field: 'name', message: 'Too long.' },
        { field: '$.unit', message: 'Unknown unit.' },
      ],
    });
    expect(describeCreateFailure(error)).toEqual({
      fields: { name: 'Too long.' },
      notice: { title: 'The ingredient was not created.', detail: '$.unit: Unknown unit.', code: 'VALIDATION_FAILED' },
    });
  });

  it('shows the server text and code for other rejections, such as 403', () => {
    const error = problemError(403, 'FORBIDDEN', { detail: 'Only managers can create ingredients.' });
    expect(describeCreateFailure(error)).toEqual({
      fields: {},
      notice: { title: 'The ingredient was not created.', detail: 'Only managers can create ingredients.', code: 'FORBIDDEN' },
    });
  });

  it.each([
    ['no response', new NetworkError()],
    ['a 5xx answer', problemError(500, 'INTERNAL_ERROR')],
    ['an unreadable 2xx answer', new UnexpectedResponseError(201, 'Response body is not valid JSON')],
  ])('says the ingredient may exist after %s', (_label, error) => {
    expect(describeCreateFailure(error).notice?.title).toBe('The ingredient may have been created.');
    expect(describeCreateFailure(error).fields).toEqual({});
  });
});
