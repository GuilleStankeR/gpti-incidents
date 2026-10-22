import { chmod, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, posix, resolve, sep } from 'node:path';

import { Injectable } from '@nestjs/common';

import { AppConfig } from '@/config/app-config';

import type { FileStorage } from './file-storage.port';

const READ_ONLY_FILE_MODE = 0o444;
const CREATE_EXCLUSIVE_FLAG = 'wx';

@Injectable()
export class LocalDiskStorageAdapter implements FileStorage {
  constructor(private readonly config: AppConfig) {}

  async save(directory: string, fileName: string, content: Buffer): Promise<string> {
    const storagePath = posix.join(directory, fileName);
    const absolutePath = this.resolveAbsolutePath(storagePath);

    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, { flag: CREATE_EXCLUSIVE_FLAG });
    await chmod(absolutePath, READ_ONLY_FILE_MODE);

    return storagePath;
  }

  async read(storagePath: string): Promise<Buffer> {
    return readFile(this.resolveAbsolutePath(storagePath));
  }

  async remove(storagePath: string): Promise<void> {
    await rm(this.resolveAbsolutePath(storagePath), { force: true });
  }

  private resolveAbsolutePath(storagePath: string): string {
    const rootDirectory = this.config.storageDirectory;
    const absolutePath = resolve(rootDirectory, storagePath);

    if (!absolutePath.startsWith(`${rootDirectory}${sep}`)) {
      throw new Error(`Storage path escapes the storage directory: ${storagePath}`);
    }

    return absolutePath;
  }
}
