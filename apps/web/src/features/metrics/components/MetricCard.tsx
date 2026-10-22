import type { ReactElement } from 'react';

import { Icon } from '@/shared/ui/icons/Icon';
import type { IconName } from '@/shared/ui/icons/icon-paths';

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly helper: string;
  readonly icon: IconName;
}

export function MetricCard({ label, value, helper, icon }: MetricCardProps): ReactElement {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:gap-3 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xs font-medium text-slate-600 sm:text-sm">{label}</h2>
        <span className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent sm:flex">
          <Icon name={icon} />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
        {value}
      </p>
      <p className="text-xs text-slate-500">{helper}</p>
    </article>
  );
}
