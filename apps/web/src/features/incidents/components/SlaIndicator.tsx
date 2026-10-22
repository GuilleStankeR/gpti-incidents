import type { ReactElement } from 'react';

import type { IncidentSummary } from '@incidents/shared';

import { describeSla } from '@/features/incidents/presentation/sla-presentation';
import type { SlaTone } from '@/features/incidents/presentation/sla-presentation';
import { classNames } from '@/shared/lib/class-names';

interface SlaIndicatorProps {
  readonly incident: IncidentSummary;
}

const DOT_CLASSES: Readonly<Record<SlaTone, string>> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-600',
  muted: 'bg-slate-300',
};

const LABEL_CLASSES: Readonly<Record<SlaTone, string>> = {
  green: 'text-emerald-700',
  amber: 'text-amber-800',
  red: 'text-red-700',
  muted: 'text-slate-500',
};

export function SlaIndicator({ incident }: SlaIndicatorProps): ReactElement {
  const sla = describeSla(incident);

  return (
    <div className="flex items-start gap-2">
      <span
        aria-hidden="true"
        className={classNames('mt-1.5 size-2 shrink-0 rounded-full', DOT_CLASSES[sla.tone])}
      />
      <div className="flex flex-col leading-tight">
        <span
          className={classNames('text-sm font-medium whitespace-nowrap', LABEL_CLASSES[sla.tone])}
        >
          {sla.label}
        </span>
        {sla.detail === undefined ? null : (
          <span className="text-xs whitespace-nowrap text-slate-500">{sla.detail}</span>
        )}
      </div>
    </div>
  );
}
