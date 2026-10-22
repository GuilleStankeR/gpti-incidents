import { caseFilesCopy } from '@/modules/case-files/case-files.copy';
import type { CaseFileView } from '@/modules/case-files/pdf/case-file-view';
import type { PdfWriter } from '@/modules/case-files/pdf/pdf-writer';

export function renderDescriptionSection(writer: PdfWriter, view: CaseFileView): void {
  writer.sectionTitle(caseFilesCopy.sections.description);
  writer.paragraph(view.description);
}
