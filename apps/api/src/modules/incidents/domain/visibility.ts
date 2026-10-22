import { Capability, hasCapability } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';

export interface VisibilityScope {
  readonly condominiumId: string;
  readonly reporterId?: string;
}

export function buildVisibilityScope(user: AuthenticatedUser): VisibilityScope {
  if (hasCapability(user.role, Capability.VIEW_ALL_INCIDENTS)) {
    return { condominiumId: user.condominiumId };
  }

  return { condominiumId: user.condominiumId, reporterId: user.id };
}
