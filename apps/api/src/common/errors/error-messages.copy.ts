import { ErrorCode, OCCURRED_AT_MAX_AGE_DAYS } from '@incidents/shared';

export const ERROR_MESSAGES: Readonly<Record<ErrorCode, string>> = {
  [ErrorCode.INVALID_CREDENTIALS]: 'El correo o la contraseña no son correctos.',
  [ErrorCode.UNAUTHENTICATED]: 'Tu sesión no es válida o expiró. Inicia sesión nuevamente.',
  [ErrorCode.FORBIDDEN_ROLE]: 'Tu perfil no tiene permiso para realizar esta acción.',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'El recurso solicitado no existe.',
  [ErrorCode.INVALID_TRANSITION]:
    'El incidente no puede pasar a ese estado desde su estado actual.',
  [ErrorCode.CLOSURE_WITHOUT_EVIDENCE]:
    'No se puede cerrar un incidente sin evidencia fotográfica adjunta.',
  [ErrorCode.INVALID_REASSIGNMENT]:
    'Solo se puede reasignar el responsable de un incidente asignado o en ejecución.',
  [ErrorCode.EVIDENCE_NOT_ALLOWED]:
    'No se puede adjuntar evidencia a un incidente cerrado o rechazado.',
  [ErrorCode.ASSIGNEE_REQUIRED]: 'Debes indicar un responsable para asignar el incidente.',
  [ErrorCode.INVALID_ASSIGNEE]:
    'El responsable debe ser un conserje o un administrador del condominio.',
  [ErrorCode.INVALID_OCCURRED_AT]: `La fecha del hecho no puede ser futura ni tener más de ${String(OCCURRED_AT_MAX_AGE_DAYS)} días de antigüedad.`,
  [ErrorCode.INVALID_FILE]:
    'Las fotografías deben ser JPEG, PNG o WebP y no superar el tamaño ni la cantidad máxima permitida.',
  [ErrorCode.VALIDATION_FAILED]: 'Los datos enviados no son válidos.',
  [ErrorCode.INTERNAL_ERROR]: 'Ocurrió un error inesperado. Intenta nuevamente.',
};
