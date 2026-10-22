export const IncidentStatus = {
  REPORTED: 'REPORTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REJECTED: 'REJECTED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
} as const;

export type IncidentStatus = (typeof IncidentStatus)[keyof typeof IncidentStatus];

export const INCIDENT_STATUSES: readonly IncidentStatus[] = Object.values(IncidentStatus);

export const TERMINAL_STATUSES: readonly IncidentStatus[] = [
  IncidentStatus.REJECTED,
  IncidentStatus.CLOSED,
];

export const REASSIGNABLE_STATUSES: readonly IncidentStatus[] = [
  IncidentStatus.ASSIGNED,
  IncidentStatus.IN_PROGRESS,
];

export const STATUS_TRANSITIONS: Readonly<Record<IncidentStatus, readonly IncidentStatus[]>> = {
  [IncidentStatus.REPORTED]: [IncidentStatus.UNDER_REVIEW],
  [IncidentStatus.UNDER_REVIEW]: [IncidentStatus.REJECTED, IncidentStatus.ASSIGNED],
  [IncidentStatus.REJECTED]: [],
  [IncidentStatus.ASSIGNED]: [IncidentStatus.IN_PROGRESS],
  [IncidentStatus.IN_PROGRESS]: [IncidentStatus.CLOSED],
  [IncidentStatus.CLOSED]: [],
};

export function isTerminalStatus(status: IncidentStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isReassignableStatus(status: IncidentStatus): boolean {
  return REASSIGNABLE_STATUSES.includes(status);
}

export function isTransitionAllowed(from: IncidentStatus, to: IncidentStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}
