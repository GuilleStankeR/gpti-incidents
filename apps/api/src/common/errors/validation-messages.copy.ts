import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  MAX_PAGE_SIZE,
  NOTE_MAX_LENGTH,
  NOTE_MIN_LENGTH,
  SEARCH_MAX_LENGTH,
} from '@incidents/shared';

export const validationMessages = {
  emailInvalid: 'Ingresa un correo electrónico válido.',
  passwordRequired: 'Ingresa tu contraseña.',
  categoryInvalid: 'Selecciona una categoría válida.',
  descriptionLength: `La descripción debe tener entre ${String(DESCRIPTION_MIN_LENGTH)} y ${String(DESCRIPTION_MAX_LENGTH)} caracteres.`,
  locationInvalid: 'Selecciona una ubicación de la lista.',
  occurredAtInvalid: 'Indica una fecha y hora del hecho válida.',
  coordinatesInvalid: 'Las coordenadas de ubicación no son válidas.',
  statusInvalid: 'Selecciona un estado válido.',
  assigneeInvalid: 'Selecciona un responsable válido.',
  noteLength: `La observación debe tener entre ${String(NOTE_MIN_LENGTH)} y ${String(NOTE_MAX_LENGTH)} caracteres.`,
  dateInvalid: 'Indica fechas válidas en formato AAAA-MM-DD.',
  searchTooLong: `La búsqueda no puede superar los ${String(SEARCH_MAX_LENGTH)} caracteres.`,
  paginationInvalid: `La paginación indicada no es válida (máximo ${String(MAX_PAGE_SIZE)} por página).`,
} as const;
