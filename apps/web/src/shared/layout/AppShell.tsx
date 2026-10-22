import type { ReactElement, ReactNode } from 'react';

import { BottomNavigation } from './BottomNavigation';
import { BrandMark } from './BrandMark';
import { DesktopNavigation } from './DesktopNavigation';
import type { NavigationItem, ShellBrand, ShellUser } from './navigation.types';
import { UserMenu } from './UserMenu';

interface AppShellProps {
  readonly brand: ShellBrand;
  readonly navigationItems: readonly NavigationItem[];
  readonly user: ShellUser;
  readonly onLogout: () => void;
  readonly children: ReactNode;
}

export function AppShell({
  brand,
  navigationItems,
  user,
  onLogout,
  children,
}: AppShellProps): ReactElement {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-8">
            <BrandMark brand={brand} />
            <DesktopNavigation items={navigationItems} />
          </div>
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 md:pb-12 lg:px-8">
        {children}
      </main>
      <BottomNavigation items={navigationItems} />
    </div>
  );
}
