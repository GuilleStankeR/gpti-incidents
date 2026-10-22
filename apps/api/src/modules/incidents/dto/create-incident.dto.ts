import { Transform, Type } from 'class-transformer';
import {
  IsISO8601,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH } from '@incidents/shared';
import type { CreateIncidentRequest } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';
import { LOCATIONS } from '@/modules/catalogs/locations.catalog';

function trimText({ value }: { readonly value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function hasCoordinates(input: CreateIncidentDto): boolean {
  return input.latitude !== undefined || input.longitude !== undefined;
}

export class CreateIncidentDto implements CreateIncidentRequest {
  @IsString({ message: validationMessages.categoryInvalid })
  @IsNotEmpty({ message: validationMessages.categoryInvalid })
  readonly categoryCode!: string;

  @Transform(trimText)
  @IsString({ message: validationMessages.descriptionLength })
  @Length(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, {
    message: validationMessages.descriptionLength,
  })
  readonly description!: string;

  @IsIn(LOCATIONS, { message: validationMessages.locationInvalid })
  readonly location!: string;

  @IsISO8601({ strict: true }, { message: validationMessages.occurredAtInvalid })
  readonly occurredAt!: string;

  @ValidateIf(hasCoordinates)
  @Type(() => Number)
  @IsLatitude({ message: validationMessages.coordinatesInvalid })
  readonly latitude?: number;

  @ValidateIf(hasCoordinates)
  @Type(() => Number)
  @IsLongitude({ message: validationMessages.coordinatesInvalid })
  readonly longitude?: number;
}
