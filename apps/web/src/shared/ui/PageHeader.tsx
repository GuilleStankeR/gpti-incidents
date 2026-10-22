import type { ReactElement, ReactNode } from 'react';

interface PageHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps): ReactElement {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">{title}</h1>
        {description === undefined ? null : <p className="text-sm text-slate-600">{description}</p>}
      </div>
      {actions === undefined ? null : (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      )}
    </header>
  );
}
