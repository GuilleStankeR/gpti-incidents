import { resolve } from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { JwtSettings, NominatimSettings, UploadSettings } from './app-config.types';
import type { Environment } from './environment';

const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService<Environment, true>) {}

  get apiPort(): number {
    return this.configService.get('API_PORT', { infer: true });
  }

  get jwt(): JwtSettings {
    return {
      secret: this.configService.get('JWT_SECRET', { infer: true }),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', { infer: true }),
    };
  }

  get storageDirectory(): string {
    return resolve(this.configService.get('STORAGE_DIR', { infer: true }));
  }

  get uploads(): UploadSettings {
    return {
      maxFileSizeBytes:
        this.configService.get('MAX_FILE_SIZE_MB', { infer: true }) * BYTES_PER_MEGABYTE,
      maxFilesPerUpload: this.configService.get('MAX_FILES_PER_UPLOAD', { infer: true }),
    };
  }

  get nominatim(): NominatimSettings {
    return {
      url: this.configService.get('NOMINATIM_URL', { infer: true }),
      userAgent: this.configService.get('NOMINATIM_USER_AGENT', { infer: true }),
      timeoutMs: this.configService.get('NOMINATIM_TIMEOUT_MS', { infer: true }),
    };
  }

  get timeZone(): string {
    return this.configService.get('TIME_ZONE', { infer: true });
  }
}
