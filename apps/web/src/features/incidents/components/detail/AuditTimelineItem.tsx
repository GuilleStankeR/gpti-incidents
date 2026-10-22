import type { ReactElement } from 'react';

import type { AuditEntryItem } from '@incidents/shared';

import { IncidentStatusBadge } from '@/features/incidents/components/IncidentStatusBadge';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { roleLabels, statusLabels } from '@/shared/copy/domain-labels.copy';
import { formatDateTime } from '@/shared/lib/format';
import { Icon } from '@/shared/ui/icons/Icon';

interface AuditTimelineItemProps {
  readonly entry: AuditEntryItem;
  readonly isLast: boolean;
}

export function AuditTimelineItem({ entry, isLast }: AuditTimelineItemProps): ReactElement {
  const isStatusChange = entry.fromStatus !== entry.toStatus;

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {isLast ? null : (
        <span className="absolute top-8 bottom-0 left-4 w-px bg-slate-200" aria-hidden="true" />
      )}
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-accent ring-1 ring-slate-200">
        <Icon name={isStatusChange ? 'clock' : 'document'} size="sm" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {entry.fromStatus === null || !isStatusChange ? null : (
            <>
              <span className="text-slate-500">{statusLabels[entry.fromStatus]}</span>
              <span className="text-slate-400" aria-hidden="true">
                <Icon name="chevronRight" size="sm" />
              </span>
            </>
          )}
          <IncidentStatusBadge status={entry.toStatus} />
          {isStatusChange ? null : (
            <span className="text-xs text-slate-500">
              {incidentDetailCopy.auditTrail.noStatusChange}
            </span>
          )}
        </div>
        <p className="text-sm whitespace-pre-line text-slate-800">{entry.note}</p>
        <p className="text-xs text-slate-500">
          {incidentDetailCopy.auditTrail.actor(entry.user.name, roleLabels[entry.user.role])}
          <span aria-hidden="true">{incidentDetailCopy.auditTrail.separator}</span>
          <time dateTime={entry.createdAt}>{formatDateTime(entry.createdAt)}</time>
        </p>
      </div>
    </li>
  );
}
