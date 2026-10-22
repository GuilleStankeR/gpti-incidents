import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';

import type { VisibilityScope } from './domain/visibility';

const INCIDENT_DETAIL_INCLUDE = {
  category: true,
  reporter: true,
  assignee: true,
  evidence: { include: { uploadedBy: true }, orderBy: { createdAt: 'asc' } },
  auditTrail: { include: { user: true }, orderBy: { createdAt: 'asc' } },
} satisfies Prisma.IncidentInclude;

export type IncidentDetailEntity = Prisma.IncidentGetPayload<{
  include: typeof INCIDENT_DETAIL_INCLUDE;
}>;

export function toScopeFilter(scope: VisibilityScope): Prisma.IncidentWhereInput {
  return { condominiumId: scope.condominiumId, reporterId: scope.reporterId };
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
}
