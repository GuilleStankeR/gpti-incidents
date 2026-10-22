import type { ErrorCode } from '../error-code.js';

export interface ApiErrorResponse {
  readonly code: ErrorCode;
  readonly message: string;
  readonly status: number;
}
