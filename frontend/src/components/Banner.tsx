import type { ReactNode } from 'react';

interface BannerProps {
  title: string;
  detail?: string;
  code?: string | undefined;
  /** "alert" for action results that need attention, "status" for background refresh issues. */
  role: 'alert' | 'status';
  children?: ReactNode;
}

/** Warning banner in the style of scr-03d-kitchen-conflict. */
export function Banner({ title, detail, code, role, children }: BannerProps) {
  return (
    <div className="banner" role={role}>
      <p className="banner__text">
        <strong>{title}</strong>
        {detail ? <span> {detail}</span> : null}
      </p>
      {code ? <span className="banner__code">Code: {code}</span> : null}
      {children}
    </div>
  );
}
