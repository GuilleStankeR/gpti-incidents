export const REVIEW_NOTES: readonly string[] = [
  'Conserjería revisa el incidente en terreno y confirma el reporte.',
  'Se verifica el daño en el lugar y se registra su estado actual.',
  'Se revisa el reporte con el residente y se fotografía el sector.',
];

export const START_NOTES: readonly string[] = [
  'Se coordina con el proveedor y se inicia la atención.',
  'Comienzan los trabajos de reparación en el sector afectado.',
  'Se inicia la atención y se informa a los residentes afectados.',
];

export function assignmentNote(assigneeName: string): string {
  return `Se asigna a ${assigneeName} para coordinar la atención.`;
}

export function evidenceImageLabel(position: number, total: number): string {
  return `Evidencia ${String(position)} de ${String(total)}`;
}

export function evidenceFileName(folio: string, position: number): string {
  return `evidencia-${folio}-${String(position)}.jpg`;
}
