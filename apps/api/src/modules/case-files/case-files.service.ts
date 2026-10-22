import { Injectable, Logger } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';
import { AppConfig } from '@/config/app-config';
import { EvidenceFilesService } from '@/modules/evidence/evidence-files.service';
import { buildVisibilityScope } from '@/modules/incidents/domain/visibility';

import { toCaseFileView } from './case-file-view.mapper';
import { caseFilesCopy } from './case-files.copy';
import { CaseFilesRepository } from './case-files.repository';
import { renderCaseFilePdf } from './pdf/case-file-document';
import { toPdfImage } from './pdf/pdf-image';
import type { PdfImage } from './pdf/pdf-image';

export interface GeneratedCaseFile {
  readonly fileName: string;
  readonly content: Buffer;
}

@Injectable()
export class CaseFilesService {
  private readonly logger = new Logger(CaseFilesService.name);

  constructor(
    private readonly caseFilesRepository: CaseFilesRepository,
    private readonly evidenceFiles: EvidenceFilesService,
    private readonly config: AppConfig,
  ) {}

  async generate(user: AuthenticatedUser, incidentId: string): Promise<GeneratedCaseFile> {
    const incident = await this.caseFilesRepository.findForCaseFile(
      buildVisibilityScope(user),
      incidentId,
    );

    if (incident === null) {
      throw new DomainError(ErrorCode.RESOURCE_NOT_FOUND);
    }

    const [images, issuerName] = await Promise.all([
      Promise.all(incident.evidence.map(async (evidence) => this.loadImage(evidence.storagePath))),
      this.caseFilesRepository.findUserName(user.condominiumId, user.id),
    ]);
    const view = toCaseFileView({
      incident,
      images,
      issuerName,
      issuedAt: new Date(),
      timeZone: this.config.timeZone,
    });

    this.logger.log(`Case file for ${incident.folio} issued by user ${user.id}`);

    return {
      fileName: caseFilesCopy.fileName(incident.folio),
      content: await renderCaseFilePdf(view),
    };
  }

  private async loadImage(storagePath: string): Promise<PdfImage | null> {
    try {
      return await toPdfImage(await this.evidenceFiles.read(storagePath));
    } catch (error) {
      this.logger.warn(`Evidence image ${storagePath} could not be embedded: ${String(error)}`);
      return null;
    }
  }
}
