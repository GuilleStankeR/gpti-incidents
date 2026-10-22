import type { ReactElement, ReactNode } from 'react';

import { classNames } from '@/shared/lib/class-names';

export type BadgeTone = 'neutral' | 'amber' | 'blue' | 'indigo' | 'green' | 'red';

interface BadgeProps {
  readonly tone: BadgeTone;
  readonly children: ReactNode;
}

const TONE_CLASSES: Readonly<Record<BadgeTone, string>> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
};

export function Badge({ tone, children }: BadgeProps): ReactElement {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}
