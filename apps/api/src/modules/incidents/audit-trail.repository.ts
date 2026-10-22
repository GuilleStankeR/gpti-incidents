import type { IncidentStatus } from '@incidents/shared';

import type { DatabaseTransaction } from '@/database/database-transaction';

export interface NewAuditEntry {
  readonly incidentId: string;
  readonly fromStatus: IncidentStatus | null;
  readonly toStatus: IncidentStatus;
  readonly userId: string;
  readonly note: string;
}

export async function appendAuditEntry(
  transaction: DatabaseTransaction,
  entry: NewAuditEntry,
): Promise<void> {
  await transaction.auditEntry.create({ data: entry });
}
