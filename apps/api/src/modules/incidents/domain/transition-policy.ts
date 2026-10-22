import { ErrorCode, IncidentStatus, NOTE_MIN_LENGTH, canRoleTransitionTo } from '@incidents/shared';
import type { Role } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';

export interface TransitionRequirements {
  readonly target: IncidentStatus;
  readonly assigneeId: string | undefined;
  readonly evidenceCount: number;
  readonly note: string;
}

export function assertRoleCanTransition(role: Role, target: IncidentStatus): void {
  if (!canRoleTransitionTo(role, target)) {
    throw new DomainError(ErrorCode.FORBIDDEN_ROLE);
  }
}

export function assertValidNote(note: string): void {
  if (note.trim().length < NOTE_MIN_LENGTH) {
    throw new DomainError(ErrorCode.VALIDATION_FAILED);
  }
}

export function assertTransitionRequirements(requirements: TransitionRequirements): void {
  assertValidNote(requirements.note);

  if (requirements.target === IncidentStatus.ASSIGNED && requirements.assigneeId === undefined) {
    throw new DomainError(ErrorCode.ASSIGNEE_REQUIRED);
  }

  if (requirements.target === IncidentStatus.CLOSED && requirements.evidenceCount === 0) {
    throw new DomainError(ErrorCode.CLOSURE_WITHOUT_EVIDENCE);
  }
}
