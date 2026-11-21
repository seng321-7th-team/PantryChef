import type { ReactNode } from 'react';

interface StateMessageProps {
  tone: 'neutral' | 'error';
  title: string;
  detail?: string;
  code?: string | undefined;
  action?: ReactNode;
}

/** Loading, empty and error states (copy from scr-07a-states). */
export function StateMessage({ tone, title, detail, code, action }: StateMessageProps) {
  return (
    <div className={`state-message state-message--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <p className="state-message__title">{title}</p>
      {detail ? <p className="state-message__detail">{detail}</p> : null}
      {code ? <p className="state-message__code">Code: {code}</p> : null}
      {action}
    </div>
  );
}
