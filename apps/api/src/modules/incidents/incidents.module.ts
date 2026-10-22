import { Module } from '@nestjs/common';

import { CatalogsModule } from '@/modules/catalogs/catalogs.module';
import { EvidenceModule } from '@/modules/evidence/evidence.module';

import { IncidentRegistrationService } from './incident-registration.service';
import { IncidentWriteRepository } from './incident-write.repository';
import { IncidentsController } from './incidents.controller';
import { IncidentsRepository } from './incidents.repository';
import { IncidentsService } from './incidents.service';

@Module({
  imports: [CatalogsModule, EvidenceModule],
  controllers: [IncidentsController],
  providers: [
    IncidentsRepository,
    IncidentWriteRepository,
    IncidentsService,
    IncidentRegistrationService,
  ],
})
export class IncidentsModule {}
