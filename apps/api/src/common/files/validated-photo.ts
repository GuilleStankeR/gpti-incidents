import type { PhotoMimeType } from '@incidents/shared';

export interface ValidatedPhoto {
  readonly originalName: string;
  readonly mimeType: PhotoMimeType;
  readonly sizeBytes: number;
  readonly sha256: string;
  readonly content: Buffer;
}
