import type { ErrorCode } from '@incidents/shared';

import { HTTP_STATUS } from './http-status';

export class ApiError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = ApiError.name;
  }

  get isClientError(): boolean {
    return (
      this.status >= HTTP_STATUS.BAD_REQUEST && this.status < HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
