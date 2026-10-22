import type { ErrorCode } from '@incidents/shared';

export class DomainError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly detail?: string,
  ) {
    super(detail ?? code);
    this.name = DomainError.name;
  }
}
