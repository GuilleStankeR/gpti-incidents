import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH } from '@incidents/shared';

export const validationMessages = {
  emailInvalid: 'Ingresa un correo electrónico válido.',
  passwordRequired: 'Ingresa tu contraseña.',
  categoryInvalid: 'Selecciona una categoría válida.',
  descriptionLength: `La descripción debe tener entre ${String(DESCRIPTION_MIN_LENGTH)} y ${String(DESCRIPTION_MAX_LENGTH)} caracteres.`,
  locationInvalid: 'Selecciona una ubicación de la lista.',
  occurredAtInvalid: 'Indica una fecha y hora del hecho válida.',
  coordinatesInvalid: 'Las coordenadas de ubicación no son válidas.',
} as const;
