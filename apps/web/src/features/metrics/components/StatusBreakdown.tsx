import type { ReactElement } from 'react';

import { INCIDENT_STATUSES } from '@incidents/shared';
import type { IncidentStatus, MetricsResponse } from '@incidents/shared';

import { metricsCopy } from '@/features/metrics/metrics.copy';
import { statusLabels } from '@/shared/copy/domain-labels.copy';
import { Card } from '@/shared/ui/Card';

import { HorizontalBarChart } from './HorizontalBarChart';

interface StatusBreakdownProps {
  readonly metrics: MetricsResponse;
}

const STATUS_BAR_CLASSES: Readonly<Record<IncidentStatus, string>> = {
  REPORTED: 'fill-slate-400',
  UNDER_REVIEW: 'fill-amber-500',
  ASSIGNED: 'fill-blue-600',
  IN_PROGRESS: 'fill-indigo-600',
  CLOSED: 'fill-emerald-600',
  REJECTED: 'fill-red-400',
};

export function StatusBreakdown({ metrics }: StatusBreakdownProps): ReactElement {
  return (
    <Card title={metricsCopy.breakdowns.byStatus}>
      <HorizontalBarChart
        items={INCIDENT_STATUSES.map((status) => ({
          key: status,
          label: statusLabels[status],
          value: metrics.byStatus[status],
          barClassName: STATUS_BAR_CLASSES[status],
        }))}
      />
    </Card>
  );
}
