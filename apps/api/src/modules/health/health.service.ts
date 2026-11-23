import { Injectable } from '@nestjs/common';

import { HealthRepository } from './health.repository';

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  async assertDatabaseReachable(): Promise<void> {
    await this.healthRepository.ping();
  }
}
