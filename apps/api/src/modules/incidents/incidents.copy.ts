export const incidentsCopy = {
  auditNotes: {
    reported: 'Incidente reportado',
    evidenceAttached: (count: number): string =>
      count === 1 ? 'Se adjuntó 1 evidencia' : `Se adjuntaron ${String(count)} evidencias`,
  },
} as const;
