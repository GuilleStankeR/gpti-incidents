import type { ReactElement, ReactNode } from 'react';

import { classNames } from '@/shared/lib/class-names';

export interface DescriptionItem {
  readonly label: string;
  readonly value: ReactNode;
  readonly isWide?: boolean;
}

interface DescriptionListProps {
  readonly items: readonly DescriptionItem[];
}

export function DescriptionList({ items }: DescriptionListProps): ReactElement {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={classNames('flex flex-col gap-1', item.isWide === true && 'sm:col-span-2')}
        >
          <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
            {item.label}
          </dt>
          <dd className="text-sm text-slate-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
