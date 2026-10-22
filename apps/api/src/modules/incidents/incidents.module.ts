import { Module } from '@nestjs/common';

import { CatalogsModule } from '@/modules/catalogs/catalogs.module';
import { EvidenceModule } from '@/modules/evidence/evidence.module';
import { GeocodingModule } from '@/modules/geocoding/geocoding.module';
import { UsersModule } from '@/modules/users/users.module';

import { IncidentEvidenceService } from './incident-evidence.service';
import { IncidentGeocodingService } from './incident-geocoding.service';
import { IncidentRegistrationService } from './incident-registration.service';
import { IncidentWorkflowRepository } from './incident-workflow.repository';
import { IncidentWorkflowService } from './incident-workflow.service';
import { IncidentWriteRepository } from './incident-write.repository';
import { IncidentsController } from './incidents.controller';
import { IncidentsRepository } from './incidents.repository';
import { IncidentsService } from './incidents.service';

@Module({
  imports: [CatalogsModule, EvidenceModule, GeocodingModule, UsersModule],
  controllers: [IncidentsController],
  providers: [
    IncidentsRepository,
    IncidentWriteRepository,
    IncidentWorkflowRepository,
    IncidentsService,
    IncidentRegistrationService,
    IncidentWorkflowService,
    IncidentEvidenceService,
    IncidentGeocodingService,
  ],
})
export class IncidentsModule {}
