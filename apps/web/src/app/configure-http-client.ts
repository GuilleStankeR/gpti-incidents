import { notifySessionExpired } from '@/features/auth/session-events';
import { readStoredToken } from '@/features/auth/session-storage';
import { configureHttpClient } from '@/shared/api/http-client';

export function setUpHttpClient(): void {
  configureHttpClient({ getToken: readStoredToken, onUnauthenticated: notifySessionExpired });
}
