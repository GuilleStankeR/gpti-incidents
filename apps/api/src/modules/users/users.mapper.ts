import type { User } from '@prisma/client';

import type { UserSummary, UserWithRole } from '@incidents/shared';

export function toUserSummary(user: Pick<User, 'id' | 'name'>): UserSummary {
  return { id: user.id, name: user.name };
}

export function toUserWithRole(user: Pick<User, 'id' | 'name' | 'role'>): UserWithRole {
  return { id: user.id, name: user.name, role: user.role };
}
