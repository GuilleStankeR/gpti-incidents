export const CategoryCode = {
  SECURITY: 'SECURITY',
  ELEVATOR: 'ELEVATOR',
  WATER_LEAK: 'WATER_LEAK',
  ELECTRICAL: 'ELECTRICAL',
  COMMON_AREAS: 'COMMON_AREAS',
  OTHER: 'OTHER',
} as const;

export type CategoryCode = (typeof CategoryCode)[keyof typeof CategoryCode];
