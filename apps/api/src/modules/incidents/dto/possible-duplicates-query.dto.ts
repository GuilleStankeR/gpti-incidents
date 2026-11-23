import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import type { PossibleDuplicatesQuery } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';
import { LOCATIONS } from '@/modules/catalogs/locations.catalog';

export class PossibleDuplicatesQueryDto implements PossibleDuplicatesQuery {
  @IsString({ message: validationMessages.categoryInvalid })
  @IsNotEmpty({ message: validationMessages.categoryInvalid })
  readonly category!: string;

  @IsIn(LOCATIONS, { message: validationMessages.locationInvalid })
  readonly location!: string;
}
