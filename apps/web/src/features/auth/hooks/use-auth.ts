import { useContext } from 'react';

import { hasCapability } from '@incidents/shared';
import type { Capability } from '@incidents/shared';

import { AuthContext } from '@/features/auth/auth-context';
import type { AuthContextValue, Session } from '@/features/auth/session.types';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export function useSession(): Session {
  const { session } = useAuth();

  if (session === null) {
    throw new Error('useSession requires an authenticated session');
  }

  return session;
}

export function useCapability(capability: Capability): boolean {
  const { session } = useAuth();
  return session !== null && hasCapability(session.user.role, capability);
}
