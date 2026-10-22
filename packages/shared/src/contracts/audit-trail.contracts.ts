import type { IncidentStatus } from '../incident-status.js';
import type { UserWithRole } from './users.contracts.js';

export interface AuditEntryItem {
  readonly id: string;
  readonly fromStatus: IncidentStatus | null;
  readonly toStatus: IncidentStatus;
  readonly note: string;
  readonly createdAt: string;
  readonly user: UserWithRole;
}
