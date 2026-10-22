import type { ReactElement } from 'react';

import { MetricsDashboard } from '@/features/metrics/components/MetricsDashboard';
import { MetricsRangeFilter } from '@/features/metrics/components/MetricsRangeFilter';
import { useMetrics } from '@/features/metrics/hooks/use-metrics';
import { useMetricsRange } from '@/features/metrics/hooks/use-metrics-range';
import { metricsCopy } from '@/features/metrics/metrics.copy';
import { getErrorMessage } from '@/shared/api/error-message';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

export function MetricsPage(): ReactElement {
  const rangeState = useMetricsRange();
  const metricsQuery = useMetrics(rangeState.range);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={metricsCopy.title} description={metricsCopy.description} />
      <MetricsRangeFilter state={rangeState} />
      {metricsQuery.isPending ? <LoadingState /> : null}
      {metricsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(metricsQuery.error)}
          onRetry={() => void metricsQuery.refetch()}
        />
      ) : null}
      {metricsQuery.isSuccess ? <MetricsDashboard metrics={metricsQuery.data} /> : null}
    </div>
  );
}
