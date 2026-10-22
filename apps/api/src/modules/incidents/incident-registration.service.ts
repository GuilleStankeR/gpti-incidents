import { randomUUID } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';
import type { Category } from '@prisma/client';

import { ErrorCode } from '@incidents/shared';
import type { CreateIncidentRequest } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';
import { validationMessages } from '@/common/errors/validation-messages.copy';
import type { ValidatedPhoto } from '@/common/files/validated-photo';
import { CategoriesRepository } from '@/modules/catalogs/categories.repository';

import { assertValidOccurredAt } from './domain/occurred-at';
import { calculateDueAt } from './domain/sla';
import { IncidentGeocodingService } from './incident-geocoding.service';
import { IncidentWriteRepository } from './incident-write.repository';
import type { IncidentDraft } from './incident-write.repository';
import { incidentsCopy } from './incidents.copy';
import type { IncidentDetailEntity } from './incidents.repository';
import { IncidentsService } from './incidents.service';

@Injectable()
export class IncidentRegistrationService {
  private readonly logger = new Logger(IncidentRegistrationService.name);

  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly incidentWriteRepository: IncidentWriteRepository,
    private readonly incidentsService: IncidentsService,
    private readonly incidentGeocodingService: IncidentGeocodingService,
  ) {}

  async register(
    user: AuthenticatedUser,
    input: CreateIncidentRequest,
    photos: readonly ValidatedPhoto[],
  ): Promise<IncidentDetailEntity> {
    const draft = await this.buildDraft(user, input);
    const folio = await this.incidentWriteRepository.register({
      draft,
      photos,
      auditNote: incidentsCopy.auditNotes.reported,
    });

    this.logger.log(`Incident ${folio} reported by user ${user.id}`);
    await this.incidentGeocodingService.enrichWithAddress({ ...draft, incidentId: draft.id });

    return this.incidentsService.findDetail(user, draft.id);
  }

  private async buildDraft(
    user: AuthenticatedUser,
    input: CreateIncidentRequest,
  ): Promise<IncidentDraft> {
    const reportedAt = new Date();
    const occurredAt = new Date(input.occurredAt);
    assertValidOccurredAt(occurredAt, reportedAt);
    const category = await this.requireCategory(input.categoryCode);

    return {
      id: randomUUID(),
      condominiumId: user.condominiumId,
      categoryCode: category.code,
      description: input.description,
      location: input.location,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      occurredAt,
      reportedAt,
      dueAt: calculateDueAt(reportedAt, category.slaHours),
      reporterId: user.id,
    };
  }

  private async requireCategory(categoryCode: string): Promise<Category> {
    const category = await this.categoriesRepository.findByCode(categoryCode);

    if (category === null) {
      throw new DomainError(ErrorCode.VALIDATION_FAILED, validationMessages.categoryInvalid);
    }

    return category;
  }
}
