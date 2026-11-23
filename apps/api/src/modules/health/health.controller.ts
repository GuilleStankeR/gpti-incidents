import { Controller, Get } from '@nestjs/common';

import type { HealthResponse } from '@incidents/shared';

import { Public } from '@/common/decorators/public.decorator';

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  async check(): Promise<HealthResponse> {
    await this.healthService.assertDatabaseReachable();
    return { status: 'ok' };
  }
}
