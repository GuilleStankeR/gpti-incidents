import { IncidentStatus, SlaStatus } from '@incidents/shared';
import type { IncidentSummary } from '@incidents/shared';

import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { commonCopy } from '@/shared/copy/common.copy';
import { slaLabels } from '@/shared/copy/domain-labels.copy';
import { formatDecimal } from '@/shared/lib/format';

const HOURS_PER_DAY = 24;
const DAYS_THRESHOLD_HOURS = 48;

export type SlaTone = 'green' | 'amber' | 'red' | 'muted';

export interface SlaPresentation {
  readonly tone: SlaTone;
  readonly label: string;
  readonly detail?: string;
}

const SLA_TONES: Readonly<Record<SlaStatus, SlaTone>> = {
  ON_TRACK: 'green',
  AT_RISK: 'amber',
  OVERDUE: 'red',
};

export function formatDuration(hours: number): string {
  const absoluteHours = Math.abs(hours);

  if (absoluteHours >= DAYS_THRESHOLD_HOURS) {
    return commonCopy.duration.days(formatDecimal(absoluteHours / HOURS_PER_DAY));
  }

  return commonCopy.duration.hours(formatDecimal(absoluteHours));
}

function describeTerminal(incident: IncidentSummary): SlaPresentation {
  if (incident.status === IncidentStatus.CLOSED) {
    return {
      tone: 'muted',
      label: incident.isOverdue ? incidentsCopy.sla.closedLate : incidentsCopy.sla.closedOnTime,
    };
  }

  return { tone: 'muted', label: commonCopy.emptyValue };
}

export function describeSla(incident: IncidentSummary): SlaPresentation {
  if (incident.slaStatus === null || incident.hoursRemaining === null) {
    return describeTerminal(incident);
  }

  const duration = formatDuration(incident.hoursRemaining);
  const detail =
    incident.slaStatus === SlaStatus.OVERDUE
      ? incidentsCopy.sla.overdueBy(duration)
      : incidentsCopy.sla.dueIn(duration);

  return { tone: SLA_TONES[incident.slaStatus], label: slaLabels[incident.slaStatus], detail };
}
