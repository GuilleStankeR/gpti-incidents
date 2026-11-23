import { CategoryCode } from '../category-code.js';

export type ClassifiableCategoryCode = Exclude<CategoryCode, typeof CategoryCode.OTHER>;

export interface CategoryKeywords {
  readonly strong: readonly string[];
  readonly moderate: readonly string[];
}

export interface LocationHint {
  readonly categoryCode: ClassifiableCategoryCode;
  readonly weight: number;
}

export const CLASSIFIABLE_CATEGORY_CODES: readonly ClassifiableCategoryCode[] = [
  CategoryCode.SECURITY,
  CategoryCode.ELEVATOR,
  CategoryCode.WATER_LEAK,
  CategoryCode.ELECTRICAL,
  CategoryCode.COMMON_AREAS,
];

export const CATEGORY_KEYWORDS: Readonly<Record<ClassifiableCategoryCode, CategoryKeywords>> = {
  [CategoryCode.SECURITY]: {
    strong: [
      'rob',
      'hurt',
      'ladrón',
      'asalt',
      'intrus',
      'vandal',
      'sospechos',
      'amenaz',
      'agresi',
      'forzad',
      'forzaron',
      'delincuen',
    ],
    moderate: [
      'cámara',
      'alarma',
      'desconocid',
      'candado',
      'portón',
      'abiert',
      'no cierra',
      'pelea',
      'extrañ',
      'seguridad',
      'guardia',
    ],
  },
  [CategoryCode.ELEVATOR]: {
    strong: ['ascensor', 'elevador', 'atrapad', 'entre pisos', 'entre los pisos', 'montacarga'],
    moderate: [
      'cabina',
      'botonera',
      'fuera de servicio',
      'detien',
      'detenid',
      'foso',
      'vibración',
      'ruido metálico',
    ],
  },
  [CategoryCode.WATER_LEAK]: {
    strong: [
      'filtr',
      'gote',
      'inund',
      'humed',
      'fuga',
      'cañería',
      'tubería',
      'rebals',
      'desagüe',
      'sumidero',
      'escurr',
      'anegad',
    ],
    moderate: [
      'agua',
      'moj',
      'mancha',
      'llave',
      'lluvi',
      'lluev',
      'llov',
      'charco',
      'estanque',
      'calefón',
      'tapad',
      'obstru',
      'rieg',
    ],
  },
  [CategoryCode.ELECTRICAL]: {
    strong: [
      'eléctric',
      'enchufe',
      'cortocircuito',
      'tablero',
      'apagón',
      'chispa',
      'automático',
      'energía',
      'voltaje',
      'generador',
      'corte de luz',
      'cortó la luz',
      'sin luz',
      'olor a quemado',
    ],
    moderate: [
      'luz',
      'luces',
      'ampolleta',
      'foco',
      'luminaria',
      'iluminación',
      'interruptor',
      'cable',
      'quemad',
      'apag',
      'oscur',
    ],
  },
  [CategoryCode.COMMON_AREAS]: {
    strong: [
      'piscina',
      'quincho',
      'jardín',
      'baranda',
      'grafiti',
      'graffiti',
      'raya',
      'baldosa',
      'alfombra',
      'vidrio',
      'triz',
      'quebrad',
      'silla',
      'mobiliario',
      'gimnasio',
      'juegos infantiles',
      'contenedor',
    ],
    moderate: [
      'pasillo',
      'terraza',
      'hall',
      'muro',
      'pared',
      'pintura',
      'puerta',
      'reja',
      'mesa',
      'basura',
      'reciclaje',
      'tropiez',
      'levantad',
      'suelt',
      'golpe',
      'fachada',
      'escalera',
      'roto',
      'rota',
      'daño',
      'dañad',
    ],
  },
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
