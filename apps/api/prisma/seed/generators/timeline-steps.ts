import { IncidentStatus } from '@incidents/shared';
import type { IncidentStatus as IncidentStatusValue } from '@incidents/shared';

import { incidentsCopy } from '@/modules/incidents/incidents.copy';

import { DEMO_EMAILS } from '../data/demo-emails.data';
import type { SeedIncident, SeedOutcome } from '../data/incidents/seed-incident.types';
import { REVIEW_NOTES, START_NOTES, assignmentNote } from '../data/seed-texts.data';

const REVIEWERS = [DEMO_EMAILS.concierge, DEMO_EMAILS.secondConcierge];

export interface TimelineContext {
  readonly now: Date;
  readonly index: number;
  readonly resolveName: (email: string) => string;
}

function pickRotating(values: readonly string[], index: number): string {
  return values[index % values.length] ?? '';
}

export interface StepDescription {
  readonly actorEmail: string;
  readonly note: string;
}

type StepDescriber = (seed: SeedIncident, context: TimelineContext) => StepDescription;

function assigneeOf(seed: SeedIncident): string {
  const assigneeEmail = 'assigneeEmail' in seed.outcome ? seed.outcome.assigneeEmail : undefined;
  return assigneeEmail ?? DEMO_EMAILS.admin;
}

function closingNote(outcome: SeedOutcome): string {
  if (outcome.kind === 'closed') {
    return outcome.resolution;
  }

  return outcome.kind === 'rejected' ? outcome.reason : '';
}

const STEP_DESCRIBERS: Readonly<Record<IncidentStatusValue, StepDescriber>> = {
  [IncidentStatus.REPORTED]: (seed) => ({
    actorEmail: seed.reporterEmail,
    note: incidentsCopy.auditNotes.reported,
  }),
  [IncidentStatus.UNDER_REVIEW]: (_seed, context) => ({
    actorEmail: pickRotating(REVIEWERS, context.index),
    note: pickRotating(REVIEW_NOTES, context.index),
  }),
  [IncidentStatus.ASSIGNED]: (seed, context) => ({
    actorEmail: DEMO_EMAILS.admin,
    note: assignmentNote(context.resolveName(assigneeOf(seed))),
  }),
  [IncidentStatus.IN_PROGRESS]: (seed, context) => ({
    actorEmail: assigneeOf(seed),
    note: pickRotating(START_NOTES, context.index),
  }),
  [IncidentStatus.CLOSED]: (seed) => ({
    actorEmail: assigneeOf(seed),
    note: closingNote(seed.outcome),
  }),
  [IncidentStatus.REJECTED]: (seed) => ({
    actorEmail: DEMO_EMAILS.admin,
    note: closingNote(seed.outcome),
  }),
};

export function describeStep(
  status: IncidentStatusValue,
  seed: SeedIncident,
  context: TimelineContext,
): StepDescription {
  return STEP_DESCRIBERS[status](seed, context);
}
