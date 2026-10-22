import { Injectable } from '@nestjs/common';
import type { IncidentStatus, Prisma } from '@prisma/client';

import type { DateRange } from '@/common/time/date-range';
import { PrismaService } from '@/database/prisma.service';

import type { VisibilityScope } from './domain/visibility';

const INCIDENT_DETAIL_INCLUDE = {
  category: true,
  reporter: true,
  assignee: true,
  evidence: { include: { uploadedBy: true }, orderBy: { createdAt: 'asc' } },
  auditTrail: { include: { user: true }, orderBy: { createdAt: 'asc' } },
} satisfies Prisma.IncidentInclude;

const INCIDENT_SUMMARY_INCLUDE = {
  category: true,
  reporter: true,
  assignee: true,
  _count: { select: { evidence: true } },
} satisfies Prisma.IncidentInclude;

export type IncidentDetailEntity = Prisma.IncidentGetPayload<{
  include: typeof INCIDENT_DETAIL_INCLUDE;
}>;

export type IncidentListEntity = Prisma.IncidentGetPayload<{
  include: typeof INCIDENT_SUMMARY_INCLUDE;
}>;

export interface IncidentFilters {
  readonly status?: IncidentStatus;
  readonly categoryCode?: string;
  readonly reportedWithin: DateRange;
  readonly search?: string;
}

export interface PageRequest {
  readonly page: number;
  readonly pageSize: number;
}

export interface IncidentPage {
  readonly items: readonly IncidentListEntity[];
  readonly total: number;
}

export function toScopeFilter(scope: VisibilityScope): Prisma.IncidentWhereInput {
  return { condominiumId: scope.condominiumId, reporterId: scope.reporterId };
}

function toSearchFilter(search: string | undefined): Prisma.IncidentWhereInput {
  if (search === undefined || search.length === 0) {
    return {};
  }

  return {
    OR: [
      { folio: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ],
  };
}

function toListFilter(scope: VisibilityScope, filters: IncidentFilters): Prisma.IncidentWhereInput {
  return {
    ...toScopeFilter(scope),
    ...toSearchFilter(filters.search),
    status: filters.status,
    categoryCode: filters.categoryCode,
    reportedAt: { gte: filters.reportedWithin.from, lte: filters.reportedWithin.to },
  };
}

@Injectable()
export class IncidentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDetail(scope: VisibilityScope, id: string): Promise<IncidentDetailEntity | null> {
    return this.prisma.incident.findFirst({
      where: { id, ...toScopeFilter(scope) },
      include: INCIDENT_DETAIL_INCLUDE,
    });
  }

  async findPage(
    scope: VisibilityScope,
    filters: IncidentFilters,
    pageRequest: PageRequest,
  ): Promise<IncidentPage> {
    const where = toListFilter(scope, filters);
    const [total, items] = await this.prisma.$transaction([
      this.prisma.incident.count({ where }),
      this.prisma.incident.findMany({
        where,
        include: INCIDENT_SUMMARY_INCLUDE,
        orderBy: [{ reportedAt: 'desc' }, { folio: 'desc' }],
        skip: (pageRequest.page - 1) * pageRequest.pageSize,
        take: pageRequest.pageSize,
      }),
    ]);

    return { items, total };
  }
}
