import type { IncidentStatus } from '../incident-status.js';
import type { SlaStatus } from '../sla-status.js';
import type { AuditEntryItem } from './audit-trail.contracts.js';
import type { CategorySummary } from './catalogs.contracts.js';
import type { EvidenceItem } from './evidence.contracts.js';
import type { PaginationQuery } from './pagination.contracts.js';
import type { UserSummary } from './users.contracts.js';

export interface IncidentSummary {
  readonly id: string;
  readonly folio: string;
  readonly category: CategorySummary;
  readonly description: string;
  readonly location: string;
  readonly status: IncidentStatus;
  readonly occurredAt: string;
  readonly reportedAt: string;
  readonly dueAt: string;
  readonly closedAt: string | null;
  readonly reporter: UserSummary;
  readonly assignee: UserSummary | null;
  readonly evidenceCount: number;
  readonly isOverdue: boolean;
  readonly hoursRemaining: number | null;
  readonly slaStatus: SlaStatus | null;
}

export interface IncidentDetail extends IncidentSummary {
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly geocodedAddress: string | null;
  readonly availableTransitions: readonly IncidentStatus[];
  readonly evidence: readonly EvidenceItem[];
  readonly auditTrail: readonly AuditEntryItem[];
}

export interface ListIncidentsQuery extends PaginationQuery {
  readonly status?: IncidentStatus;
  readonly category?: string;
  readonly from?: string;
  readonly to?: string;
  readonly search?: string;
}

export interface CreateIncidentRequest {
  readonly categoryCode: string;
  readonly description: string;
  readonly location: string;
  readonly occurredAt: string;
  readonly latitude?: number;
  readonly longitude?: number;
}

export interface TransitionIncidentRequest {
  readonly targetStatus: IncidentStatus;
  readonly assigneeId?: string;
  readonly note: string;
}

export interface ReassignIncidentRequest {
  readonly assigneeId: string;
  readonly note: string;
}
