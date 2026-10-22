import { Module } from '@nestjs/common';

import { StorageModule } from '@/modules/storage/storage.module';

import { EvidenceDownloadService } from './evidence-download.service';
import { EvidenceFilesService } from './evidence-files.service';
import { EvidenceController } from './evidence.controller';
import { EvidenceRepository } from './evidence.repository';

@Module({
  imports: [StorageModule],
  controllers: [EvidenceController],
  providers: [EvidenceFilesService, EvidenceRepository, EvidenceDownloadService],
  exports: [EvidenceFilesService],
})
export class EvidenceModule {}
