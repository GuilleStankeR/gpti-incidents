import { IncidentStatus, SlaStatus, isTerminalStatus } from '@incidents/shared';

import { addHours, hoursBetween, roundToDecimals } from '@/common/time/date-math';

import { HOURS_REMAINING_DECIMALS, SLA_AT_RISK_REMAINING_RATIO } from './domain.constants';

export interface SlaSnapshot {
  readonly status: IncidentStatus;
  readonly reportedAt: Date;
  readonly dueAt: Date;
  readonly closedAt: Date | null;
}

export function calculateDueAt(reportedAt: Date, slaHours: number): Date {
  return addHours(reportedAt, slaHours);
}

export function isOverdue(snapshot: SlaSnapshot, now: Date): boolean {
  if (snapshot.status === IncidentStatus.CLOSED) {
    return snapshot.closedAt !== null && snapshot.closedAt > snapshot.dueAt;
  }

  return !isTerminalStatus(snapshot.status) && now > snapshot.dueAt;
}

export function getHoursRemaining(snapshot: SlaSnapshot, now: Date): number | null {
  if (isTerminalStatus(snapshot.status)) {
    return null;
  }

  return roundToDecimals(hoursBetween(now, snapshot.dueAt), HOURS_REMAINING_DECIMALS);
}

export function getSlaStatus(snapshot: SlaSnapshot, now: Date): SlaStatus | null {
  if (isTerminalStatus(snapshot.status)) {
    return null;
  }

  if (now > snapshot.dueAt) {
    return SlaStatus.OVERDUE;
  }

  const totalHours = hoursBetween(snapshot.reportedAt, snapshot.dueAt);
  const remainingRatio = hoursBetween(now, snapshot.dueAt) / totalHours;

  return remainingRatio > SLA_AT_RISK_REMAINING_RATIO ? SlaStatus.ON_TRACK : SlaStatus.AT_RISK;
}
