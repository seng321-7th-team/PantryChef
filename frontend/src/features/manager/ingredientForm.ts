import { ApiProblemError, isUncertainOutcome } from '../../api/errors';
import type { IngredientCreate, Unit } from '../../api/types';

/** What the New ingredient form holds. The threshold stays the raw text of the number input. */
export interface IngredientFormValues {
  name: string;
  unit: Unit;
  lowStockThreshold: string;
}

export type IngredientField = keyof IngredientFormValues;

/** One message per invalid field. An empty object means there is nothing to show. */
export type IngredientFieldErrors = Partial<Record<IngredientField, string>>;

export const INGREDIENT_FIELDS: readonly IngredientField[] = ['name', 'unit', 'lowStockThreshold'];

export const UNITS: readonly Unit[] = ['g', 'ml', 'piece'];

export const EMPTY_INGREDIENT_FORM: IngredientFormValues = { name: '', unit: 'g', lowStockThreshold: '' };

/**
 * Client-side input checks of the New ingredient form. Extension point for S3-05.
 *
 * The rules and their tests belong to S3-05 (Burcu), in a separate PR. Until then this returns no
 * errors, so nothing is checked in the browser: the API checks the request, and the mock service
 * checks only for a duplicate name.
 *
 * How the form uses it:
 * - It is called once per submit, with the current values, before anything is sent.
 * - Each returned message is shown under its field. The first invalid field (in form order) gets focus.
 * - If it returns any message, no request is sent.
 * - Server errors are shown in the same place, so the form does not need a second error display.
 *
 * The form accepts another validator through its `validate` prop, which the tests use.
 */
export type IngredientFormValidator = (values: IngredientFormValues) => IngredientFieldErrors;

export const validateIngredientForm: IngredientFormValidator = () => ({});

export const THRESHOLD_NOT_A_NUMBER = 'Enter the low-stock threshold as a number.';

/**
 * Builds the `POST /ingredients` body from the form values. Name and unit are sent as they are.
 *
 * Payload-construction safeguard, not S3-05 input validation: `lowStockThreshold` must be a JSON
 * number, and an empty or non-finite input cannot be sent as one without turning it into 0 or NaN.
 * In that case no body is built and the threshold field gets `THRESHOLD_NOT_A_NUMBER`. A message from
 * the S3-05 validator for the same field replaces it. Business rules (for example a negative
 * threshold or an empty name) are not checked here; they stay with S3-05, which is not done yet, and
 * the API.
 */
export function toIngredientCreate(
  values: IngredientFormValues,
): { ok: true; body: IngredientCreate } | { ok: false; errors: IngredientFieldErrors } {
  const text = values.lowStockThreshold.trim();
  const threshold = Number(text);
  if (text === '' || !Number.isFinite(threshold)) {
    return { ok: false, errors: { lowStockThreshold: THRESHOLD_NOT_A_NUMBER } };
  }
  return { ok: true, body: { name: values.name, unit: values.unit, lowStockThreshold: threshold } };
}

export function firstInvalidField(errors: IngredientFieldErrors): IngredientField | undefined {
  return INGREDIENT_FIELDS.find((field) => errors[field] !== undefined);
}

export interface FormNotice {
  title: string;
  detail: string;
  code?: string | undefined;
}

export interface CreateFailure {
  fields: IngredientFieldErrors;
  notice?: FormNotice;
}

/** Figma scr-04f-new-ingredient-duplicate. */
export const DUPLICATE_NAME = 'An ingredient with this name already exists.';

const NOT_CREATED = 'The ingredient was not created.';

/**
 * Turns a rejected `createIngredient` call into messages for the form.
 *
 * - `409 DUPLICATE_RESOURCE`: message under Name (scr-04f).
 * - Problem `errors[]`: each message under its field when `field` is exactly `name`, `unit` or
 *   `lowStockThreshold`. The contract only calls `field` a "JSON path", so other spellings are not
 *   guessed: they are listed above the form instead.
 * - No answer, a 5xx answer or an unreadable answer: the ingredient may or may not exist, and
 *   `POST /ingredients` has no Idempotency-Key in the contract. The inventory list of this build is
 *   sample data plus this session's results, not `GET /inventory`, so it cannot confirm the outcome.
 *   The notice relies only on the contract's unique names: a repeat that finds the ingredient
 *   already created gets `409 DUPLICATE_RESOURCE`.
 * - Anything else (for example 401 or 403): a notice with the server's text and code.
 */
export function describeCreateFailure(error: unknown): CreateFailure {
  if (isUncertainOutcome(error)) {
    return {
      fields: {},
      notice: {
        title: 'The ingredient may have been created.',
        detail: 'No clear answer came back. If you try again and it was created, the name is reported as already existing.',
        code: error instanceof ApiProblemError ? error.code : undefined,
      },
    };
  }

  if (!(error instanceof ApiProblemError)) {
    return { fields: {}, notice: { title: NOT_CREATED, detail: 'Something went wrong. Try again.' } };
  }

  if (error.code === 'DUPLICATE_RESOURCE') {
    return { fields: { name: DUPLICATE_NAME } };
  }

  const fields: IngredientFieldErrors = {};
  const unmatched: string[] = [];
  for (const fieldError of error.problem?.errors ?? []) {
    const field = INGREDIENT_FIELDS.find((name) => name === fieldError.field);
    if (field && fields[field] === undefined) fields[field] = fieldError.message;
    else if (!field) unmatched.push(`${fieldError.field}: ${fieldError.message}`);
  }

  if (Object.keys(fields).length > 0 && unmatched.length === 0) return { fields };

  const detail = unmatched.length > 0 ? unmatched.join(' ') : (error.problem?.detail ?? error.message);
  return { fields, notice: { title: NOT_CREATED, detail, code: error.code } };
}
