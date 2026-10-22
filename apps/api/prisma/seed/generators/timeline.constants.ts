import { IncidentStatus } from '@incidents/shared';

type ProgressFractions = Readonly<Partial<Record<IncidentStatus, number>>>;

export const CLOSED_PROGRESS: ProgressFractions = {
  [IncidentStatus.UNDER_REVIEW]: 0.1,
  [IncidentStatus.ASSIGNED]: 0.25,
  [IncidentStatus.IN_PROGRESS]: 0.4,
  [IncidentStatus.CLOSED]: 1,
};

export const REJECTED_PROGRESS: ProgressFractions = {
  [IncidentStatus.UNDER_REVIEW]: 0.4,
  [IncidentStatus.REJECTED]: 1,
};

export const OPEN_PROGRESS: ProgressFractions = {
  [IncidentStatus.UNDER_REVIEW]: 0.15,
  [IncidentStatus.ASSIGNED]: 0.35,
  [IncidentStatus.IN_PROGRESS]: 0.55,
};

export const EVIDENCE_BEFORE_CLOSURE_PROGRESS = 0.85;

export const RESOLUTION_PATH: readonly IncidentStatus[] = [
  IncidentStatus.UNDER_REVIEW,
  IncidentStatus.ASSIGNED,
  IncidentStatus.IN_PROGRESS,
  IncidentStatus.CLOSED,
];

export const REJECTION_PATH: readonly IncidentStatus[] = [
  IncidentStatus.UNDER_REVIEW,
  IncidentStatus.REJECTED,
];
