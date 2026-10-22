import { HttpException } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';
import type { ApiErrorResponse } from '@incidents/shared';

import { DomainError } from './domain-error';
import { ERROR_HTTP_STATUS, FRAMEWORK_STATUS_ERROR_CODES } from './error-http-status';
import { ERROR_MESSAGES } from './error-messages.copy';

function resolveErrorCode(exception: unknown): ErrorCode {
  if (exception instanceof DomainError) {
    return exception.code;
  }

  if (exception instanceof HttpException) {
    return FRAMEWORK_STATUS_ERROR_CODES[exception.getStatus()] ?? ErrorCode.INTERNAL_ERROR;
  }

  return ErrorCode.INTERNAL_ERROR;
}

function resolveMessage(exception: unknown, code: ErrorCode): string {
  if (exception instanceof DomainError && exception.detail !== undefined) {
    return exception.detail;
  }

  return ERROR_MESSAGES[code];
}

export function buildErrorResponse(exception: unknown): ApiErrorResponse {
  const code = resolveErrorCode(exception);

  return {
    code,
    message: resolveMessage(exception, code),
    status: ERROR_HTTP_STATUS[code],
  };
}
