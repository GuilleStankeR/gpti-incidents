import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsTimeZone,
  IsUrl,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

import { DURATION_PATTERN } from './duration';

const MIN_TCP_PORT = 1;
const MAX_TCP_PORT = 65_535;
const MIN_JWT_SECRET_LENGTH = 16;

export class Environment {
  @IsString()
  @IsNotEmpty()
  readonly DATABASE_URL!: string;

  @IsString()
  @MinLength(MIN_JWT_SECRET_LENGTH)
  readonly JWT_SECRET!: string;

  @Matches(DURATION_PATTERN)
  readonly JWT_EXPIRES_IN!: string;

  @IsInt()
  @Min(MIN_TCP_PORT)
  @Max(MAX_TCP_PORT)
  readonly API_PORT!: number;

  @IsString()
  @IsNotEmpty()
  readonly STORAGE_DIR!: string;

  @IsInt()
  @IsPositive()
  readonly MAX_FILE_SIZE_MB!: number;

  @IsInt()
  @IsPositive()
  readonly MAX_FILES_PER_UPLOAD!: number;

  @IsUrl({ require_tld: false })
  readonly NOMINATIM_URL!: string;

  @IsString()
  @IsNotEmpty()
  readonly NOMINATIM_USER_AGENT!: string;

  @IsInt()
  @IsPositive()
  readonly NOMINATIM_TIMEOUT_MS!: number;

  @IsTimeZone()
  readonly TIME_ZONE!: string;
}
