import { Injectable } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';

import { buildVisibilityScope } from './domain/visibility';
import { IncidentsRepository } from './incidents.repository';
import type { IncidentDetailEntity } from './incidents.repository';

@Injectable()
export class IncidentsService {
  constructor(private readonly incidentsRepository: IncidentsRepository) {}

  async findDetail(user: AuthenticatedUser, incidentId: string): Promise<IncidentDetailEntity> {
    const incident = await this.incidentsRepository.findDetail(
      buildVisibilityScope(user),
      incidentId,
    );

    if (incident === null) {
      throw new DomainError(ErrorCode.RESOURCE_NOT_FOUND);
    }

    return incident;
  }
}
