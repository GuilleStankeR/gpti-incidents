import type { UserSummary } from './users.contracts.js';

export interface EvidenceItem {
  readonly id: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly sha256: string;
  readonly createdAt: string;
  readonly uploadedBy: UserSummary;
  readonly url: string;
}
