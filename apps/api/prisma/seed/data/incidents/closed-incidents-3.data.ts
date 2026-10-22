import { DEMO_EMAILS } from '../demo-emails.data';
import type { SeedIncident } from './seed-incident.types';

export const CLOSED_INCIDENTS_THIRD_BATCH: readonly SeedIncident[] = [
  {
    categoryCode: 'SECURITY',
    location: 'Hall de acceso',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { days: 49, hours: 20 },
    occurredHoursBeforeReport: 1,
    description:
      'La puerta de acceso peatonal no cierra completamente y queda abierta tras el paso de cada persona. El brazo hidráulico perdió fuerza.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.secondConcierge,
      resolutionHours: 10,
      resolution:
        'Se reemplazó el brazo hidráulico de la puerta y se verificó el cierre del electroimán.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'ELECTRICAL',
    location: 'Estacionamiento -2',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { days: 45, hours: 8 },
    occurredHoursBeforeReport: 2,
    description:
      'Corte de energía en los enchufes del estacionamiento -2. Las bombas de achique quedaron sin alimentación.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.admin,
      resolutionHours: 55,
      resolution:
        'El electricista reemplazó el diferencial del circuito de fuerza. Hubo que esperar la llegada del repuesto.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Pasillo común',
    reporterEmail: DEMO_EMAILS.secondResident,
    reportedAgo: { days: 41, hours: 12 },
    occurredHoursBeforeReport: 12,
    description:
      'La alfombra del pasillo del piso 9 está levantada frente a los ascensores y ya ha provocado tropiezos.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 36,
      resolution: 'Se pegó y fijó la alfombra con un perfil metálico en la zona de tránsito.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Terraza',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { days: 37, hours: 4 },
    occurredHoursBeforeReport: 3,
    description:
      'Filtración desde la terraza del piso 12 hacia el departamento 1203 después de la lluvia. El sumidero estaba obstruido con hojas.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.secondConcierge,
      resolutionHours: 22,
      resolution:
        'Se limpió el sumidero y se revisó la pendiente del piso. El sumidero se agregó a la mantención mensual.',
      photosBeforeClosure: 1,
    },
  },
  {
    categoryCode: 'ELEVATOR',
    location: 'Ascensor Torre A',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { days: 33, hours: 16 },
    occurredHoursBeforeReport: 1,
    description:
      'Ruido metálico fuerte al llegar al piso 1 en el ascensor de la Torre A. Los vecinos reportan vibración en la cabina.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.admin,
      resolutionHours: 20,
      resolution:
        'La empresa de mantención lubricó las guías y reemplazó una zapata desgastada. Se recibió informe técnico.',
      photosBeforeClosure: 0,
    },
  },
];
