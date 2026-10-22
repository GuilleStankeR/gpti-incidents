import { IncidentStatus } from '@incidents/shared';

import type { ButtonVariant } from '@/shared/ui/button-styles';

export function transitionButtonVariant(target: IncidentStatus): ButtonVariant {
  return target === IncidentStatus.REJECTED ? 'danger' : 'primary';
}

export function requiresAssignee(target: IncidentStatus): boolean {
  return target === IncidentStatus.ASSIGNED;
}
