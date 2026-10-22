import type { Category, Incident, User } from '@prisma/client';

import type { IncidentDetail, IncidentSummary, PaginatedResponse, Role } from '@incidents/shared';

import { toEvidenceItem } from '@/modules/evidence/evidence.mapper';
import { toUserSummary } from '@/modules/users/users.mapper';

import { toAuditEntryItem } from './audit-trail.mapper';
import { getHoursRemaining, getSlaStatus, isOverdue } from './domain/sla';
import { getAvailableTransitions } from './domain/state-machine';
import type { IncidentDetailEntity } from './incidents.repository';
import type { IncidentPageResult } from './incidents.service';

export type IncidentSummaryEntity = Incident & {
  readonly category: Category;
  readonly reporter: User;
  readonly assignee: User | null;
};

export function toIncidentSummary(
  incident: IncidentSummaryEntity,
  evidenceCount: number,
  now: Date = new Date(),
): IncidentSummary {
  return {
    id: incident.id,
    folio: incident.folio,
    category: { code: incident.category.code, name: incident.category.name },
    description: incident.description,
    location: incident.location,
    status: incident.status,
    occurredAt: incident.occurredAt.toISOString(),
    reportedAt: incident.reportedAt.toISOString(),
    dueAt: incident.dueAt.toISOString(),
    closedAt: incident.closedAt?.toISOString() ?? null,
    reporter: toUserSummary(incident.reporter),
    assignee: incident.assignee === null ? null : toUserSummary(incident.assignee),
    evidenceCount,
    isOverdue: isOverdue(incident, now),
    hoursRemaining: getHoursRemaining(incident, now),
    slaStatus: getSlaStatus(incident, now),
  };
}

export function toIncidentDetail(
  incident: IncidentDetailEntity,
  viewerRole: Role,
  now: Date = new Date(),
): IncidentDetail {
  return {
    ...toIncidentSummary(incident, incident.evidence.length, now),
    latitude: incident.latitude?.toNumber() ?? null,
    longitude: incident.longitude?.toNumber() ?? null,
    geocodedAddress: incident.geocodedAddress,
    availableTransitions: getAvailableTransitions(incident.status, viewerRole),
    evidence: incident.evidence.map(toEvidenceItem),
    auditTrail: incident.auditTrail.map(toAuditEntryItem),
  };
}

export function toIncidentPage(
  result: IncidentPageResult,
  now: Date = new Date(),
): PaginatedResponse<IncidentSummary> {
  return {
    items: result.items.map((incident) =>
      toIncidentSummary(incident, incident._count.evidence, now),
    ),
    total: result.total,
    page: result.pageRequest.page,
    pageSize: result.pageRequest.pageSize,
  };
}
