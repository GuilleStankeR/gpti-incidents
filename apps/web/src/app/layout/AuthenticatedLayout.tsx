import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth, useSession } from '@/features/auth/hooks/use-auth';
import { commonCopy } from '@/shared/copy/common.copy';
import { roleLabels } from '@/shared/copy/domain-labels.copy';
import { AppShell } from '@/shared/layout/AppShell';

import { useNavigationItems } from './use-navigation-items';

export function AuthenticatedLayout(): ReactElement {
  const { logout } = useAuth();
  const { user } = useSession();
  const navigationItems = useNavigationItems();

  return (
    <AppShell
      brand={{ title: commonCopy.appName, subtitle: user.condominium.name }}
      navigationItems={navigationItems}
      user={{ name: user.name, roleLabel: roleLabels[user.role] }}
      onLogout={logout}
    >
      <Outlet />
    </AppShell>
  );
}
