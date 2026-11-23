import type { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { hasCapability } from '@incidents/shared';
import type { Capability } from '@incidents/shared';

import { useAuth } from '@/features/auth/hooks/use-auth';
import type { LoginRedirectState } from '@/features/auth/login-redirect';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';

interface ProtectedRouteProps {
  readonly requiredCapability?: Capability;
}

export function ProtectedRoute({ requiredCapability }: ProtectedRouteProps): ReactElement {
  const { session } = useAuth();
  const location = useLocation();

  if (session === null) {
    const state: LoginRedirectState = { from: `${location.pathname}${location.search}` };
    return <Navigate to={ROUTE_PATHS.login} replace state={state} />;
  }

  if (requiredCapability !== undefined && !hasCapability(session.user.role, requiredCapability)) {
    return <Navigate to={ROUTE_PATHS.incidents} replace />;
  }

  return <Outlet />;
}
