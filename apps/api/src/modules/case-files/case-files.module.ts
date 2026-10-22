import { Module } from '@nestjs/common';

import { EvidenceModule } from '@/modules/evidence/evidence.module';

import { CaseFilesController } from './case-files.controller';
import { CaseFilesRepository } from './case-files.repository';
import { CaseFilesService } from './case-files.service';

@Module({
  imports: [EvidenceModule],
  controllers: [CaseFilesController],
  providers: [CaseFilesRepository, CaseFilesService],
})
export class CaseFilesModule {}
