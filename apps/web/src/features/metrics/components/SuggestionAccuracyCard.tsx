import type { ReactElement } from 'react';

import { formatPercentage } from '@/features/metrics/metrics-format';
import { metricsCopy } from '@/features/metrics/metrics.copy';
import { Icon } from '@/shared/ui/icons/Icon';

interface SuggestionAccuracyCardProps {
  readonly percentage: number | null;
}

export function SuggestionAccuracyCard({ percentage }: SuggestionAccuracyCardProps): ReactElement {
  const copy = metricsCopy.suggestionAccuracy;

  return (
    <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
        <Icon name="sparkles" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h2 className="text-sm font-medium text-slate-800">{copy.label}</h2>
        <p className="text-xs text-slate-500">{copy.helper}</p>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
        {formatPercentage(percentage)}
      </p>
    </article>
  );
}
