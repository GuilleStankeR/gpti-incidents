import {
  ARROW,
  COLORS,
  EVIDENCE_IMAGE,
  FONT_SIZES,
  FONTS,
  FOOTER,
  MINIMUM_BLOCK_HEIGHT,
  SPACING,
} from './case-file-layout.constants';
import type { PdfImage } from './pdf-image';

const HALF = 0.5;
const FIRST_PAGE_NUMBER = 1;

export interface PageFooter {
  readonly line: string;
  readonly legend: string;
}

export type PageFooterBuilder = (pageNumber: number, pageCount: number) => PageFooter;

export class PdfWriter {
  constructor(private readonly document: PDFKit.PDFDocument) {}

  private get left(): number {
    return this.document.page.margins.left;
  }

  private get contentWidth(): number {
    const { margins, width } = this.document.page;
    return width - margins.left - margins.right;
  }

  private get bottomLimit(): number {
    return this.document.page.height - this.document.page.margins.bottom;
  }

  text(
    content: string,
    options: { readonly font: string; readonly size: number; readonly color?: string },
  ): void {
    this.document
      .font(options.font)
      .fontSize(options.size)
      .fillColor(options.color ?? COLORS.text)
      .text(content, this.left, this.document.y, { width: this.contentWidth });
  }

  sectionTitle(title: string, keepWithNextHeight: number = MINIMUM_BLOCK_HEIGHT): void {
    this.ensureSpace(MINIMUM_BLOCK_HEIGHT + keepWithNextHeight);
    this.document.moveDown(SPACING.sectionGap);
    this.text(title, { font: FONTS.bold, size: FONT_SIZES.sectionTitle, color: COLORS.accent });
    this.divider();
    this.document.moveDown(SPACING.afterTitle);
  }

  field(label: string, value: string): void {
    this.ensureSpace(MINIMUM_BLOCK_HEIGHT);
    const top = this.document.y;
    const valueWidth = this.contentWidth - SPACING.labelWidth;

    this.document.font(FONTS.bold).fontSize(FONT_SIZES.body).fillColor(COLORS.text);
    this.document.text(label, this.left, top, { width: SPACING.labelWidth });
    const labelBottom = this.document.y;

    this.document.font(FONTS.regular);
    this.document.text(value, this.left + SPACING.labelWidth, top, { width: valueWidth });

    this.document.y = Math.max(labelBottom, this.document.y) + SPACING.fieldGap;
  }

  paragraph(content: string): void {
    this.text(content, { font: FONTS.regular, size: FONT_SIZES.body });
    this.document.moveDown(SPACING.paragraphGap);
  }

  smallLines(lines: readonly string[]): void {
    for (const line of lines) {
      this.text(line, { font: FONTS.regular, size: FONT_SIZES.small, color: COLORS.muted });
    }
  }

  image(image: PdfImage): void {
    const scale = Math.min(
      EVIDENCE_IMAGE.maxWidth / image.width,
      EVIDENCE_IMAGE.maxHeight / image.height,
      1,
    );
    const height = image.height * scale;

    this.document.image(image.content, this.left, this.document.y, {
      width: image.width * scale,
      height,
    });
    this.document.y += height + SPACING.fieldGap;
  }

  transition(fromLabel: string, toLabel: string): void {
    const top = this.document.y;
    this.document.font(FONTS.regular).fontSize(FONT_SIZES.body).fillColor(COLORS.text);
    this.document.text(fromLabel, this.left, top, { lineBreak: false });

    const arrowStart = this.left + this.document.widthOfString(fromLabel) + ARROW.gap;
    const arrowEnd = arrowStart + ARROW.length;
    this.drawArrow(arrowStart, arrowEnd, top + this.document.currentLineHeight() * HALF);

    this.document.text(toLabel, arrowEnd + ARROW.gap, top, { lineBreak: false });
    this.document.y = top + this.document.currentLineHeight(true);
  }

  divider(): void {
    const y = this.document.y + ARROW.headSize;
    this.document
      .moveTo(this.left, y)
      .lineTo(this.left + this.contentWidth, y)
      .lineWidth(HALF)
      .strokeColor(COLORS.divider)
      .stroke();
    this.document.y = y + ARROW.headSize;
  }

  blockGap(): void {
    this.document.moveDown(SPACING.blockGap);
  }

  ensureSpace(height: number): void {
    if (this.document.y + height > this.bottomLimit) {
      this.document.addPage();
    }
  }

  renderPageFooters(buildFooter: PageFooterBuilder): void {
    const { start, count } = this.document.bufferedPageRange();

    for (let offset = 0; offset < count; offset += 1) {
      this.document.switchToPage(start + offset);
      this.writeFooter(buildFooter(offset + FIRST_PAGE_NUMBER, count));
    }
  }

  private writeFooter(footer: PageFooter): void {
    const { margins, height } = this.document.page;
    const originalBottomMargin = margins.bottom;
    const footerTop = height - FOOTER.offsetFromBottom;

    margins.bottom = 0;
    this.document
      .font(FONTS.regular)
      .fontSize(FONT_SIZES.footer)
      .fillColor(COLORS.muted)
      .text(footer.line, this.left, footerTop, { width: this.contentWidth });
    this.document
      .font(FONTS.italic)
      .text(footer.legend, this.left, this.document.y + FOOTER.legendGap, {
        width: this.contentWidth,
      });
    margins.bottom = originalBottomMargin;
  }

  private drawArrow(startX: number, endX: number, y: number): void {
    this.document
      .lineWidth(ARROW.lineWidth)
      .strokeColor(COLORS.text)
      .moveTo(startX, y)
      .lineTo(endX, y)
      .stroke();
    this.document
      .moveTo(endX - ARROW.headSize, y - ARROW.headSize)
      .lineTo(endX, y)
      .lineTo(endX - ARROW.headSize, y + ARROW.headSize)
      .stroke();
  }
}
