import { randomUUID } from 'node:crypto';

import type { Prisma, PrismaClient } from '@prisma/client';

import { getYearInTimeZone } from '@/common/time/date-math';
import { formatFolio } from '@/modules/incidents/domain/folio';
import { calculateDueAt } from '@/modules/incidents/domain/sla';
import { incrementFolioCounter } from '@/modules/incidents/folio-counter.repository';
import { removeStoredFile } from '@/modules/storage/local-disk-files';

import { writeEvidence } from './evidence-writer';
import type { WriterContext } from './seed-context';
import { DEMO_LOCATION } from '../data/condominium.data';
import type { SeedIncident } from '../data/incidents/seed-incident.types';
import type { IncidentTimeline } from '../generators/incident-timeline.generator';

const TRANSACTION_TIMEOUT_MS = 30_000;

export interface IncidentPlan {
  readonly seed: SeedIncident;
  readonly timeline: IncidentTimeline;
  readonly slaHours: number;
}

type TransactionContext = WriterContext & { readonly writtenPaths: string[] };

async function nextFolio(
  transaction: Prisma.TransactionClient,
  timeline: IncidentTimeline,
  context: WriterContext,
): Promise<string> {
  const year = getYearInTimeZone(timeline.reportedAt, context.timeZone);
  const sequence = await incrementFolioCounter(transaction, context.condominiumId, year);
  return formatFolio(context.condominiumCode, year, sequence);
}

function buildIncidentData(
  plan: IncidentPlan,
  ids: { readonly incidentId: string; readonly folio: string },
  context: WriterContext,
): Prisma.IncidentUncheckedCreateInput {
  const { seed, timeline } = plan;
  const coordinates = seed.hasCoordinates ? DEMO_LOCATION : null;

  return {
    id: ids.incidentId,
    condominiumId: context.condominiumId,
    folio: ids.folio,
    categoryCode: seed.categoryCode,
    description: seed.description,
    location: seed.location,
    latitude: coordinates?.latitude ?? null,
    longitude: coordinates?.longitude ?? null,
    geocodedAddress: coordinates?.geocodedAddress ?? null,
    occurredAt: timeline.occurredAt,
    reportedAt: timeline.reportedAt,
    dueAt: calculateDueAt(timeline.reportedAt, plan.slaHours),
    closedAt: timeline.closedAt,
    status: timeline.finalStatus,
    reporterId: context.findUser(seed.reporterEmail).id,
    assigneeId:
      timeline.assigneeEmail === null ? null : context.findUser(timeline.assigneeEmail).id,
  };
}

async function persistPlan(
  transaction: Prisma.TransactionClient,
  plan: IncidentPlan,
  context: TransactionContext,
): Promise<string> {
  const incidentId = randomUUID();
  const folio = await nextFolio(transaction, plan.timeline, context);

  await transaction.incident.create({
    data: buildIncidentData(plan, { incidentId, folio }, context),
  });
  await writeEvidence(transaction, { incidentId, folio }, plan.timeline.evidenceUploads, context);
  await transaction.auditEntry.createMany({
    data: plan.timeline.auditRecords.map((record) => ({
      incidentId,
      fromStatus: record.fromStatus,
      toStatus: record.toStatus,
      userId: context.findUser(record.actorEmail).id,
      note: record.note,
      createdAt: record.at,
    })),
  });

  return folio;
}

export async function writeHistoricalIncident(
  prisma: PrismaClient,
  plan: IncidentPlan,
  context: WriterContext,
): Promise<string> {
  const writtenPaths: string[] = [];

  try {
    return await prisma.$transaction(
      async (transaction) => persistPlan(transaction, plan, { ...context, writtenPaths }),
      { timeout: TRANSACTION_TIMEOUT_MS },
    );
  } catch (error) {
    await Promise.all(
      writtenPaths.map(async (path) => removeStoredFile(context.storageDirectory, path)),
    );
    throw error;
  }
}
