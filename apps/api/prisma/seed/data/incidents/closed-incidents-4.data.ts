import { DEMO_EMAILS } from '../demo-emails.data';
import type { SeedIncident } from './seed-incident.types';

export const CLOSED_INCIDENTS_FOURTH_BATCH: readonly SeedIncident[] = [
  {
    categoryCode: 'SECURITY',
    location: 'Estacionamiento -2',
    reporterEmail: DEMO_EMAILS.secondResident,
    reportedAgo: { days: 29, hours: 9 },
    occurredHoursBeforeReport: 7,
    description:
      'Bicicleta robada desde el bicicletero del estacionamiento -2. El candado fue cortado durante la noche.',
    photosAtReport: 1,
    hasCoordinates: true,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 16,
      resolution:
        'Se revisaron las grabaciones, se entregó respaldo al residente y se reforzó el bicicletero con anclajes nuevos.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Hall de acceso',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { days: 24, hours: 14 },
    occurredHoursBeforeReport: 1,
    description:
      'Vidrio trizado en la puerta principal del hall de acceso, aparentemente por el golpe de un carro de supermercado.',
    photosAtReport: 1,
    hasCoordinates: true,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.secondConcierge,
      resolutionHours: 48,
      resolution: 'Se reemplazó el vidrio por uno laminado de seguridad.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Pasillo común',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { days: 18, hours: 3 },
    occurredHoursBeforeReport: 2,
    description:
      'Agua escurriendo desde el cielo del pasillo del piso 3, frente al departamento 304. Hay riesgo de cortocircuito con la luminaria.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 60,
      resolution:
        'Se reparó la descarga del departamento superior con el gasfíter del propietario. La coordinación con el propietario retrasó la solución.',
      photosBeforeClosure: 1,
    },
  },
  {
    categoryCode: 'ELECTRICAL',
    location: 'Sala multiuso',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { days: 12, hours: 6 },
    occurredHoursBeforeReport: 1,
    description:
      'El aire acondicionado de la sala multiuso hace saltar el automático cada vez que se enciende.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.admin,
      resolutionHours: 30,
      resolution: 'El técnico detectó un condensador defectuoso y lo reemplazó. Equipo operativo.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Estacionamiento -2',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { days: 6, hours: 2 },
    occurredHoursBeforeReport: 4,
    description:
      'Nueva filtración en el estacionamiento -2, en el sector de bodegas. Hay agua acumulada frente a las bodegas 15 a 18.',
    photosAtReport: 2,
    hasCoordinates: true,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.secondConcierge,
      resolutionHours: 28,
      resolution: 'Se selló la junta de dilatación del sector y se instaló una canaleta de desvío.',
      photosBeforeClosure: 0,
    },
  },
];
