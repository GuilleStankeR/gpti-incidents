import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { NOTE_MAX_LENGTH, NOTE_MIN_LENGTH } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';
import { trimText } from '@/common/validation/trim-text';

export function IsAuditNote(): PropertyDecorator {
  return applyDecorators(
    Transform(trimText),
    IsString({ message: validationMessages.noteLength }),
    Length(NOTE_MIN_LENGTH, NOTE_MAX_LENGTH, { message: validationMessages.noteLength }),
  );
}
