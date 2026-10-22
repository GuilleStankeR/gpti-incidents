import { IncidentStatus } from '@incidents/shared';

import { DEMO_EMAILS } from '../demo-emails.data';
import type { SeedIncident } from './seed-incident.types';

export const OPEN_INCIDENTS: readonly SeedIncident[] = [
  {
    categoryCode: 'WATER_LEAK',
    location: 'Ascensor Torre B',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { hours: 6 },
    occurredHoursBeforeReport: 8,
    description:
      'Se observa agua en el foso del ascensor de la Torre B después de la lluvia de anoche.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: { kind: 'open', status: IncidentStatus.REPORTED },
  },
  {
    categoryCode: 'OTHER',
    location: 'Otro',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { days: 2, hours: 2 },
    occurredHoursBeforeReport: 24,
    description:
      'El citófono del departamento 1105 no recibe llamadas desde conserjería desde hace dos días.',
    photosAtReport: 0,
    hasCoordinates: false,
    outcome: { kind: 'open', status: IncidentStatus.REPORTED },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Sala de basura',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { hours: 20 },
    occurredHoursBeforeReport: 3,
    description:
      'El contenedor de reciclaje de la sala de basura tiene la tapa quebrada y los animales del sector rompen las bolsas.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: { kind: 'open', status: IncidentStatus.UNDER_REVIEW },
  },
  {
    categoryCode: 'ELECTRICAL',
    location: 'Pasillo común',
    reporterEmail: DEMO_EMAILS.secondResident,
    reportedAgo: { hours: 30 },
    occurredHoursBeforeReport: 1,
    description:
      'El enchufe del pasillo del piso 6 echa chispas al conectar la aspiradora del personal de aseo.',
    photosAtReport: 0,
    hasCoordinates: false,
    outcome: { kind: 'open', status: IncidentStatus.UNDER_REVIEW },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Fachada',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { days: 2, hours: 22 },
    occurredHoursBeforeReport: 5,
    description:
      'Filtración por la ventana de la escalera de emergencia del piso 10 cuando llueve con viento.',
    photosAtReport: 1,
    hasCoordinates: true,
    outcome: {
      kind: 'open',
      status: IncidentStatus.ASSIGNED,
      assigneeEmail: DEMO_EMAILS.concierge,
    },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Terraza',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { hours: 10 },
    occurredHoursBeforeReport: 2,
    description: 'La reja de la piscina en la terraza no cierra y queda abierta sin supervisión.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'open',
      status: IncidentStatus.ASSIGNED,
      assigneeEmail: DEMO_EMAILS.secondConcierge,
    },
  },
  {
    categoryCode: 'ELEVATOR',
    location: 'Ascensor Torre A',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { hours: 31 },
    occurredHoursBeforeReport: 1,
    description:
      'El ascensor de la Torre A quedó fuera de servicio con un mensaje de falla en el panel de control.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: { kind: 'open', status: IncidentStatus.IN_PROGRESS, assigneeEmail: DEMO_EMAILS.admin },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Estacionamiento -1',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { hours: 12 },
    occurredHoursBeforeReport: 2,
    description:
      'Fuga en la llave de paso del estacionamiento -1, junto al medidor general. Gotea de forma constante.',
    photosAtReport: 1,
    hasCoordinates: true,
    outcome: {
      kind: 'open',
      status: IncidentStatus.IN_PROGRESS,
      assigneeEmail: DEMO_EMAILS.secondConcierge,
    },
  },
  {
    categoryCode: 'SECURITY',
    location: 'Hall de acceso',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { hours: 8 },
    occurredHoursBeforeReport: 1,
    description:
      'El portón vehicular quedó abierto tras una falla del control remoto. Un conserje controla el acceso mientras se repara.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'open',
      status: IncidentStatus.IN_PROGRESS,
      assigneeEmail: DEMO_EMAILS.concierge,
    },
  },
];
