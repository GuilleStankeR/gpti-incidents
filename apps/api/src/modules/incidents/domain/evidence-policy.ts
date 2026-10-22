import { ErrorCode, isTerminalStatus } from '@incidents/shared';
import type { IncidentStatus } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';

export function assertCanAttachEvidence(status: IncidentStatus): void {
  if (isTerminalStatus(status)) {
    throw new DomainError(ErrorCode.EVIDENCE_NOT_ALLOWED);
  }
}
