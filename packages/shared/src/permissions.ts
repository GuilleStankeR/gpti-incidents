import { IncidentStatus } from './incident-status.js';
import { Role } from './role.js';

export const Capability = {
  VIEW_ALL_INCIDENTS: 'VIEW_ALL_INCIDENTS',
  MANAGE_ASSIGNMENTS: 'MANAGE_ASSIGNMENTS',
  DOWNLOAD_CASE_FILE: 'DOWNLOAD_CASE_FILE',
  VIEW_METRICS: 'VIEW_METRICS',
} as const;

export type Capability = (typeof Capability)[keyof typeof Capability];

export const ROLE_CAPABILITIES: Readonly<Record<Role, readonly Capability[]>> = {
  [Role.RESIDENT]: [],
  [Role.CONCIERGE]: [Capability.VIEW_ALL_INCIDENTS, Capability.DOWNLOAD_CASE_FILE],
  [Role.ADMIN]: [
    Capability.VIEW_ALL_INCIDENTS,
    Capability.MANAGE_ASSIGNMENTS,
    Capability.DOWNLOAD_CASE_FILE,
    Capability.VIEW_METRICS,
  ],
};

export const TRANSITION_ROLES: Readonly<Record<IncidentStatus, readonly Role[]>> = {
  [IncidentStatus.REPORTED]: [],
  [IncidentStatus.UNDER_REVIEW]: [Role.CONCIERGE, Role.ADMIN],
  [IncidentStatus.REJECTED]: [Role.ADMIN],
  [IncidentStatus.ASSIGNED]: [Role.ADMIN],
  [IncidentStatus.IN_PROGRESS]: [Role.CONCIERGE, Role.ADMIN],
  [IncidentStatus.CLOSED]: [Role.CONCIERGE, Role.ADMIN],
};

export function hasCapability(role: Role, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability);
}

export function getRolesWithCapability(capability: Capability): readonly Role[] {
  return Object.values(Role).filter((role) => hasCapability(role, capability));
}

export function canRoleTransitionTo(role: Role, target: IncidentStatus): boolean {
  return TRANSITION_ROLES[target].includes(role);
}
