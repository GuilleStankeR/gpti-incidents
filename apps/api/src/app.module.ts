import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { ApiExceptionFilter } from '@/common/filters/api-exception.filter';
import { createValidationPipe } from '@/common/pipes/validation.pipe';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_PIPE, useFactory: createValidationPipe },
  ],
})
export class AppModule {}
