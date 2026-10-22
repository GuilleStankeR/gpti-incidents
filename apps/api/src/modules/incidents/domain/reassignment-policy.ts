import { ErrorCode, isReassignableStatus } from '@incidents/shared';
import type { IncidentStatus } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';

export function assertReassignable(status: IncidentStatus): void {
  if (!isReassignableStatus(status)) {
    throw new DomainError(ErrorCode.INVALID_REASSIGNMENT);
  }
}
