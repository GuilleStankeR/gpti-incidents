import type { DatabaseTransaction } from '@/database/database-transaction';

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
