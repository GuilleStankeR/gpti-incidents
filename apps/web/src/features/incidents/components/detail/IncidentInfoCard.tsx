import type { ReactElement } from 'react';

import type { IncidentDetail } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { formatDateTime } from '@/shared/lib/format';
import { Card } from '@/shared/ui/Card';
import { DescriptionList } from '@/shared/ui/DescriptionList';
import type { DescriptionItem } from '@/shared/ui/DescriptionList';

interface IncidentInfoCardProps {
  readonly incident: IncidentDetail;
}

function buildItems(incident: IncidentDetail): DescriptionItem[] {
  const copy = incidentDetailCopy.info;
  const closedItems =
    incident.closedAt === null
      ? []
      : [{ label: copy.closedAt, value: formatDateTime(incident.closedAt) }];

  return [
    { label: copy.category, value: incident.category.name },
    { label: copy.location, value: incident.location },
    { label: copy.occurredAt, value: formatDateTime(incident.occurredAt) },
    { label: copy.reportedAt, value: formatDateTime(incident.reportedAt) },
    { label: copy.dueAt, value: formatDateTime(incident.dueAt) },
    ...closedItems,
    { label: copy.reporter, value: incident.reporter.name },
    { label: copy.assignee, value: incident.assignee?.name ?? copy.unassigned },
    {
      label: copy.description,
      value: <p className="whitespace-pre-line text-slate-800">{incident.description}</p>,
      isWide: true,
    },
  ];
}

export function IncidentInfoCard({ incident }: IncidentInfoCardProps): ReactElement {
  return (
    <Card title={incidentDetailCopy.info.title}>
      <DescriptionList items={buildItems(incident)} />
    </Card>
  );
}
