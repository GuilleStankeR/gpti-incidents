import type { ReactElement, ReactNode } from 'react';

import { classNames } from '@/shared/lib/class-names';

import { Icon } from './icons/Icon';
import type { IconName } from './icons/icon-paths';

export type AlertTone = 'error' | 'success' | 'info' | 'warning';

interface InlineAlertProps {
  readonly tone: AlertTone;
  readonly title?: string;
  readonly children?: ReactNode;
}

const TONE_STYLES: Readonly<
  Record<AlertTone, { readonly classes: string; readonly icon: IconName }>
> = {
  error: { classes: 'border-red-200 bg-red-50 text-red-900', icon: 'warning' },
  success: { classes: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: 'checkCircle' },
  info: { classes: 'border-blue-200 bg-blue-50 text-blue-900', icon: 'info' },
  warning: { classes: 'border-amber-200 bg-amber-50 text-amber-900', icon: 'warning' },
};

export function InlineAlert({ tone, title, children }: InlineAlertProps): ReactElement {
  const style = TONE_STYLES[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={classNames('flex gap-3 rounded-lg border px-4 py-3 text-sm', style.classes)}
    >
      <Icon name={style.icon} />
      <div className="flex flex-col gap-0.5">
        {title === undefined ? null : <p className="font-semibold">{title}</p>}
        {children === undefined ? null : <div>{children}</div>}
      </div>
    </div>
  );
}
