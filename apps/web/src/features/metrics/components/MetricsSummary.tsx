import type { ReactElement } from 'react';

import type { MetricsResponse } from '@incidents/shared';

import { formatHours, formatPercentage } from '@/features/metrics/metrics-format';
import { metricsCopy } from '@/features/metrics/metrics.copy';
import { formatInteger } from '@/shared/lib/format';

import { MetricCard } from './MetricCard';

interface MetricsSummaryProps {
  readonly metrics: MetricsResponse;
}

export function MetricsSummary({ metrics }: MetricsSummaryProps): ReactElement {
  const { cards } = metricsCopy;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <MetricCard
        icon="inbox"
        label={cards.total.label}
        value={formatInteger(metrics.totalIncidents)}
        helper={cards.total.helper}
      />
      <MetricCard
        icon="clock"
        label={cards.resolution.label}
        value={formatHours(metrics.averageResolutionHours)}
        helper={cards.resolution.helper}
      />
      <MetricCard
        icon="checkCircle"
        label={cards.withinSla.label}
        value={formatPercentage(metrics.percentWithinSla)}
        helper={cards.withinSla.helper}
      />
      <MetricCard
        icon="camera"
        label={cards.evidence.label}
        value={formatPercentage(metrics.percentWithEvidenceAtClosure)}
        helper={cards.evidence.helper}
      />
    </div>
  );
}
