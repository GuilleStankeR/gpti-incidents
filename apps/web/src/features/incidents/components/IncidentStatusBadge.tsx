import type { ReactElement } from 'react';

import type { IncidentStatus } from '@incidents/shared';

import { STATUS_TONES } from '@/features/incidents/presentation/status-tones';
import { statusLabels } from '@/shared/copy/domain-labels.copy';
import { Badge } from '@/shared/ui/Badge';

interface IncidentStatusBadgeProps {
  readonly status: IncidentStatus;
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps): ReactElement {
  return <Badge tone={STATUS_TONES[status]}>{statusLabels[status]}</Badge>;
}
