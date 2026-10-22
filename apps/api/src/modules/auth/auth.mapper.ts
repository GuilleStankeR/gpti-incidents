import type { LoginResponse } from '@incidents/shared';

import type { AuthenticatedSession } from './auth.service';

export function toLoginResponse({ token, user }: AuthenticatedSession): LoginResponse {
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      condominium: {
        id: user.condominium.id,
        code: user.condominium.code,
        name: user.condominium.name,
      },
    },
  };
}
