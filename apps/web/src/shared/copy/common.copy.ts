export const commonCopy = {
  appName: 'Gestión de Incidentes',
  appTagline: 'Seguridad y mantenimiento',
  states: {
    loading: 'Cargando…',
    errorTitle: 'No pudimos cargar la información',
    retry: 'Reintentar',
  },
  errors: {
    unexpected: 'Ocurrió un error inesperado. Intenta nuevamente.',
    network: 'No se pudo conectar con el servidor. Revisa tu conexión e intenta nuevamente.',
  },
  navigation: {
    label: 'Navegación principal',
    inbox: 'Bandeja',
    report: 'Reportar',
    metrics: 'Métricas',
  },
  session: {
    logout: 'Cerrar sesión',
  },
  actions: {
    cancel: 'Cancelar',
    close: 'Cerrar',
  },
  pagination: {
    label: 'Paginación',
    previous: 'Anterior',
    next: 'Siguiente',
    pageOf: (page: number, pageCount: number): string => `${String(page)} de ${String(pageCount)}`,
    summary: (first: number, last: number, total: number): string =>
      `Mostrando ${String(first)}–${String(last)} de ${String(total)}`,
  },
  duration: {
    hours: (value: string): string => `${value} h`,
    days: (value: string): string => `${value} d`,
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La dirección que buscas no existe o fue movida.',
    backHome: 'Volver al inicio',
  },
  emptyValue: '—',
  characterCount: (count: number, max: number): string => `${String(count)}/${String(max)}`,
  fileSize: (value: string, unit: string): string => `${value} ${unit}`,
} as const;
