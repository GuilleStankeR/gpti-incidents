import type { Role } from '../role.js';

export interface UserSummary {
  readonly id: string;
  readonly name: string;
}

export interface UserWithRole extends UserSummary {
  readonly role: Role;
}
