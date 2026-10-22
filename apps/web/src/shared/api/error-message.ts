import { commonCopy } from '@/shared/copy/common.copy';

import { ApiError } from './api-error';

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : commonCopy.errors.unexpected;
}
