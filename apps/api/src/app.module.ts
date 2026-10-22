import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { ApiExceptionFilter } from '@/common/filters/api-exception.filter';
import { createValidationPipe } from '@/common/pipes/validation.pipe';
import { AppConfigModule } from '@/config/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_PIPE, useFactory: createValidationPipe },
  ],
})
export class AppModule {}
