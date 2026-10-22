import type { ReactElement } from 'react';

import type { MetricsRangeState } from '@/features/metrics/hooks/use-metrics-range';
import { metricsCopy } from '@/features/metrics/metrics.copy';
import { Button } from '@/shared/ui/Button';
import { DateRangeFields } from '@/shared/ui/DateRangeFields';

interface MetricsRangeFilterProps {
  readonly state: MetricsRangeState;
}

export function MetricsRangeFilter({ state }: MetricsRangeFilterProps): ReactElement {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-end">
      <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-md">
        <DateRangeFields
          fromLabel={metricsCopy.filters.fromLabel}
          toLabel={metricsCopy.filters.toLabel}
          value={state.range}
          onChange={state.setRange}
        />
      </div>
      {state.hasCustomRange ? (
        <Button variant="ghost" onClick={state.resetRange}>
          {metricsCopy.filters.reset}
        </Button>
      ) : (
        <p className="text-sm text-slate-500 sm:pb-3">{metricsCopy.defaultPeriodHint}</p>
      )}
    </section>
  );
}
