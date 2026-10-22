import { ValidationPipe } from '@nestjs/common';
import type { ValidationError } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';

function findFirstConstraintMessage(errors: readonly ValidationError[]): string | undefined {
  for (const error of errors) {
    const [message] = Object.values(error.constraints ?? {});
    const nestedMessage = message ?? findFirstConstraintMessage(error.children ?? []);

    if (nestedMessage !== undefined) {
      return nestedMessage;
    }
  }

  return undefined;
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) =>
      new DomainError(ErrorCode.VALIDATION_FAILED, findFirstConstraintMessage(errors)),
  });
}
