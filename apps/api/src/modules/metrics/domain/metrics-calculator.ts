import { INCIDENT_STATUSES } from '@incidents/shared';
import type { IncidentStatus } from '@incidents/shared';

import { hoursBetween, roundToDecimals } from '@/common/time/date-math';

const PERCENT_SCALE = 100;
const METRIC_DECIMALS = 1;

export interface ClosedIncidentFacts {
  readonly reportedAt: Date;
  readonly closedAt: Date | null;
  readonly dueAt: Date;
  readonly evidenceCount: number;
}

export interface StatusCount {
  readonly status: IncidentStatus;
  readonly count: number;
}

function toPercentage(matching: number, total: number): number | null {
  if (total === 0) {
    return null;
  }

  return roundToDecimals((matching / total) * PERCENT_SCALE, METRIC_DECIMALS);
}

export function tallyByStatus(counts: readonly StatusCount[]): Record<IncidentStatus, number> {
  return Object.fromEntries(
    INCIDENT_STATUSES.map((status) => [
      status,
      counts.find((count) => count.status === status)?.count ?? 0,
    ]),
  ) as Record<IncidentStatus, number>;
}

export function averageResolutionHours(closed: readonly ClosedIncidentFacts[]): number | null {
  const resolutionHours = closed
    .filter((incident) => incident.closedAt !== null)
    .map((incident) => hoursBetween(incident.reportedAt, incident.closedAt ?? incident.reportedAt));

  if (resolutionHours.length === 0) {
    return null;
  }

  const totalHours = resolutionHours.reduce((sum, hours) => sum + hours, 0);
  return roundToDecimals(totalHours / resolutionHours.length, METRIC_DECIMALS);
}

export function percentWithinSla(closed: readonly ClosedIncidentFacts[]): number | null {
  const withinSla = closed.filter(
    (incident) => incident.closedAt !== null && incident.closedAt <= incident.dueAt,
  );
  return toPercentage(withinSla.length, closed.length);
}

export function percentWithEvidenceAtClosure(
  closed: readonly ClosedIncidentFacts[],
): number | null {
  const withEvidence = closed.filter((incident) => incident.evidenceCount > 0);
  return toPercentage(withEvidence.length, closed.length);
}
