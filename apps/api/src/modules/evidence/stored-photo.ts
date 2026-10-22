import type { ValidatedPhoto } from '@/common/files/validated-photo';

export interface StoredPhoto extends ValidatedPhoto {
  readonly storagePath: string;
}
