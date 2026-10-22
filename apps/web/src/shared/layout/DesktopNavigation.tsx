import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import { commonCopy } from '@/shared/copy/common.copy';
import { classNames } from '@/shared/lib/class-names';
import { Icon } from '@/shared/ui/icons/Icon';

import type { NavigationItem } from './navigation.types';

interface DesktopNavigationProps {
  readonly items: readonly NavigationItem[];
}

function linkClassNames({ isActive }: { readonly isActive: boolean }): string {
  return classNames(
    'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent-ring',
    isActive
      ? 'bg-accent-muted text-accent'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  );
}

export function DesktopNavigation({ items }: DesktopNavigationProps): ReactElement {
  return (
    <nav aria-label={commonCopy.navigation.label} className="hidden items-center gap-1 md:flex">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.isExactMatch} className={linkClassNames}>
          <Icon name={item.icon} size="sm" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
