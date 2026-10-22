import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { DemoAccountsCard } from '@/features/auth/components/DemoAccountsCard';
import { LoginBrandPanel } from '@/features/auth/components/LoginBrandPanel';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useLoginForm } from '@/features/auth/hooks/use-login-form';
import { commonCopy } from '@/shared/copy/common.copy';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';
import { Icon } from '@/shared/ui/icons/Icon';

export function LoginPage(): ReactElement {
  const { session } = useAuth();
  const form = useLoginForm();

  if (session !== null) {
    return <Navigate to={ROUTE_PATHS.incidents} replace />;
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <LoginBrandPanel />
      <main className="flex flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-white">
              <Icon name="building" />
            </span>
            <span className="font-semibold text-slate-900">{commonCopy.appName}</span>
          </div>
          <LoginForm form={form} />
          <DemoAccountsCard onSelect={form.fillCredentials} />
        </div>
      </main>
    </div>
  );
}
