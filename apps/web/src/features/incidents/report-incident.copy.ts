export const reportIncidentCopy = {
  title: 'Reportar incidente',
  description:
    'Registra lo ocurrido con el mayor detalle posible. El folio y la fecha de registro los asigna el sistema.',
  back: 'Volver a la bandeja',
  sections: {
    what: {
      title: '¿Qué ocurrió?',
      description: 'Tipo de incidente y descripción de lo ocurrido.',
    },
    whereWhen: {
      title: '¿Dónde y cuándo?',
      description: 'Lugar dentro del condominio y momento del hecho.',
    },
    photos: {
      title: 'Evidencia fotográfica',
      description: 'Opcional al reportar. Un incidente no se puede cerrar sin fotografías.',
    },
  },
  fields: {
    category: 'Categoría',
    categoryPlaceholder: 'Selecciona una categoría',
    slaHint: (hours: number): string => `Plazo de atención comprometido: ${String(hours)} horas.`,
    description: 'Descripción',
    descriptionPlaceholder: 'Describe qué ocurrió, dónde exactamente y qué tan grave es.',
    descriptionHint: (minimum: number): string => `Mínimo ${String(minimum)} caracteres.`,
    location: 'Ubicación',
    locationPlaceholder: 'Selecciona una ubicación',
    occurredAt: 'Fecha y hora del hecho',
    occurredAtHint: (days: number): string =>
      `No puede ser futura ni de hace más de ${String(days)} días.`,
  },
  geolocation: {
    use: 'Usar mi ubicación',
    hint: 'Opcional. Permite ubicar el incidente en el mapa.',
    granted: 'Ubicación registrada',
    remove: 'Quitar ubicación',
    denied: 'No se otorgó permiso de ubicación. Puedes reportar igualmente.',
    unavailable: 'No fue posible obtener tu ubicación. Puedes reportar igualmente.',
    retry: 'Intentar de nuevo',
    coordinates: (latitude: string, longitude: string): string => `${latitude}, ${longitude}`,
  },
  photos: {
    label: 'Fotografías',
    counter: (count: number, maximum: number): string => `${String(count)} de ${String(maximum)}`,
    add: 'Agregar fotografías',
    requirements: (maximumMegabytes: string): string =>
      `JPEG, PNG o WebP · hasta ${maximumMegabytes} MB cada una`,
    previewAlt: (position: number): string => `Fotografía seleccionada ${String(position)}`,
    remove: (position: number): string => `Quitar fotografía ${String(position)}`,
    invalidType: 'Solo se aceptan fotografías JPEG, PNG o WebP.',
    tooLarge: (maximumMegabytes: string): string =>
      `Cada fotografía puede pesar como máximo ${maximumMegabytes} MB.`,
    tooMany: (maximum: number): string => `Puedes adjuntar hasta ${String(maximum)} fotografías.`,
  },
  errors: {
    categoryRequired: 'Selecciona una categoría.',
    descriptionLength: (minimum: number, maximum: number): string =>
      `La descripción debe tener entre ${String(minimum)} y ${String(maximum)} caracteres.`,
    locationRequired: 'Selecciona una ubicación.',
    occurredAtRequired: 'Indica la fecha y hora del hecho.',
    occurredAtFuture: 'La fecha del hecho no puede ser futura.',
    occurredAtTooOld: (days: number): string =>
      `La fecha del hecho no puede ser de hace más de ${String(days)} días.`,
    reviewFields: 'Revisa los campos marcados antes de continuar.',
  },
  submit: 'Reportar incidente',
  cancel: 'Cancelar',
  submitErrorTitle: 'No pudimos registrar el incidente',
} as const;
