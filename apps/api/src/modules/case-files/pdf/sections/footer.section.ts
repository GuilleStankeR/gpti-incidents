import { caseFilesCopy } from '@/modules/case-files/case-files.copy';
import type { CaseFileView } from '@/modules/case-files/pdf/case-file-view';
import type { PdfWriter } from '@/modules/case-files/pdf/pdf-writer';

const FOOTER_SEPARATOR = ' · ';

export function renderFooterSection(writer: PdfWriter, view: CaseFileView): void {
  writer.renderPageFooters((pageNumber, pageCount) => ({
    line: [view.issuedLine, caseFilesCopy.footer.page(pageNumber, pageCount)].join(
      FOOTER_SEPARATOR,
    ),
    legend: caseFilesCopy.footer.legend,
  }));
}
