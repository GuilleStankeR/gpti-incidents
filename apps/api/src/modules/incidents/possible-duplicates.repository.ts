import { Injectable } from '@nestjs/common';

import { TERMINAL_STATUSES } from '@incidents/shared';

import { PrismaService } from '@/database/prisma.service';

import type { DuplicateCandidate } from './domain/possible-duplicates';

export interface DuplicateSearch {
  readonly condominiumId: string;
  readonly categoryCode: string;
  readonly location: string;
  readonly reportedSince: Date;
}

@Injectable()
export class PossibleDuplicatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOpenMatches(search: DuplicateSearch): Promise<DuplicateCandidate[]> {
    return this.prisma.incident.findMany({
      where: {
        condominiumId: search.condominiumId,
        categoryCode: search.categoryCode,
        location: search.location,
        status: { notIn: [...TERMINAL_STATUSES] },
        reportedAt: { gte: search.reportedSince },
      },
      select: { id: true, folio: true, status: true, reportedAt: true, reporterId: true },
      orderBy: { reportedAt: 'desc' },
    });
  }
}
