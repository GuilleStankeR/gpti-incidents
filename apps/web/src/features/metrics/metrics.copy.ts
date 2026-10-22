export const metricsCopy = {
  title: 'Métricas',
  description: 'Indicadores de gestión de incidentes del condominio.',
  period: (from: string, to: string): string => `Período analizado: ${from} al ${to}`,
  defaultPeriodHint: 'Por defecto se muestran los últimos 90 días.',
  filters: {
    fromLabel: 'Desde',
    toLabel: 'Hasta',
    reset: 'Últimos 90 días',
  },
  cards: {
    total: {
      label: 'Incidentes del período',
      helper: 'Registrados en el sistema dentro del período.',
    },
    resolution: {
      label: 'Tiempo promedio de resolución',
      helper: 'Desde el registro hasta el cierre.',
    },
    withinSla: {
      label: 'Cerrados dentro de plazo',
      helper: 'Sobre el total de incidentes cerrados.',
    },
    evidence: {
      label: 'Con evidencia al cierre',
      helper: 'El sistema no permite cerrar sin fotografías.',
    },
  },
  hours: (value: string): string => `${value} h`,
  percentage: (value: string): string => `${value} %`,
  overdueNotice: (count: number): string =>
    count === 1
      ? 'Hay 1 incidente abierto con el plazo de atención vencido.'
      : `Hay ${String(count)} incidentes abiertos con el plazo de atención vencido.`,
  breakdowns: {
    byStatus: 'Incidentes por estado',
    byCategory: 'Incidentes por categoría',
    countLabel: (count: number): string =>
      count === 1 ? '1 incidente' : `${String(count)} incidentes`,
    empty: 'Sin incidentes en el período.',
  },
} as const;
