export const Role = {
  RESIDENT: 'RESIDENT',
  CONCIERGE: 'CONCIERGE',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLES: readonly Role[] = Object.values(Role);

export const ASSIGNABLE_ROLES: readonly Role[] = [Role.CONCIERGE, Role.ADMIN];

export function isAssignableRole(role: Role): boolean {
  return ASSIGNABLE_ROLES.includes(role);
}
