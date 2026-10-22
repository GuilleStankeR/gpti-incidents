import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import type { LoginRequest } from '@incidents/shared';

import { ROUTE_PATHS } from '@/shared/routing/route-paths';

import { requestLogin } from './api/auth.api';
import { AuthContext } from './auth-context';
import { subscribeToSessionExpired } from './session-events';
import { clearSession, readSession, writeSession } from './session-storage';
import type { AuthContextValue, Session } from './session.types';

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(readSession);

  const logout = useCallback(() => {
    clearSession();
    queryClient.clear();
    setSession(null);
    void navigate(ROUTE_PATHS.login, { replace: true });
  }, [navigate, queryClient]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await requestLogin(credentials);
    writeSession(response);
    setSession(response);
  }, []);

  useEffect(() => subscribeToSessionExpired(logout), [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({ session, login, logout }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
