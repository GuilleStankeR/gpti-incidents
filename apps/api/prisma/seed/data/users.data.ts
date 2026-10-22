import { Role } from '@incidents/shared';

export const DEMO_PASSWORD = 'demo1234';

export interface DemoUser {
  readonly name: string;
  readonly email: string;
  readonly role: Role;
}

export const DEMO_USERS: readonly DemoUser[] = [
  { name: 'Carla Jiménez', email: 'residente@paralelo29.cl', role: Role.RESIDENT },
  { name: 'Luis Meneses', email: 'conserje@paralelo29.cl', role: Role.CONCIERGE },
  { name: 'Patricia Rojas', email: 'admin@paralelo29.cl', role: Role.ADMIN },
  { name: 'Héctor Salas', email: 'conserje2@paralelo29.cl', role: Role.CONCIERGE },
  { name: 'Daniel Fuentes', email: 'residente2@paralelo29.cl', role: Role.RESIDENT },
];
