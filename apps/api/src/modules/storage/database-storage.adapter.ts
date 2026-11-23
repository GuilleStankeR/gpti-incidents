import { Injectable } from '@nestjs/common';

import type { FileStorage } from './file-storage.port';
import { buildStoragePath } from './storage-path';
import { StoredFileRepository } from './stored-file.repository';

@Injectable()
export class DatabaseStorageAdapter implements FileStorage {
  constructor(private readonly storedFileRepository: StoredFileRepository) {}

  async save(directory: string, fileName: string, content: Buffer): Promise<string> {
    const storagePath = buildStoragePath(directory, fileName);
    await this.storedFileRepository.insert(storagePath, content);
    return storagePath;
  }

  async read(storagePath: string): Promise<Buffer> {
    return this.storedFileRepository.findContent(storagePath);
  }

  async remove(storagePath: string): Promise<void> {
    await this.storedFileRepository.delete(storagePath);
  }
}
