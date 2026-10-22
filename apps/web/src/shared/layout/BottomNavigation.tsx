import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import { commonCopy } from '@/shared/copy/common.copy';
import { classNames } from '@/shared/lib/class-names';
import { Icon } from '@/shared/ui/icons/Icon';

import type { NavigationItem } from './navigation.types';

interface BottomNavigationProps {
  readonly items: readonly NavigationItem[];
}

function linkClassNames({ isActive }: { readonly isActive: boolean }): string {
  return classNames(
    'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium',
    isActive ? 'text-accent' : 'text-slate-500',
  );
}

export function BottomNavigation({ items }: BottomNavigationProps): ReactElement {
  return (
    <nav
      aria-label={commonCopy.navigation.label}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto flex max-w-md">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.isExactMatch} className={linkClassNames}>
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
