import { Injectable } from '@nestjs/common';

import { AppConfig } from '@/config/app-config';

import type { FileStorage } from './file-storage.port';
import {
  buildStoragePath,
  readStoredFile,
  removeStoredFile,
  saveImmutableFile,
} from './local-disk-files';

@Injectable()
export class LocalDiskStorageAdapter implements FileStorage {
  constructor(private readonly config: AppConfig) {}

  async save(directory: string, fileName: string, content: Buffer): Promise<string> {
    const storagePath = buildStoragePath(directory, fileName);
    await saveImmutableFile(this.config.storageDirectory, storagePath, content);
    return storagePath;
  }

  async read(storagePath: string): Promise<Buffer> {
    return readStoredFile(this.config.storageDirectory, storagePath);
  }

  async remove(storagePath: string): Promise<void> {
    await removeStoredFile(this.config.storageDirectory, storagePath);
  }
}
