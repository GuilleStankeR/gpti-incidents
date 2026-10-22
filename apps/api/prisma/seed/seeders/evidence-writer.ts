import { randomUUID } from 'node:crypto';

import type { Prisma } from '@prisma/client';

import { calculateSha256 } from '@/common/files/sha256';
import { buildStoragePath, saveImmutableFile } from '@/modules/storage/local-disk-files';

import type { UserLookup, WriterContext } from './seed-context';
import { evidenceFileName } from '../data/seed-texts.data';
import { generateEvidenceImage } from '../generators/evidence-image.generator';
import type { EvidenceUpload } from '../generators/incident-timeline.generator';

const JPEG_MIME_TYPE = 'image/jpeg';
const JPEG_EXTENSION = 'jpg';

interface PendingEvidence {
  readonly uploadedById: string;
  readonly createdAt: Date;
}

export interface EvidenceTarget {
  readonly incidentId: string;
  readonly folio: string;
}

function expandUploads(
  uploads: readonly EvidenceUpload[],
  findUser: UserLookup,
): PendingEvidence[] {
  return uploads.flatMap((upload) =>
    Array.from({ length: upload.count }, () => ({
      uploadedById: findUser(upload.uploaderEmail).id,
      createdAt: upload.at,
    })),
  );
}

export async function writeEvidence(
  transaction: Prisma.TransactionClient,
  target: EvidenceTarget,
  uploads: readonly EvidenceUpload[],
  context: WriterContext & { readonly writtenPaths: string[] },
): Promise<void> {
  const pendingEvidence = expandUploads(uploads, context.findUser);
  const rows: Prisma.EvidenceCreateManyInput[] = [];

  for (const [index, pending] of pendingEvidence.entries()) {
    const position = index + 1;
    const image = await generateEvidenceImage(target.folio, position, pendingEvidence.length);
    const storagePath = buildStoragePath(target.incidentId, `${randomUUID()}.${JPEG_EXTENSION}`);
    await saveImmutableFile(context.storageDirectory, storagePath, image);
    context.writtenPaths.push(storagePath);
    rows.push({
      ...pending,
      incidentId: target.incidentId,
      storagePath,
      originalName: evidenceFileName(target.folio, position),
      mimeType: JPEG_MIME_TYPE,
      sizeBytes: image.length,
      sha256: calculateSha256(image),
    });
  }

  await transaction.evidence.createMany({ data: rows });
}
