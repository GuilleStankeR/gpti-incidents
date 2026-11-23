import { Module } from '@nestjs/common';

import { AppConfig } from '@/config/app-config';
import { StorageDriver } from '@/config/storage-driver';

import { DatabaseStorageAdapter } from './database-storage.adapter';
import { FILE_STORAGE } from './file-storage.port';
import type { FileStorage } from './file-storage.port';
import { LocalDiskStorageAdapter } from './local-disk-storage.adapter';
import { StoredFileRepository } from './stored-file.repository';

function selectFileStorage(
  config: AppConfig,
  localDiskStorage: LocalDiskStorageAdapter,
  databaseStorage: DatabaseStorageAdapter,
): FileStorage {
  return config.storageDriver === StorageDriver.DATABASE ? databaseStorage : localDiskStorage;
}

@Module({
  providers: [
    StoredFileRepository,
    LocalDiskStorageAdapter,
    DatabaseStorageAdapter,
    {
      provide: FILE_STORAGE,
      inject: [AppConfig, LocalDiskStorageAdapter, DatabaseStorageAdapter],
      useFactory: selectFileStorage,
    },
  ],
  exports: [FILE_STORAGE],
})
export class StorageModule {}
