import { IsISO8601, IsOptional } from 'class-validator';

import type { MetricsQuery } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';

export class MetricsQueryDto implements MetricsQuery {
  @IsOptional()
  @IsISO8601({ strict: true }, { message: validationMessages.dateInvalid })
  readonly from?: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: validationMessages.dateInvalid })
  readonly to?: string;
}
