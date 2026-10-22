import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { ApiExceptionFilter } from '@/common/filters/api-exception.filter';
import { createValidationPipe } from '@/common/pipes/validation.pipe';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CatalogsModule } from '@/modules/catalogs/catalogs.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, AuthModule, CatalogsModule, UsersModule],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_PIPE, useFactory: createValidationPipe },
  ],
})
export class AppModule {}
