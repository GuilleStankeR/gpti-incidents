import { Controller, Get, Query } from '@nestjs/common';

import { Capability } from '@incidents/shared';
import type { MetricsResponse } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequireCapability } from '@/common/decorators/require-capability.decorator';

import { MetricsQueryDto } from './dto/metrics-query.dto';
import { toMetricsResponse } from './metrics.mapper';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @RequireCapability(Capability.VIEW_METRICS)
  async getMetrics(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: MetricsQueryDto,
  ): Promise<MetricsResponse> {
    return toMetricsResponse(await this.metricsService.getSnapshot(user, query));
  }
}
