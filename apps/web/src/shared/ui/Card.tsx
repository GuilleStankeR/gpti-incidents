import type { ReactElement, ReactNode } from 'react';

interface CardProps {
  readonly title?: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

export function Card({ title, description, actions, children }: CardProps): ReactElement {
  const hasHeader = title !== undefined || actions !== undefined;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
      {hasHeader ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-0.5">
            {title === undefined ? null : (
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            )}
            {description === undefined ? null : (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
          {actions}
        </header>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
