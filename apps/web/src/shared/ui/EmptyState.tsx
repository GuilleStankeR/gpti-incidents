import type { ReactElement, ReactNode } from 'react';

import { Icon } from './icons/Icon';
import type { IconName } from './icons/icon-paths';

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: IconName;
  readonly action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
      {icon === undefined ? null : (
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Icon name={icon} size="lg" />
        </span>
      )}
      <p className="font-medium text-slate-900">{title}</p>
      {description === undefined ? null : (
        <p className="max-w-md text-sm text-slate-600">{description}</p>
      )}
      {action}
    </div>
  );
}
