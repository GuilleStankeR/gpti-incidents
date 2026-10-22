import type { MetricsQuery } from '@incidents/shared';

export const metricsKeys = {
  all: ['metrics'] as const,
  summary: (query: MetricsQuery) => [...metricsKeys.all, query] as const,
};
