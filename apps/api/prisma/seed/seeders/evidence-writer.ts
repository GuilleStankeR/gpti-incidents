import { randomUUID } from 'node:crypto';

import type { Prisma } from '@prisma/client';

import { calculateSha256 } from '@/common/files/sha256';
import { StorageDriver } from '@/config/storage-driver';
import { saveImmutableFile } from '@/modules/storage/local-disk-files';
import { buildStoragePath } from '@/modules/storage/storage-path';
import { insertStoredFile } from '@/modules/storage/stored-file.repository';

import { evidenceFileName } from '../data/seed-texts.data';
import { generateEvidenceImage } from '../generators/evidence-image.generator';
import type { EvidenceUpload } from '../generators/incident-timeline.generator';
import type { UserLookup, WriterContext } from './seed-context';

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

type EvidenceWriterContext = WriterContext & { readonly writtenPaths: string[] };

async function storeEvidenceFile(
  transaction: Prisma.TransactionClient,
  storagePath: string,
  content: Buffer,
  context: EvidenceWriterContext,
): Promise<void> {
  if (context.storageDriver === StorageDriver.DATABASE) {
    await insertStoredFile(transaction, storagePath, content);
    return;
  }

  await saveImmutableFile(context.storageDirectory, storagePath, content);
  context.writtenPaths.push(storagePath);
}

export async function writeEvidence(
  transaction: Prisma.TransactionClient,
  target: EvidenceTarget,
  uploads: readonly EvidenceUpload[],
  context: EvidenceWriterContext,
): Promise<void> {
  const pendingEvidence = expandUploads(uploads, context.findUser);
  const rows: Prisma.EvidenceCreateManyInput[] = [];

  for (const [index, pending] of pendingEvidence.entries()) {
    const position = index + 1;
    const image = await generateEvidenceImage(target.folio, position, pendingEvidence.length);
    const storagePath = buildStoragePath(target.incidentId, `${randomUUID()}.${JPEG_EXTENSION}`);
    await storeEvidenceFile(transaction, storagePath, image, context);
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
