import type { ReactElement } from 'react';

import type { AuditEntryItem } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { Card } from '@/shared/ui/Card';

import { AuditTimelineItem } from './AuditTimelineItem';

interface AuditTimelineCardProps {
  readonly entries: readonly AuditEntryItem[];
}

export function AuditTimelineCard({ entries }: AuditTimelineCardProps): ReactElement {
  return (
    <Card
      title={incidentDetailCopy.auditTrail.title}
      description={incidentDetailCopy.auditTrail.description}
    >
      <ol>
        {entries.map((entry, index) => (
          <AuditTimelineItem key={entry.id} entry={entry} isLast={index === entries.length - 1} />
        ))}
      </ol>
    </Card>
  );
}
