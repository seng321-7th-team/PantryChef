import type { ReactNode } from 'react';
import type { OrdersMode } from '../api/createOrdersService';
import { StateMessage } from './StateMessage';

interface SampleDataPageProps {
  title: string;
  subtitle?: string;
  mode: OrdersMode;
  /** What this screen cannot do yet, shown under the title. */
  notImplemented: string;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Frame for the waiter and manager screens. They have no API requests yet: mock mode shows the
 * Figma sample data read-only, and http mode says so instead of falling back to sample data.
 */
export function SampleDataPage({ title, subtitle, mode, notImplemented, actions, children }: SampleDataPageProps) {
  return (
    <main className="page">
      <div className="page__title-row">
        <div>
          <h1 className="page__title">{title}</h1>
          {subtitle ? <p className="page__subtitle">{subtitle}</p> : null}
        </div>
        {mode === 'mock' && actions ? <div className="page__actions">{actions}</div> : null}
      </div>
      {mode === 'http' ? (
        <StateMessage
          tone="neutral"
          title="This screen is not connected to the API yet."
          detail="Only the kitchen board sends API requests in this build. Use mock mode to see this screen with sample data."
        />
      ) : (
        <>
          <p className="preview-note" role="note">
            Sample data (Figma, 20 Nov 2026). {notImplemented}
          </p>
          {children}
        </>
      )}
    </main>
  );
}
