import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

export const ERROR_HTTP_STATUS: Readonly<Record<ErrorCode, HttpStatus>> = {
  [ErrorCode.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.FORBIDDEN_ROLE]: HttpStatus.FORBIDDEN,
  [ErrorCode.RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.INVALID_TRANSITION]: HttpStatus.CONFLICT,
  [ErrorCode.CLOSURE_WITHOUT_EVIDENCE]: HttpStatus.CONFLICT,
  [ErrorCode.INVALID_REASSIGNMENT]: HttpStatus.CONFLICT,
  [ErrorCode.EVIDENCE_NOT_ALLOWED]: HttpStatus.CONFLICT,
  [ErrorCode.ASSIGNEE_REQUIRED]: HttpStatus.BAD_REQUEST,
  [ErrorCode.INVALID_ASSIGNEE]: HttpStatus.BAD_REQUEST,
  [ErrorCode.INVALID_OCCURRED_AT]: HttpStatus.BAD_REQUEST,
  [ErrorCode.INVALID_FILE]: HttpStatus.BAD_REQUEST,
  [ErrorCode.VALIDATION_FAILED]: HttpStatus.BAD_REQUEST,
  [ErrorCode.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};

export const FRAMEWORK_STATUS_ERROR_CODES: Readonly<Partial<Record<number, ErrorCode>>> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.VALIDATION_FAILED,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHENTICATED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN_ROLE,
  [HttpStatus.NOT_FOUND]: ErrorCode.RESOURCE_NOT_FOUND,
  [HttpStatus.PAYLOAD_TOO_LARGE]: ErrorCode.INVALID_FILE,
};
