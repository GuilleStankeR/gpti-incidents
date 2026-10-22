import { Injectable } from '@nestjs/common';

import { DEFAULT_METRICS_PERIOD_DAYS } from '@incidents/shared';
import type { MetricsQuery } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { subtractDays } from '@/common/time/date-math';
import { resolveDateRange } from '@/common/time/date-range';
import { AppConfig } from '@/config/app-config';

import { MetricsRepository } from './metrics.repository';
import type { MetricsFacts, MetricsPeriodRange } from './metrics.repository';

export interface MetricsSnapshot {
  readonly period: MetricsPeriodRange;
  readonly facts: MetricsFacts;
}

@Injectable()
export class MetricsService {
  constructor(
    private readonly metricsRepository: MetricsRepository,
    private readonly config: AppConfig,
  ) {}

  async getSnapshot(user: AuthenticatedUser, query: MetricsQuery): Promise<MetricsSnapshot> {
    const now = new Date();
    const period = this.resolvePeriod(query, now);
    const facts = await this.metricsRepository.collectFacts(user.condominiumId, period, now);

    return { period, facts };
  }

  private resolvePeriod(query: MetricsQuery, now: Date): MetricsPeriodRange {
    const range = resolveDateRange(query, this.config.timeZone);
    const to = range.to ?? now;

    return { from: range.from ?? subtractDays(to, DEFAULT_METRICS_PERIOD_DAYS), to };
  }
}
