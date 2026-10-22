import { DEMO_EMAILS } from '../demo-emails.data';
import type { SeedIncident } from './seed-incident.types';

export const REJECTED_INCIDENTS: readonly SeedIncident[] = [
  {
    categoryCode: 'OTHER',
    location: 'Otro',
    reporterEmail: DEMO_EMAILS.secondResident,
    reportedAgo: { days: 58, hours: 10 },
    occurredHoursBeforeReport: 30,
    description: 'Ruidos molestos desde el departamento 802 durante la madrugada del sábado.',
    photosAtReport: 0,
    hasCoordinates: false,
    outcome: {
      kind: 'rejected',
      decidedAfterHours: 20,
      reason:
        'Se rechaza: corresponde a un tema de convivencia que se gestiona según el reglamento de copropiedad, no a un incidente de seguridad o mantención.',
    },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Pasillo común',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { days: 40, hours: 18 },
    occurredHoursBeforeReport: 20,
    description:
      'La alfombra del pasillo del piso 9 sigue levantada frente a los ascensores y alguien podría caerse.',
    photosAtReport: 0,
    hasCoordinates: false,
    outcome: {
      kind: 'rejected',
      decidedAfterHours: 6,
      reason:
        'Se rechaza por duplicado: el mismo daño fue reportado el día anterior y ya está en atención.',
    },
  },
];
