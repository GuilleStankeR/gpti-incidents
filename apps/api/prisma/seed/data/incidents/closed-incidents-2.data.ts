import { DEMO_EMAILS } from '../demo-emails.data';
import type { SeedIncident } from './seed-incident.types';

export const CLOSED_INCIDENTS_SECOND_BATCH: readonly SeedIncident[] = [
  {
    categoryCode: 'ELECTRICAL',
    location: 'Hall de acceso',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { days: 67, hours: 22 },
    occurredHoursBeforeReport: 4,
    description:
      'Las luminarias del hall de acceso se apagan de forma intermitente durante la noche. El sector queda a oscuras por varios minutos.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 26,
      resolution:
        'Se reemplazó el sensor crepuscular y un relé defectuoso del tablero de iluminación común.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Sala de basura',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { days: 64, hours: 7 },
    occurredHoursBeforeReport: 1,
    description:
      'Rebalse en la sala de basura del primer piso por un desagüe tapado. Hay agua acumulada y mal olor en el sector.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.secondConcierge,
      resolutionHours: 12,
      resolution: 'Se destapó el desagüe con equipo de alta presión y se sanitizó la sala.',
      photosBeforeClosure: 1,
    },
  },
  {
    categoryCode: 'ELEVATOR',
    location: 'Ascensor Torre B',
    reporterEmail: DEMO_EMAILS.secondResident,
    reportedAgo: { days: 60, hours: 11 },
    occurredHoursBeforeReport: 2,
    description:
      'El ascensor de la Torre B no responde a los llamados desde el piso 3. El botón se enciende, pero el ascensor no se detiene.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.admin,
      resolutionHours: 30,
      resolution:
        'La empresa de mantención reemplazó la botonera del piso 3. La visita técnica se concretó al día siguiente.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Fachada',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { days: 56, hours: 5 },
    occurredHoursBeforeReport: 9,
    description:
      'Grafiti en la fachada del acceso vehicular, sobre el muro de la calle lateral. Cubre aproximadamente dos metros.',
    photosAtReport: 1,
    hasCoordinates: true,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 60,
      resolution: 'Se limpió el grafiti con hidrolavadora y se repintó el sector afectado.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Estacionamiento -1',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { days: 52, hours: 15 },
    occurredHoursBeforeReport: 6,
    description:
      'Gotera sobre el estacionamiento 34 del nivel -1. Cae agua con barro sobre el vehículo cada vez que se riega el jardín.',
    photosAtReport: 2,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 44,
      resolution:
        'Se selló la grieta de la losa bajo el jardín con membrana líquida y se ajustó el horario de riego.',
      photosBeforeClosure: 0,
    },
  },
];
