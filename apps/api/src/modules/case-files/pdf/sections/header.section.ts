import { caseFilesCopy } from '@/modules/case-files/case-files.copy';
import { COLORS, FONT_SIZES, FONTS } from '@/modules/case-files/pdf/case-file-layout.constants';
import type { CaseFileView } from '@/modules/case-files/pdf/case-file-view';
import type { PdfWriter } from '@/modules/case-files/pdf/pdf-writer';

export function renderHeaderSection(writer: PdfWriter, view: CaseFileView): void {
  writer.text(caseFilesCopy.documentTitle, { font: FONTS.bold, size: FONT_SIZES.title });
  writer.text(view.folio, { font: FONTS.bold, size: FONT_SIZES.folio, color: COLORS.accent });
  writer.text(view.condominiumName, { font: FONTS.bold, size: FONT_SIZES.subtitle });
  writer.text(view.condominiumAddress, {
    font: FONTS.regular,
    size: FONT_SIZES.subtitle,
    color: COLORS.muted,
  });
  writer.divider();
}
