import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import type { MetricsQuery, MetricsResponse } from '@incidents/shared';

import { getMetrics } from '@/features/metrics/api/metrics.api';
import { metricsKeys } from '@/features/metrics/api/metrics.keys';

export function useMetrics(query: MetricsQuery): UseQueryResult<MetricsResponse> {
  return useQuery({
    queryKey: metricsKeys.summary(query),
    queryFn: async () => getMetrics(query),
    placeholderData: keepPreviousData,
  });
}
