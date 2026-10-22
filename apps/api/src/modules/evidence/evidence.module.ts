import { Module } from '@nestjs/common';

import { StorageModule } from '@/modules/storage/storage.module';

import { EvidenceFilesService } from './evidence-files.service';

@Module({
  imports: [StorageModule],
  providers: [EvidenceFilesService],
  exports: [EvidenceFilesService],
})
export class EvidenceModule {}
