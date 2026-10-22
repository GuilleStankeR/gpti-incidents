import type { IncidentStatus } from '@incidents/shared';

export interface TimeAgo {
  readonly days?: number;
  readonly hours?: number;
}

export interface ClosedOutcome {
  readonly kind: 'closed';
  readonly assigneeEmail: string;
  readonly resolutionHours: number;
  readonly resolution: string;
  readonly photosBeforeClosure: number;
}

export interface RejectedOutcome {
  readonly kind: 'rejected';
  readonly decidedAfterHours: number;
  readonly reason: string;
}

export interface OpenOutcome {
  readonly kind: 'open';
  readonly status: Exclude<IncidentStatus, 'CLOSED' | 'REJECTED'>;
  readonly assigneeEmail?: string;
}

export type SeedOutcome = ClosedOutcome | RejectedOutcome | OpenOutcome;

export interface SeedIncident {
  readonly categoryCode: string;
  readonly location: string;
  readonly reporterEmail: string;
  readonly reportedAgo: TimeAgo;
  readonly occurredHoursBeforeReport: number;
  readonly description: string;
  readonly photosAtReport: number;
  readonly hasCoordinates: boolean;
  readonly outcome: SeedOutcome;
}
