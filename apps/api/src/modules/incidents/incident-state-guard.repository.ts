import type { Prisma } from '@prisma/client';

import type { IncidentStatus } from '@incidents/shared';

import type { DatabaseTransaction } from '@/database/database-transaction';

export interface IncidentStateGuard {
  readonly incidentId: string;
  readonly condominiumId: string;
  readonly expectedStatus: IncidentStatus;
}

export async function updateIncidentIfInState(
  transaction: DatabaseTransaction,
  guard: IncidentStateGuard,
  data: Prisma.IncidentUncheckedUpdateManyInput,
): Promise<boolean> {
  const { count } = await transaction.incident.updateMany({
    where: {
      id: guard.incidentId,
      condominiumId: guard.condominiumId,
      status: guard.expectedStatus,
    },
    data,
  });

  return count > 0;
}
