import { Injectable, Logger } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';
import type { ValidatedPhoto } from '@/common/files/validated-photo';

import { assertCanAttachEvidence } from './domain/evidence-policy';
import { IncidentWriteRepository } from './incident-write.repository';
import { incidentsCopy } from './incidents.copy';
import type { IncidentDetailEntity } from './incidents.repository';
import { IncidentsService } from './incidents.service';

@Injectable()
export class IncidentEvidenceService {
  private readonly logger = new Logger(IncidentEvidenceService.name);

  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentWriteRepository: IncidentWriteRepository,
  ) {}

  async attach(
    user: AuthenticatedUser,
    incidentId: string,
    photos: readonly ValidatedPhoto[],
  ): Promise<IncidentDetailEntity> {
    const incident = await this.incidentsService.findDetail(user, incidentId);
    assertCanAttachEvidence(incident.status);

    if (photos.length === 0) {
      throw new DomainError(ErrorCode.INVALID_FILE);
    }

    const isAttached = await this.incidentWriteRepository.attachEvidence({
      incidentId,
      condominiumId: user.condominiumId,
      status: incident.status,
      uploadedById: user.id,
      photos,
      note: incidentsCopy.auditNotes.evidenceAttached(photos.length),
    });

    if (!isAttached) {
      throw new DomainError(ErrorCode.EVIDENCE_NOT_ALLOWED);
    }

    this.logger.log(`${String(photos.length)} evidence file(s) attached to ${incident.folio}`);

    return this.incidentsService.findDetail(user, incidentId);
  }
}
