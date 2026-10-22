import type { IncidentStatus, Role } from '@incidents/shared';

export const caseFilesCopy = {
  fileName: (folio: string): string => `expediente-${folio}.pdf`,
  documentTitle: 'EXPEDIENTE DE INCIDENTE',
  documentAuthor: 'Sistema de Gestión y Reporte de Incidentes',
  sections: {
    identification: '1. Identificación del incidente',
    parties: '2. Partes',
    description: '3. Descripción',
    evidence: '4. Evidencia fotográfica',
    auditTrail: '5. Bitácora de trazabilidad',
  },
  fields: {
    category: 'Categoría',
    location: 'Ubicación en el condominio',
    status: 'Estado actual',
    occurredAt: 'Fecha del hecho (declarada)',
    reportedAt: 'Fecha de registro en el sistema (asignada automáticamente)',
    dueAt: 'Plazo de atención comprometido',
    closedAt: 'Fecha de cierre',
    coordinates: 'Coordenadas geográficas',
    geocodedAddress: 'Dirección geocodificada',
    reporter: 'Reportante',
    assignee: 'Responsable asignado',
  },
  values: {
    notAssigned: 'Sin responsable asignado',
    noEvidence: 'El incidente no registra evidencia fotográfica.',
    imageUnavailable: 'Vista previa de la imagen no disponible.',
    initialStatus: 'Registro inicial',
    dueAtWithSla: (dueAt: string, slaHours: number): string =>
      `${dueAt} (SLA de ${String(slaHours)} horas)`,
    coordinates: (latitude: string, longitude: string): string => `${latitude}, ${longitude}`,
    personWithRole: (name: string, role: string): string => `${name} (${role})`,
    fileSizeInKilobytes: (kilobytes: string): string => `${kilobytes} KB`,
  },
  evidenceDetails: {
    originalName: (name: string): string => `Archivo original: ${name}`,
    uploadedAt: (date: string): string => `Fecha y hora de carga: ${date}`,
    uploadedBy: (name: string): string => `Cargado por: ${name}`,
    size: (size: string): string => `Tamaño: ${size}`,
    sha256: (hash: string): string => `SHA-256: ${hash}`,
  },
  auditEntryHeading: (date: string, name: string, role: string): string =>
    `[${date}] — ${name} (${role})`,
  footer: {
    issued: (issuedAt: string, issuer: string, folio: string): string =>
      `Expediente emitido el ${issuedAt} por ${issuer} · ${folio}`,
    page: (pageNumber: number, pageCount: number): string =>
      `Página ${String(pageNumber)} de ${String(pageCount)}`,
    legend:
      'Documento generado automáticamente por el Sistema de Gestión y Reporte de Incidentes. El hash SHA-256 de cada archivo permite verificar que la evidencia aquí incorporada no ha sido alterada desde su registro.',
  },
  statusLabels: {
    REPORTED: 'Ingresado',
    UNDER_REVIEW: 'En revisión',
    REJECTED: 'Rechazado',
    ASSIGNED: 'Asignado',
    IN_PROGRESS: 'En ejecución',
    CLOSED: 'Cerrado',
  } satisfies Readonly<Record<IncidentStatus, string>>,
  roleLabels: {
    RESIDENT: 'Residente',
    CONCIERGE: 'Conserje',
    ADMIN: 'Administrador',
  } satisfies Readonly<Record<Role, string>>,
} as const;
