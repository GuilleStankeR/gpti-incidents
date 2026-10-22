import {
  ErrorCode,
  STATUS_TRANSITIONS,
  canRoleTransitionTo,
  isTransitionAllowed,
} from '@incidents/shared';
import type { IncidentStatus, Role } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';

export function assertTransitionAllowed(from: IncidentStatus, to: IncidentStatus): void {
  if (!isTransitionAllowed(from, to)) {
    throw new DomainError(ErrorCode.INVALID_TRANSITION);
  }
}

export function getAvailableTransitions(
  status: IncidentStatus,
  role: Role,
): readonly IncidentStatus[] {
  return STATUS_TRANSITIONS[status].filter((target) => canRoleTransitionTo(role, target));
}
