import type { MetricsQuery, MetricsResponse } from '@incidents/shared';

import { httpClient } from '@/shared/api/http-client';

export async function getMetrics(query: MetricsQuery): Promise<MetricsResponse> {
  return httpClient.get<MetricsResponse>('/metrics', { ...query });
}
