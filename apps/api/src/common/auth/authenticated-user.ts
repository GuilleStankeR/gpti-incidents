import type { Role } from '@incidents/shared';

export interface AuthenticatedUser {
  readonly id: string;
  readonly role: Role;
  readonly condominiumId: string;
}
