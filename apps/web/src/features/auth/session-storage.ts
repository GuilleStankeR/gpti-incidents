import { ROLES } from '@incidents/shared';
import type { SessionUser } from '@incidents/shared';

import type { Session } from './session.types';

const TOKEN_KEY = 'incidents.token';
const USER_KEY = 'incidents.user';

function isSessionUser(value: unknown): value is SessionUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<SessionUser>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    candidate.role !== undefined &&
    ROLES.includes(candidate.role) &&
    typeof candidate.condominium === 'object'
  );
}

function parseUser(serializedUser: string): SessionUser | null {
  try {
    const user: unknown = JSON.parse(serializedUser);
    return isSessionUser(user) ? user : null;
  } catch {
    return null;
  }
}

export function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function readSession(): Session | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const serializedUser = localStorage.getItem(USER_KEY);
    const user = serializedUser === null ? null : parseUser(serializedUser);
    return token === null || user === null ? null : { token, user };
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    return;
  }
}
