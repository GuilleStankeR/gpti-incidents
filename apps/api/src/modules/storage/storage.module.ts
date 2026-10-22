import { Module } from '@nestjs/common';

import { FILE_STORAGE } from './file-storage.port';
import { LocalDiskStorageAdapter } from './local-disk-storage.adapter';

@Module({
  providers: [{ provide: FILE_STORAGE, useClass: LocalDiskStorageAdapter }],
  exports: [FILE_STORAGE],
})
export class StorageModule {}
