import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import type { IngredientsService } from '../../api/ingredientsService';
import type { Ingredient, Unit } from '../../api/types';
import { Banner } from '../../components/Banner';
import {
  describeCreateFailure,
  EMPTY_INGREDIENT_FORM,
  firstInvalidField,
  toIngredientCreate,
  UNITS,
  validateIngredientForm,
  type FormNotice,
  type IngredientField,
  type IngredientFieldErrors,
  type IngredientFormValidator,
  type IngredientFormValues,
} from './ingredientForm';

interface NewIngredientDialogProps {
  open: boolean;
  service: IngredientsService;
  /** Called with `false` when the dialog closes (Cancel, Escape or a successful create). */
  onOpenChange: (open: boolean) => void;
  /** Called with the created ingredient. The dialog has already cleared its fields. */
  onCreated: (ingredient: Ingredient) => void;
  /** Client-side checks; see `validateIngredientForm` (S3-05). */
  validate?: IngredientFormValidator;
}

/**
 * scr-04d / scr-04e / scr-04f: New ingredient. A native modal `<dialog>`: Escape closes it, the page
 * behind it is inert, and focus starts in Name. While the request runs the fields are read-only,
 * Cancel and Escape do nothing and a second submit is ignored. Entered values stay after an error.
 */
export function NewIngredientDialog({
  open,
  service,
  onOpenChange,
  onCreated,
  validate = validateIngredientForm,
}: NewIngredientDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLSelectElement>(null);
  const thresholdRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(false);
  const focusAfterRender = useRef<IngredientField | 'submit' | null>(null);

  const [values, setValues] = useState<IngredientFormValues>(EMPTY_INGREDIENT_FORM);
  const [errors, setErrors] = useState<IngredientFieldErrors>({});
  const [notice, setNotice] = useState<FormNotice | null>(null);
  const [pending, setPending] = useState(false);

  const id = useId();
  const fieldId = (field: IngredientField) => `${id}-${field}`;
  const errorId = (field: IngredientField) => `${id}-${field}-error`;
  const hintId = (field: IngredientField) => `${id}-${field}-hint`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      nameRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Runs after every render: moves focus once the fields are editable again after a request.
  useEffect(() => {
    const target = focusAfterRender.current;
    if (!target) return;
    focusAfterRender.current = null;
    const element = { name: nameRef, unit: unitRef, lowStockThreshold: thresholdRef, submit: submitRef }[target].current;
    element?.focus();
  });

  function reset() {
    setValues(EMPTY_INGREDIENT_FORM);
    setErrors({});
    setNotice(null);
  }

  function change<K extends IngredientField>(field: K, value: IngredientFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (current[field] === undefined) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current) return;
    setNotice(null);

    const built = toIngredientCreate(values);
    const found: IngredientFieldErrors = { ...(built.ok ? {} : built.errors), ...validate(values) };
    const invalid = firstInvalidField(found);
    if (invalid || !built.ok) {
      setErrors(found);
      focusAfterRender.current = invalid ?? 'lowStockThreshold';
      return;
    }

    setErrors({});
    pendingRef.current = true;
    setPending(true);
    try {
      const ingredient = await service.createIngredient(built.body);
      pendingRef.current = false;
      setPending(false);
      reset();
      onCreated(ingredient);
    } catch (error) {
      pendingRef.current = false;
      setPending(false);
      const failure = describeCreateFailure(error);
      setErrors(failure.fields);
      setNotice(failure.notice ?? null);
      focusAfterRender.current = firstInvalidField(failure.fields) ?? 'submit';
      // A browser may close a modal dialog on a repeated Escape even while the request runs.
      if (!dialogRef.current?.open) onOpenChange(true);
    }
  }

  function describedBy(field: IngredientField, hint: boolean) {
    const ids = [hint ? hintId(field) : null, errors[field] !== undefined ? errorId(field) : null].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }

  function fieldError(field: IngredientField) {
    const message = errors[field];
    return message === undefined ? null : (
      <p id={errorId(field)} className="field__error">
        {message}
      </p>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-subtitle`}
      onCancel={(event) => {
        if (pendingRef.current) event.preventDefault();
      }}
      onClose={() => {
        if (!pendingRef.current) reset();
        onOpenChange(false);
      }}
    >
      <form className="dialog__form" noValidate aria-busy={pending} onSubmit={(event) => void handleSubmit(event)}>
        <h2 id={`${id}-title`} className="dialog__title">
          New ingredient
        </h2>
        <p id={`${id}-subtitle`} className="dialog__subtitle">
          Adds an ingredient to the catalogue
        </p>

        {notice ? <Banner role="alert" title={notice.title} detail={notice.detail} code={notice.code} /> : null}

        <div className="field">
          <label className="field__label" htmlFor={fieldId('name')}>
            Name
          </label>
          <input
            ref={nameRef}
            id={fieldId('name')}
            className="field__input"
            type="text"
            autoComplete="off"
            value={values.name}
            readOnly={pending}
            aria-invalid={errors.name !== undefined || undefined}
            aria-describedby={describedBy('name', false)}
            onChange={(event) => change('name', event.target.value)}
          />
          {fieldError('name')}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={fieldId('unit')}>
            Unit
          </label>
          <select
            ref={unitRef}
            id={fieldId('unit')}
            className="field__input"
            value={values.unit}
            disabled={pending}
            aria-invalid={errors.unit !== undefined || undefined}
            aria-describedby={describedBy('unit', true)}
            onChange={(event) => change('unit', event.target.value as Unit)}
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <p id={hintId('unit')} className="field__hint">
            g, ml or piece. No unit conversion.
          </p>
          {fieldError('unit')}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={fieldId('lowStockThreshold')}>
            Low-stock threshold ({values.unit})
          </label>
          <input
            ref={thresholdRef}
            id={fieldId('lowStockThreshold')}
            className="field__input"
            type="number"
            inputMode="decimal"
            value={values.lowStockThreshold}
            readOnly={pending}
            aria-invalid={errors.lowStockThreshold !== undefined || undefined}
            aria-describedby={describedBy('lowStockThreshold', true)}
            onChange={(event) => change('lowStockThreshold', event.target.value)}
          />
          <p id={hintId('lowStockThreshold')} className="field__hint">
            Starts with 0 stock. Add stock using Adjust.
          </p>
          {fieldError('lowStockThreshold')}
        </div>

        <div className="dialog__actions">
          <button type="button" className="btn btn--outline-muted" disabled={pending} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          {/* aria-disabled keeps keyboard focus on the button while the request runs. */}
          <button ref={submitRef} type="submit" className="btn btn--primary" aria-disabled={pending || undefined}>
            {pending ? 'Creating…' : 'Create ingredient'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
