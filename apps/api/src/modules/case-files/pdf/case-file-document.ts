import PDFDocument from 'pdfkit';

import { caseFilesCopy } from '@/modules/case-files/case-files.copy';

import { PAGE_LAYOUT } from './case-file-layout.constants';
import type { CaseFileView } from './case-file-view';
import { PdfWriter } from './pdf-writer';
import { renderAuditTrailSection } from './sections/audit-trail.section';
import { renderDescriptionSection } from './sections/description.section';
import { renderEvidenceSection } from './sections/evidence.section';
import { renderFieldsSection } from './sections/fields.section';
import { renderFooterSection } from './sections/footer.section';
import { renderHeaderSection } from './sections/header.section';

function collectOutput(document: PDFKit.PDFDocument): Promise<Buffer> {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    document.on('data', (chunk: Buffer) => chunks.push(chunk));
    document.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    document.on('error', reject);
  });
}

export async function renderCaseFilePdf(view: CaseFileView): Promise<Buffer> {
  const document = new PDFDocument({
    size: PAGE_LAYOUT.size,
    margin: PAGE_LAYOUT.margin,
    bufferPages: true,
    info: { Title: caseFilesCopy.fileName(view.folio), Author: caseFilesCopy.documentAuthor },
  });
  const output = collectOutput(document);
  const writer = new PdfWriter(document);

  renderHeaderSection(writer, view);
  renderFieldsSection(writer, caseFilesCopy.sections.identification, view.identification);
  renderFieldsSection(writer, caseFilesCopy.sections.parties, view.parties);
  renderDescriptionSection(writer, view);
  renderEvidenceSection(writer, view);
  renderAuditTrailSection(writer, view);
  renderFooterSection(writer, view);

  document.end();
  return output;
}
