export const incidentDetailCopy = {
  createdNotice: {
    title: (folio: string): string => `Incidente registrado con el folio ${folio}`,
    description:
      'Guarda este folio para hacer seguimiento. La fecha de registro quedó asignada por el sistema.',
  },
  back: 'Volver a la bandeja',
} as const;
