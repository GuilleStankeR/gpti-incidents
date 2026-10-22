import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

import { INCIDENT_STATUSES, MAX_PAGE_SIZE, SEARCH_MAX_LENGTH } from '@incidents/shared';
import type { IncidentStatus, ListIncidentsQuery } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';

const MIN_PAGE = 1;

function trimText({ value }: { readonly value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class ListIncidentsQueryDto implements ListIncidentsQuery {
  @IsOptional()
  @IsIn(INCIDENT_STATUSES, { message: validationMessages.statusInvalid })
  readonly status?: IncidentStatus;

  @IsOptional()
  @IsString({ message: validationMessages.categoryInvalid })
  readonly category?: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: validationMessages.dateInvalid })
  readonly from?: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: validationMessages.dateInvalid })
  readonly to?: string;

  @IsOptional()
  @Transform(trimText)
  @IsString({ message: validationMessages.searchTooLong })
  @MaxLength(SEARCH_MAX_LENGTH, { message: validationMessages.searchTooLong })
  readonly search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: validationMessages.paginationInvalid })
  @Min(MIN_PAGE, { message: validationMessages.paginationInvalid })
  readonly page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: validationMessages.paginationInvalid })
  @Min(MIN_PAGE, { message: validationMessages.paginationInvalid })
  @Max(MAX_PAGE_SIZE, { message: validationMessages.paginationInvalid })
  readonly pageSize?: number;
}
