import { Injectable } from '@nestjs/common';
import type { Evidence } from '@prisma/client';

import type { DatabaseTransaction } from '@/database/database-transaction';
import { PrismaService } from '@/database/prisma.service';
import type { VisibilityScope } from '@/modules/incidents/domain/visibility';

import type { StoredPhoto } from './stored-photo';

export interface NewEvidenceBatch {
  readonly incidentId: string;
  readonly uploadedById: string;
  readonly photos: readonly StoredPhoto[];
}

export async function insertEvidenceBatch(
  transaction: DatabaseTransaction,
  batch: NewEvidenceBatch,
): Promise<void> {
  await transaction.evidence.createMany({
    data: batch.photos.map((photo) => ({
      incidentId: batch.incidentId,
      uploadedById: batch.uploadedById,
      storagePath: photo.storagePath,
      originalName: photo.originalName,
      mimeType: photo.mimeType,
      sizeBytes: photo.sizeBytes,
      sha256: photo.sha256,
    })),
  });
}

@Injectable()
export class EvidenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAccessible(scope: VisibilityScope, evidenceId: string): Promise<Evidence | null> {
    return this.prisma.evidence.findFirst({
      where: {
        id: evidenceId,
        incident: { condominiumId: scope.condominiumId, reporterId: scope.reporterId },
      },
    });
  }
}
