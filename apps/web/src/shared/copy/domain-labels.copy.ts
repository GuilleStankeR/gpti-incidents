import type { IncidentStatus, Role, SlaStatus } from '@incidents/shared';

export const roleLabels: Readonly<Record<Role, string>> = {
  RESIDENT: 'Residente',
  CONCIERGE: 'Conserje',
  ADMIN: 'Administrador',
};

export const statusLabels: Readonly<Record<IncidentStatus, string>> = {
  REPORTED: 'Ingresado',
  UNDER_REVIEW: 'En revisión',
  REJECTED: 'Rechazado',
  ASSIGNED: 'Asignado',
  IN_PROGRESS: 'En ejecución',
  CLOSED: 'Cerrado',
};

export const slaLabels: Readonly<Record<SlaStatus, string>> = {
  ON_TRACK: 'En plazo',
  AT_RISK: 'Por vencer',
  OVERDUE: 'Vencido',
};
