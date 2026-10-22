import type { CatalogCategory } from '@incidents/shared';

export const CATEGORIES: readonly CatalogCategory[] = [
  { code: 'SECURITY', name: 'Robo o incidente de seguridad', slaHours: 24 },
  { code: 'ELEVATOR', name: 'Falla de ascensor', slaHours: 24 },
  { code: 'WATER_LEAK', name: 'Filtración o daño por agua', slaHours: 48 },
  { code: 'ELECTRICAL', name: 'Falla eléctrica', slaHours: 48 },
  { code: 'COMMON_AREAS', name: 'Daño en áreas comunes', slaHours: 72 },
  { code: 'OTHER', name: 'Otro', slaHours: 72 },
];
