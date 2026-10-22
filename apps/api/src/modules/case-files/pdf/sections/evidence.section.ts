import { caseFilesCopy } from '@/modules/case-files/case-files.copy';
import { EVIDENCE_IMAGE } from '@/modules/case-files/pdf/case-file-layout.constants';
import type { CaseFileEvidenceView, CaseFileView } from '@/modules/case-files/pdf/case-file-view';
import type { PdfWriter } from '@/modules/case-files/pdf/pdf-writer';

const EVIDENCE_BLOCK_HEIGHT = EVIDENCE_IMAGE.maxHeight + EVIDENCE_IMAGE.detailsHeight;

function renderEvidenceItem(writer: PdfWriter, item: CaseFileEvidenceView): void {
  writer.ensureSpace(EVIDENCE_BLOCK_HEIGHT);

  if (item.image === null) {
    writer.smallLines([caseFilesCopy.values.imageUnavailable]);
  } else {
    writer.image(item.image);
  }

  writer.smallLines(item.details);
  writer.blockGap();
}

export function renderEvidenceSection(writer: PdfWriter, view: CaseFileView): void {
  writer.sectionTitle(
    caseFilesCopy.sections.evidence,
    view.evidence.length > 0 ? EVIDENCE_BLOCK_HEIGHT : undefined,
  );

  if (view.evidence.length === 0) {
    writer.paragraph(caseFilesCopy.values.noEvidence);
    return;
  }

  for (const item of view.evidence) {
    renderEvidenceItem(writer, item);
  }
}
