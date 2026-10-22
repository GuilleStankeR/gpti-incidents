import type { IncidentStatus } from '../incident-status.js';
import type { CategorySummary } from './catalogs.contracts.js';

export interface MetricsQuery {
  readonly from?: string;
  readonly to?: string;
}

export interface MetricsPeriod {
  readonly from: string;
  readonly to: string;
}

export interface CategoryCount extends CategorySummary {
  readonly count: number;
}

export interface MetricsResponse {
  readonly period: MetricsPeriod;
  readonly totalIncidents: number;
  readonly byStatus: Readonly<Record<IncidentStatus, number>>;
  readonly byCategory: readonly CategoryCount[];
  readonly averageResolutionHours: number | null;
  readonly percentWithinSla: number | null;
  readonly percentWithEvidenceAtClosure: number | null;
  readonly openOverdue: number;
}
