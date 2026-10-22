import { IncidentStatus } from '@incidents/shared';
import type { IncidentStatus as IncidentStatusValue } from '@incidents/shared';

import { addHours, hoursBetween } from '@/common/time/date-math';
import { incidentsCopy } from '@/modules/incidents/incidents.copy';

import { describeStep } from './timeline-steps';
import type { TimelineContext } from './timeline-steps';
import {
  CLOSED_PROGRESS,
  EVIDENCE_BEFORE_CLOSURE_PROGRESS,
  OPEN_PROGRESS,
  REJECTED_PROGRESS,
  REJECTION_PATH,
  RESOLUTION_PATH,
} from './timeline.constants';
import type { SeedIncident, SeedOutcome } from '../data/incidents/seed-incident.types';

const HOURS_PER_DAY = 24;

export interface AuditRecord {
  readonly at: Date;
  readonly fromStatus: IncidentStatusValue | null;
  readonly toStatus: IncidentStatusValue;
  readonly actorEmail: string;
  readonly note: string;
}

export interface EvidenceUpload {
  readonly at: Date;
  readonly uploaderEmail: string;
  readonly count: number;
}

export interface IncidentTimeline {
  readonly reportedAt: Date;
  readonly occurredAt: Date;
  readonly finalStatus: IncidentStatusValue;
  readonly assigneeEmail: string | null;
  readonly closedAt: Date | null;
  readonly auditRecords: readonly AuditRecord[];
  readonly evidenceUploads: readonly EvidenceUpload[];
}

interface StepPlan {
  readonly path: readonly IncidentStatusValue[];
  readonly progress: Readonly<Partial<Record<IncidentStatusValue, number>>>;
  readonly spanHours: number;
}

function planSteps(outcome: SeedOutcome, reportedAt: Date, now: Date): StepPlan {
  if (outcome.kind === 'closed') {
    return { path: RESOLUTION_PATH, progress: CLOSED_PROGRESS, spanHours: outcome.resolutionHours };
  }

  if (outcome.kind === 'rejected') {
    return {
      path: REJECTION_PATH,
      progress: REJECTED_PROGRESS,
      spanHours: outcome.decidedAfterHours,
    };
  }

  const targetIndex = RESOLUTION_PATH.indexOf(outcome.status);
  return {
    path: RESOLUTION_PATH.slice(0, targetIndex + 1),
    progress: OPEN_PROGRESS,
    spanHours: hoursBetween(reportedAt, now),
  };
}

function buildTransitionRecords(
  seed: SeedIncident,
  reportedAt: Date,
  context: TimelineContext,
): AuditRecord[] {
  const plan = planSteps(seed.outcome, reportedAt, context.now);
  let fromStatus: IncidentStatusValue = IncidentStatus.REPORTED;

  return plan.path.map((toStatus) => {
    const at = addHours(reportedAt, plan.spanHours * (plan.progress[toStatus] ?? 1));
    const record = { at, fromStatus, toStatus, ...describeStep(toStatus, seed, context) };
    fromStatus = toStatus;
    return record;
  });
}

function buildEvidenceUploads(seed: SeedIncident, reportedAt: Date): EvidenceUpload[] {
  const uploads: EvidenceUpload[] = [];

  if (seed.photosAtReport > 0) {
    uploads.push({ at: reportedAt, uploaderEmail: seed.reporterEmail, count: seed.photosAtReport });
  }

  if (seed.outcome.kind === 'closed' && seed.outcome.photosBeforeClosure > 0) {
    uploads.push({
      at: addHours(reportedAt, seed.outcome.resolutionHours * EVIDENCE_BEFORE_CLOSURE_PROGRESS),
      uploaderEmail: seed.outcome.assigneeEmail,
      count: seed.outcome.photosBeforeClosure,
    });
  }

  return uploads;
}

function toEvidenceRecord(upload: EvidenceUpload): AuditRecord {
  return {
    at: upload.at,
    fromStatus: IncidentStatus.IN_PROGRESS,
    toStatus: IncidentStatus.IN_PROGRESS,
    actorEmail: upload.uploaderEmail,
    note: incidentsCopy.auditNotes.evidenceAttached(upload.count),
  };
}

export function buildIncidentTimeline(
  seed: SeedIncident,
  context: TimelineContext,
): IncidentTimeline {
  const agoHours = (seed.reportedAgo.days ?? 0) * HOURS_PER_DAY + (seed.reportedAgo.hours ?? 0);
  const reportedAt = addHours(context.now, -agoHours);
  const transitions = buildTransitionRecords(seed, reportedAt, context);
  const evidenceUploads = buildEvidenceUploads(seed, reportedAt);
  const lateUploads = evidenceUploads.filter((upload) => upload.at > reportedAt);
  const initialRecord: AuditRecord = {
    at: reportedAt,
    fromStatus: null,
    toStatus: IncidentStatus.REPORTED,
    ...describeStep(IncidentStatus.REPORTED, seed, context),
  };
  const finalStatus = transitions.at(-1)?.toStatus ?? IncidentStatus.REPORTED;

  return {
    reportedAt,
    occurredAt: addHours(reportedAt, -seed.occurredHoursBeforeReport),
    finalStatus,
    assigneeEmail: 'assigneeEmail' in seed.outcome ? (seed.outcome.assigneeEmail ?? null) : null,
    closedAt: finalStatus === IncidentStatus.CLOSED ? (transitions.at(-1)?.at ?? null) : null,
    auditRecords: [initialRecord, ...transitions, ...lateUploads.map(toEvidenceRecord)].toSorted(
      (first, second) => first.at.getTime() - second.at.getTime(),
    ),
    evidenceUploads,
  };
}
