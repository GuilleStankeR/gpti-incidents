import { DEMO_EMAILS } from '../demo-emails.data';
import type { SeedIncident } from './seed-incident.types';

export const CLOSED_INCIDENTS_FIRST_BATCH: readonly SeedIncident[] = [
  {
    categoryCode: 'WATER_LEAK',
    location: 'Estacionamiento -2',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { days: 86, hours: 4 },
    occurredHoursBeforeReport: 2,
    description:
      'Filtración en el cielo del estacionamiento -2, bajo la jardinera del patio central. El agua cae sobre dos estacionamientos y hay mancha de humedad de aproximadamente un metro.',
    photosAtReport: 2,
    hasCoordinates: true,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 30,
      resolution:
        'Se impermeabilizó el sello de la jardinera y se secó el cielo afectado. Sin goteo tras 24 horas de observación.',
      photosBeforeClosure: 1,
    },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Sala multiuso',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { days: 83, hours: 9 },
    occurredHoursBeforeReport: 10,
    description:
      'Dos sillas de la sala multiuso tienen las patas quebradas y la mesa principal quedó inestable después del evento del fin de semana.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.secondConcierge,
      resolutionHours: 50,
      resolution:
        'Se retiraron las sillas dañadas, se repusieron dos desde bodega y se ajustó la estructura de la mesa.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'ELEVATOR',
    location: 'Ascensor Torre A',
    reporterEmail: DEMO_EMAILS.secondResident,
    reportedAgo: { days: 80, hours: 2 },
    occurredHoursBeforeReport: 1,
    description:
      'El ascensor de la Torre A se detiene entre los pisos 7 y 8 y las puertas tardan en abrir. Varios vecinos reportan el mismo problema.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.admin,
      resolutionHours: 18,
      resolution:
        'La empresa de mantención ajustó el sensor de nivelación y los operadores de puerta. Ascensor operativo.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'WATER_LEAK',
    location: 'Pasillo común',
    reporterEmail: DEMO_EMAILS.secondConcierge,
    reportedAgo: { days: 77, hours: 6 },
    occurredHoursBeforeReport: 5,
    description:
      'Mancha de humedad en el muro del pasillo del piso 5, junto al shaft de aguas. La pintura está soplada y el muro se siente húmedo al tacto.',
    photosAtReport: 1,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.concierge,
      resolutionHours: 40,
      resolution:
        'Se detectó una unión suelta en la matriz de agua fría y se reemplazó. Se programó el repintado del muro.',
      photosBeforeClosure: 1,
    },
  },
  {
    categoryCode: 'SECURITY',
    location: 'Estacionamiento -1',
    reporterEmail: DEMO_EMAILS.resident,
    reportedAgo: { days: 74, hours: 13 },
    occurredHoursBeforeReport: 8,
    description:
      'Robo del espejo lateral de un vehículo estacionado en el estacionamiento -1, sector norte. La cámara de ese sector no muestra imagen.',
    photosAtReport: 1,
    hasCoordinates: true,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.admin,
      resolutionHours: 20,
      resolution:
        'Se revisó la grabación disponible y se reparó la cámara del sector norte. Se entregó copia del registro a la residente para la denuncia.',
      photosBeforeClosure: 0,
    },
  },
  {
    categoryCode: 'COMMON_AREAS',
    location: 'Terraza',
    reporterEmail: DEMO_EMAILS.concierge,
    reportedAgo: { days: 70, hours: 3 },
    occurredHoursBeforeReport: 3,
    description:
      'Baldosas sueltas en la terraza del piso 12, cerca de la baranda. Representan riesgo de caída para quienes usan el quincho.',
    photosAtReport: 2,
    hasCoordinates: false,
    outcome: {
      kind: 'closed',
      assigneeEmail: DEMO_EMAILS.secondConcierge,
      resolutionHours: 96,
      resolution:
        'Se repusieron y fijaron las baldosas sueltas. El trabajo se retrasó por disponibilidad del maestro.',
      photosBeforeClosure: 0,
    },
  },
];
