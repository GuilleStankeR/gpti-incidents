import type { AuditEntry, User } from '@prisma/client';

import type { AuditEntryItem } from '@incidents/shared';

import { toUserWithRole } from '@/modules/users/users.mapper';

export type AuditEntryWithUser = AuditEntry & { readonly user: User };

export function toAuditEntryItem(entry: AuditEntryWithUser): AuditEntryItem {
  return {
    id: entry.id,
    fromStatus: entry.fromStatus,
    toStatus: entry.toStatus,
    note: entry.note,
    createdAt: entry.createdAt.toISOString(),
    user: toUserWithRole(entry.user),
  };
}
