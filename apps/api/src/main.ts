import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { API_GLOBAL_PREFIX } from '@/common/http/api-routes';
import { AppConfig } from '@/config/app-config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const config = app.get(AppConfig);

  app.setGlobalPrefix(API_GLOBAL_PREFIX);
  app.enableShutdownHooks();

  await app.listen(config.apiPort);
  new Logger('Bootstrap').log(`API listening on port ${String(config.apiPort)}`);
}

void bootstrap();
