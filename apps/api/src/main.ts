import { Logger } from '@nestjs/common';
import type { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import { API_GLOBAL_PREFIX } from '@/common/http/api-routes';
import { AppConfig } from '@/config/app-config';

const APPLICATION_OPTIONS: Pick<NestApplicationOptions, 'abortOnError'> = { abortOnError: false };
const TRUST_PROXY_SETTING = 'trust proxy';
const HELMET_OPTIONS = { crossOriginResourcePolicy: { policy: 'cross-origin' } } as const;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, APPLICATION_OPTIONS);
  const config = app.get(AppConfig);

  app.set(TRUST_PROXY_SETTING, config.trustProxyHops);
  app.use(helmet(HELMET_OPTIONS));
  app.enableCors({ origin: [...config.corsOrigins] });
  app.setGlobalPrefix(API_GLOBAL_PREFIX);
  app.enableShutdownHooks();

  await app.listen(config.apiPort);
  new Logger('Bootstrap').log(`API listening on port ${String(config.apiPort)}`);
}

void bootstrap();
