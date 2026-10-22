import type { Evidence, User } from '@prisma/client';

import type { EvidenceItem } from '@incidents/shared';

import { buildEvidenceFileUrl } from '@/common/http/api-routes';
import { toUserSummary } from '@/modules/users/users.mapper';

export type EvidenceWithUploader = Evidence & { readonly uploadedBy: User };

export function toEvidenceItem(evidence: EvidenceWithUploader): EvidenceItem {
  return {
    id: evidence.id,
    originalName: evidence.originalName,
    mimeType: evidence.mimeType,
    sizeBytes: evidence.sizeBytes,
    sha256: evidence.sha256,
    createdAt: evidence.createdAt.toISOString(),
    uploadedBy: toUserSummary(evidence.uploadedBy),
    url: buildEvidenceFileUrl(evidence.id),
  };
}
