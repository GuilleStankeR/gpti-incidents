import type { PdfImage } from './pdf-image';

export interface CaseFileField {
  readonly label: string;
  readonly value: string;
}

export interface CaseFileEvidenceView {
  readonly image: PdfImage | null;
  readonly details: readonly string[];
}

export interface CaseFileAuditEntryView {
  readonly heading: string;
  readonly fromLabel: string;
  readonly toLabel: string;
  readonly note: string;
}

export interface CaseFileView {
  readonly folio: string;
  readonly condominiumName: string;
  readonly condominiumAddress: string;
  readonly identification: readonly CaseFileField[];
  readonly parties: readonly CaseFileField[];
  readonly description: string;
  readonly evidence: readonly CaseFileEvidenceView[];
  readonly auditTrail: readonly CaseFileAuditEntryView[];
  readonly issuedLine: string;
}
