import { CategoryCode } from '../category-code.js';
import type {
  CategoryKeywords,
  ClassifiableCategoryCode,
  LocationHint,
} from './category-keywords.types.js';
import { COMMON_AREAS_KEYWORDS } from './keywords/common-areas-keywords.catalog.js';
import { ELECTRICAL_KEYWORDS } from './keywords/electrical-keywords.catalog.js';
import { ELEVATOR_KEYWORDS } from './keywords/elevator-keywords.catalog.js';
import { SECURITY_KEYWORDS } from './keywords/security-keywords.catalog.js';
import { WATER_LEAK_KEYWORDS } from './keywords/water-leak-keywords.catalog.js';

export const CLASSIFIABLE_CATEGORY_CODES: readonly ClassifiableCategoryCode[] = [
  CategoryCode.SECURITY,
  CategoryCode.ELEVATOR,
  CategoryCode.WATER_LEAK,
  CategoryCode.ELECTRICAL,
  CategoryCode.COMMON_AREAS,
];

export const CATEGORY_KEYWORDS: Readonly<Record<ClassifiableCategoryCode, CategoryKeywords>> = {
  [CategoryCode.SECURITY]: SECURITY_KEYWORDS,
  [CategoryCode.ELEVATOR]: ELEVATOR_KEYWORDS,
  [CategoryCode.WATER_LEAK]: WATER_LEAK_KEYWORDS,
  [CategoryCode.ELECTRICAL]: ELECTRICAL_KEYWORDS,
  [CategoryCode.COMMON_AREAS]: COMMON_AREAS_KEYWORDS,
};

export const LOCATION_HINTS: Readonly<Partial<Record<string, LocationHint>>> = {
  'Ascensor Torre A': { categoryCode: CategoryCode.ELEVATOR, weight: 2 },
  'Ascensor Torre B': { categoryCode: CategoryCode.ELEVATOR, weight: 2 },
  'Hall de acceso': { categoryCode: CategoryCode.COMMON_AREAS, weight: 1 },
  'Pasillo común': { categoryCode: CategoryCode.COMMON_AREAS, weight: 1 },
  Terraza: { categoryCode: CategoryCode.COMMON_AREAS, weight: 1 },
  'Sala multiuso': { categoryCode: CategoryCode.COMMON_AREAS, weight: 1 },
  'Sala de basura': { categoryCode: CategoryCode.COMMON_AREAS, weight: 1 },
  Fachada: { categoryCode: CategoryCode.COMMON_AREAS, weight: 1 },
};
