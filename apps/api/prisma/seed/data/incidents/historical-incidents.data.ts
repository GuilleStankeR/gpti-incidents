import { CLOSED_INCIDENTS_FIRST_BATCH } from './closed-incidents-1.data';
import { CLOSED_INCIDENTS_SECOND_BATCH } from './closed-incidents-2.data';
import { CLOSED_INCIDENTS_THIRD_BATCH } from './closed-incidents-3.data';
import { CLOSED_INCIDENTS_FOURTH_BATCH } from './closed-incidents-4.data';
import { OPEN_INCIDENTS } from './open-incidents.data';
import { REJECTED_INCIDENTS } from './rejected-incidents.data';
import type { SeedIncident } from './seed-incident.types';

export const HISTORICAL_INCIDENTS: readonly SeedIncident[] = [
  ...CLOSED_INCIDENTS_FIRST_BATCH,
  ...CLOSED_INCIDENTS_SECOND_BATCH,
  ...CLOSED_INCIDENTS_THIRD_BATCH,
  ...CLOSED_INCIDENTS_FOURTH_BATCH,
  ...REJECTED_INCIDENTS,
  ...OPEN_INCIDENTS,
];
