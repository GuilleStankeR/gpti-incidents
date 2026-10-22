import type { CaseFileField } from '@/modules/case-files/pdf/case-file-view';
import type { PdfWriter } from '@/modules/case-files/pdf/pdf-writer';

export function renderFieldsSection(
  writer: PdfWriter,
  title: string,
  fields: readonly CaseFileField[],
): void {
  writer.sectionTitle(title);

  for (const field of fields) {
    writer.field(field.label, field.value);
  }
}
