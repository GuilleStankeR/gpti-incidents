import { Injectable } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';
import { buildVisibilityScope } from '@/modules/incidents/domain/visibility';

import { EvidenceFilesService } from './evidence-files.service';
import { EvidenceRepository } from './evidence.repository';

export interface EvidenceFile {
  readonly content: Buffer;
  readonly mimeType: string;
  readonly originalName: string;
}

@Injectable()
export class EvidenceDownloadService {
  constructor(
    private readonly evidenceRepository: EvidenceRepository,
    private readonly evidenceFiles: EvidenceFilesService,
  ) {}

  async getFile(user: AuthenticatedUser, evidenceId: string): Promise<EvidenceFile> {
    const evidence = await this.evidenceRepository.findAccessible(
      buildVisibilityScope(user),
      evidenceId,
    );

    if (evidence === null) {
      throw new DomainError(ErrorCode.RESOURCE_NOT_FOUND);
    }

    return {
      content: await this.evidenceFiles.read(evidence.storagePath),
      mimeType: evidence.mimeType,
      originalName: evidence.originalName,
    };
  }
}
