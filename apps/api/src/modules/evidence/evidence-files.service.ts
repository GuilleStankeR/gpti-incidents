import { randomUUID } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';

import { PHOTO_FILE_EXTENSIONS } from '@/common/files/photo-signature';
import type { ValidatedPhoto } from '@/common/files/validated-photo';
import { FILE_STORAGE } from '@/modules/storage/file-storage.port';
import type { FileStorage } from '@/modules/storage/file-storage.port';

import type { StoredPhoto } from './stored-photo';

@Injectable()
export class EvidenceFilesService {
  constructor(@Inject(FILE_STORAGE) private readonly storage: FileStorage) {}

  async store(incidentId: string, photos: readonly ValidatedPhoto[]): Promise<StoredPhoto[]> {
    const storedPhotos: StoredPhoto[] = [];

    try {
      for (const photo of photos) {
        const fileName = `${randomUUID()}.${PHOTO_FILE_EXTENSIONS[photo.mimeType]}`;
        const storagePath = await this.storage.save(incidentId, fileName, photo.content);
        storedPhotos.push({ ...photo, storagePath });
      }
    } catch (error) {
      await this.discard(storedPhotos);
      throw error;
    }

    return storedPhotos;
  }

  async discard(storedPhotos: readonly StoredPhoto[]): Promise<void> {
    await Promise.all(storedPhotos.map(async (photo) => this.storage.remove(photo.storagePath)));
  }

  async read(storagePath: string): Promise<Buffer> {
    return this.storage.read(storagePath);
  }
}
