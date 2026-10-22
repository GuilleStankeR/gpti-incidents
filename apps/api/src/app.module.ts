import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { ApiExceptionFilter } from '@/common/filters/api-exception.filter';
import { createValidationPipe } from '@/common/pipes/validation.pipe';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CaseFilesModule } from '@/modules/case-files/case-files.module';
import { CatalogsModule } from '@/modules/catalogs/catalogs.module';
import { IncidentsModule } from '@/modules/incidents/incidents.module';
import { MetricsModule } from '@/modules/metrics/metrics.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    CatalogsModule,
    UsersModule,
    IncidentsModule,
    CaseFilesModule,
    MetricsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_PIPE, useFactory: createValidationPipe },
  ],
})
export class AppModule {}
