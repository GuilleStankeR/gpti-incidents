import { Injectable } from '@nestjs/common';
import type { Category, Prisma } from '@prisma/client';

import { IncidentStatus, TERMINAL_STATUSES } from '@incidents/shared';

import { PrismaService } from '@/database/prisma.service';

import type { ClosedIncidentFacts, StatusCount } from './domain/metrics-calculator';

export interface MetricsPeriodRange {
  readonly from: Date;
  readonly to: Date;
}

export interface CategoryTally {
  readonly categoryCode: string;
  readonly count: number;
}

export interface MetricsFacts {
  readonly totalIncidents: number;
  readonly statusCounts: readonly StatusCount[];
  readonly categoryCounts: readonly CategoryTally[];
  readonly categories: readonly Category[];
  readonly closedIncidents: readonly ClosedIncidentFacts[];
  readonly openOverdue: number;
}

type IncidentFilter = Prisma.IncidentWhereInput;

@Injectable()
export class MetricsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async collectFacts(
    condominiumId: string,
    period: MetricsPeriodRange,
    now: Date,
  ): Promise<MetricsFacts> {
    const inPeriod: IncidentFilter = {
      condominiumId,
      reportedAt: { gte: period.from, lte: period.to },
    };
    const [totalIncidents, statusCounts, categoryCounts, categories, closedIncidents, openOverdue] =
      await Promise.all([
        this.prisma.incident.count({ where: inPeriod }),
        this.countByStatus(inPeriod),
        this.countByCategory(inPeriod),
        this.prisma.category.findMany({ orderBy: { name: 'asc' } }),
        this.findClosedFacts(inPeriod),
        this.countOpenOverdue(inPeriod, now),
      ]);

    return {
      totalIncidents,
      statusCounts,
      categoryCounts,
      categories,
      closedIncidents,
      openOverdue,
    };
  }

  private async countByStatus(where: IncidentFilter): Promise<StatusCount[]> {
    const groups = await this.prisma.incident.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    });

    return groups.map((group) => ({ status: group.status, count: group._count._all }));
  }

  private async countByCategory(where: IncidentFilter): Promise<CategoryTally[]> {
    const groups = await this.prisma.incident.groupBy({
      by: ['categoryCode'],
      where,
      _count: { _all: true },
    });

    return groups.map((group) => ({ categoryCode: group.categoryCode, count: group._count._all }));
  }

  private async findClosedFacts(where: IncidentFilter): Promise<ClosedIncidentFacts[]> {
    const closedIncidents = await this.prisma.incident.findMany({
      where: { ...where, status: IncidentStatus.CLOSED },
      select: {
        reportedAt: true,
        closedAt: true,
        dueAt: true,
        _count: { select: { evidence: true } },
      },
    });

    return closedIncidents.map((incident) => ({
      reportedAt: incident.reportedAt,
      closedAt: incident.closedAt,
      dueAt: incident.dueAt,
      evidenceCount: incident._count.evidence,
    }));
  }

  private async countOpenOverdue(where: IncidentFilter, now: Date): Promise<number> {
    return this.prisma.incident.count({
      where: { ...where, status: { notIn: [...TERMINAL_STATUSES] }, dueAt: { lt: now } },
    });
  }
}
