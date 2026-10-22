import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import type { LoginRequest } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';

function normalizeEmail({ value }: { readonly value: unknown }): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class LoginDto implements LoginRequest {
  @Transform(normalizeEmail)
  @IsEmail({}, { message: validationMessages.emailInvalid })
  readonly email!: string;

  @IsString({ message: validationMessages.passwordRequired })
  @IsNotEmpty({ message: validationMessages.passwordRequired })
  readonly password!: string;
}
