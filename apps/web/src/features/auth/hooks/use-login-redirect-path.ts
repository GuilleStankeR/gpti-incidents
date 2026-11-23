import { useLocation } from 'react-router-dom';

import { resolveLoginRedirect } from '@/features/auth/login-redirect';

export function useLoginRedirectPath(): string {
  const location = useLocation();
  return resolveLoginRedirect(location.state);
}
