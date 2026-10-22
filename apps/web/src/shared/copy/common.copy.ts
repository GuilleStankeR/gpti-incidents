export const commonCopy = {
  appName: 'Gestión de Incidentes',
  states: {
    loading: 'Cargando…',
    errorTitle: 'No pudimos cargar la información',
    retry: 'Reintentar',
  },
  errors: {
    unexpected: 'Ocurrió un error inesperado. Intenta nuevamente.',
    network: 'No se pudo conectar con el servidor. Revisa tu conexión e intenta nuevamente.',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La dirección que buscas no existe o fue movida.',
    backHome: 'Volver al inicio',
  },
} as const;
