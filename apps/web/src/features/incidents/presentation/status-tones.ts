import type { IncidentStatus } from '@incidents/shared';

import type { BadgeTone } from '@/shared/ui/Badge';

export const STATUS_TONES: Readonly<Record<IncidentStatus, BadgeTone>> = {
  REPORTED: 'neutral',
  UNDER_REVIEW: 'amber',
  ASSIGNED: 'blue',
  IN_PROGRESS: 'indigo',
  CLOSED: 'green',
  REJECTED: 'red',
};
