import type { PrismaClient } from '@prisma/client';

import { writeHistoricalIncident } from './incident-writer';
import type { IncidentPlan } from './incident-writer';
import type { SeedContext, SeedUser } from './seed-context';
import { HISTORICAL_INCIDENTS } from '../data/incidents/historical-incidents.data';
import { buildIncidentTimeline } from '../generators/incident-timeline.generator';

async function loadUsersByEmail(
  prisma: PrismaClient,
  condominiumId: string,
): Promise<ReadonlyMap<string, SeedUser>> {
  const users = await prisma.user.findMany({ where: { condominiumId } });
  return new Map(users.map((user) => [user.email, { id: user.id, name: user.name }]));
}

async function loadSlaHoursByCategory(prisma: PrismaClient): Promise<ReadonlyMap<string, number>> {
  const categories = await prisma.category.findMany();
  return new Map(categories.map((category) => [category.code, category.slaHours]));
}

function requireEntry<TValue>(map: ReadonlyMap<string, TValue>, key: string): TValue {
  const value = map.get(key);

  if (value === undefined) {
    throw new Error(`Seed reference not found: ${key}`);
  }

  return value;
}

export async function seedHistoricalIncidents(
  prisma: PrismaClient,
  context: SeedContext,
): Promise<number> {
  const existingIncidents = await prisma.incident.count({
    where: { condominiumId: context.condominiumId },
  });

  if (existingIncidents > 0) {
    return 0;
  }

  const users = await loadUsersByEmail(prisma, context.condominiumId);
  const slaHours = await loadSlaHoursByCategory(prisma);
  const findUser = (email: string): SeedUser => requireEntry(users, email);
  const plans: IncidentPlan[] = HISTORICAL_INCIDENTS.map((seed, index) => ({
    seed,
    timeline: buildIncidentTimeline(seed, {
      now: context.now,
      index,
      resolveName: (email) => findUser(email).name,
    }),
    slaHours: requireEntry(slaHours, seed.categoryCode),
  })).toSorted(
    (first, second) => first.timeline.reportedAt.getTime() - second.timeline.reportedAt.getTime(),
  );

  for (const plan of plans) {
    await writeHistoricalIncident(prisma, plan, { ...context, findUser });
  }

  return plans.length;
}
