import type { CategoryCount, MetricsResponse } from '@incidents/shared';

import {
  averageResolutionHours,
  percentWithEvidenceAtClosure,
  percentWithinSla,
  tallyByStatus,
} from './domain/metrics-calculator';
import type { MetricsFacts } from './metrics.repository';
import type { MetricsSnapshot } from './metrics.service';

function compareCategoryCounts(first: CategoryCount, second: CategoryCount): number {
  const countDifference = second.count - first.count;
  return countDifference === 0 ? first.name.localeCompare(second.name) : countDifference;
}

function toCategoryCounts(facts: MetricsFacts): CategoryCount[] {
  return facts.categories
    .map((category) => ({
      code: category.code,
      name: category.name,
      count: facts.categoryCounts.find((tally) => tally.categoryCode === category.code)?.count ?? 0,
    }))
    .toSorted(compareCategoryCounts);
}

export function toMetricsResponse({ period, facts }: MetricsSnapshot): MetricsResponse {
  return {
    period: { from: period.from.toISOString(), to: period.to.toISOString() },
    totalIncidents: facts.totalIncidents,
    byStatus: tallyByStatus(facts.statusCounts),
    byCategory: toCategoryCounts(facts),
    averageResolutionHours: averageResolutionHours(facts.closedIncidents),
    percentWithinSla: percentWithinSla(facts.closedIncidents),
    percentWithEvidenceAtClosure: percentWithEvidenceAtClosure(facts.closedIncidents),
    openOverdue: facts.openOverdue,
  };
}
