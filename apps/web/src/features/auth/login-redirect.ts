import { ROUTE_PATHS } from '@/shared/routing/route-paths';

export interface LoginRedirectState {
  readonly from: string;
}

function isLoginRedirectState(value: unknown): value is LoginRedirectState {
  return (
    typeof value === 'object' && value !== null && 'from' in value && typeof value.from === 'string'
  );
}

function isSafeInternalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith(ROUTE_PATHS.login);
}

export function resolveLoginRedirect(state: unknown): string {
  if (isLoginRedirectState(state) && isSafeInternalPath(state.from)) {
    return state.from;
  }

  return ROUTE_PATHS.incidents;
}
