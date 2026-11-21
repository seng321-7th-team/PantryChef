import type { ReactNode } from 'react';

/**
 * Visible field name inside a table cell, shown only when the table is laid out as cards on narrow
 * screens (see `.table--stack` in app.css). Screen readers get the field name from the column header,
 * which stays in the accessibility tree, so this copy is hidden from them.
 */
export function CellLabel({ children }: { children: ReactNode }) {
  return (
    <span className="cell-label" aria-hidden="true">
      {children}
    </span>
  );
}
