import type { ReactElement } from 'react';

import type { MetricsResponse } from '@incidents/shared';

import { metricsCopy } from '@/features/metrics/metrics.copy';
import { formatDate } from '@/shared/lib/format';
import { InlineAlert } from '@/shared/ui/InlineAlert';

import { CategoryBreakdown } from './CategoryBreakdown';
import { MetricsSummary } from './MetricsSummary';
import { StatusBreakdown } from './StatusBreakdown';

interface MetricsDashboardProps {
  readonly metrics: MetricsResponse;
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">
        {metricsCopy.period(formatDate(metrics.period.from), formatDate(metrics.period.to))}
      </p>
      <MetricsSummary metrics={metrics} />
      {metrics.openOverdue > 0 ? (
        <InlineAlert tone="warning">{metricsCopy.overdueNotice(metrics.openOverdue)}</InlineAlert>
      ) : null}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusBreakdown metrics={metrics} />
        <CategoryBreakdown metrics={metrics} />
      </div>
    </div>
  );
}
