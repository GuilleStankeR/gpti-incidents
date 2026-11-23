import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { IncidentStatus, REASSIGNABLE_STATUSES } from '@incidents/shared';

import { PrismaService } from '@/database/prisma.service';

export interface ClosedInCategoryFilter {
  readonly condominiumId: string;
  readonly categoryCode: string;
  readonly closedSince: Date;
}

export type AssigneeTally = ReadonlyMap<string, number>;

@Injectable()
export class AssigneeSuggestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countClosedInCategory(filter: ClosedInCategoryFilter): Promise<AssigneeTally> {
    return this.countByAssignee({
      condominiumId: filter.condominiumId,
      categoryCode: filter.categoryCode,
      status: IncidentStatus.CLOSED,
      closedAt: { gte: filter.closedSince },
    });
  }

  async countOpenAssigned(condominiumId: string): Promise<AssigneeTally> {
    return this.countByAssignee({ condominiumId, status: { in: [...REASSIGNABLE_STATUSES] } });
  }

  private async countByAssignee(where: Prisma.IncidentWhereInput): Promise<AssigneeTally> {
    const groups = await this.prisma.incident.groupBy({
      by: ['assigneeId'],
      where: { ...where, assigneeId: { not: null } },
      _count: { _all: true },
    });

    return new Map(
      groups.flatMap((group) =>
        group.assigneeId === null ? [] : [[group.assigneeId, group._count._all] as const],
      ),
    );
  }
}
