import type { ReactElement } from 'react';

import { Icon } from '@/shared/ui/icons/Icon';

import type { ShellBrand } from './navigation.types';

interface BrandMarkProps {
  readonly brand: ShellBrand;
}

export function BrandMark({ brand }: BrandMarkProps): ReactElement {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
        <Icon name="building" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-slate-900">{brand.title}</span>
        <span className="truncate text-xs text-slate-500">{brand.subtitle}</span>
      </div>
    </div>
  );
}
