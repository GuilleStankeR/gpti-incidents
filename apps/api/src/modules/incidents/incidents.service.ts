import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, ErrorCode } from '@incidents/shared';
import type { ListIncidentsQuery } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';
import { resolveDateRange } from '@/common/time/date-range';
import { AppConfig } from '@/config/app-config';

import { buildVisibilityScope } from './domain/visibility';
import { IncidentsRepository } from './incidents.repository';
import type { IncidentDetailEntity, IncidentPage, PageRequest } from './incidents.repository';

export interface IncidentPageResult extends IncidentPage {
  readonly pageRequest: PageRequest;
}

@Injectable()
export class IncidentsService {
  constructor(
    private readonly incidentsRepository: IncidentsRepository,
    private readonly config: AppConfig,
  ) {}

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

  async list(user: AuthenticatedUser, query: ListIncidentsQuery): Promise<IncidentPageResult> {
    const pageRequest: PageRequest = {
      page: query.page ?? DEFAULT_PAGE,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
    };
    const page = await this.incidentsRepository.findPage(
      buildVisibilityScope(user),
      {
        status: query.status,
        categoryCode: query.category,
        reportedWithin: resolveDateRange(query, this.config.timeZone),
        search: query.search,
      },
      pageRequest,
    );

    return { ...page, pageRequest };
  }
}
