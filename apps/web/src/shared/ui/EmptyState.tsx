import type { ReactElement, ReactNode } from 'react';

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      {description === undefined ? null : (
        <p className="max-w-md text-sm text-slate-600">{description}</p>
      )}
      {action}
    </div>
  );
}
