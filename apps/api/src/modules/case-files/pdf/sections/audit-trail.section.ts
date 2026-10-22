import { caseFilesCopy } from '@/modules/case-files/case-files.copy';
import {
  FONT_SIZES,
  FONTS,
  MINIMUM_BLOCK_HEIGHT,
} from '@/modules/case-files/pdf/case-file-layout.constants';
import type { CaseFileView } from '@/modules/case-files/pdf/case-file-view';
import type { PdfWriter } from '@/modules/case-files/pdf/pdf-writer';

export function renderAuditTrailSection(writer: PdfWriter, view: CaseFileView): void {
  writer.sectionTitle(caseFilesCopy.sections.auditTrail);

  for (const entry of view.auditTrail) {
    writer.ensureSpace(MINIMUM_BLOCK_HEIGHT);
    writer.text(entry.heading, { font: FONTS.bold, size: FONT_SIZES.body });
    writer.transition(entry.fromLabel, entry.toLabel);
    writer.paragraph(entry.note);
  }
}
