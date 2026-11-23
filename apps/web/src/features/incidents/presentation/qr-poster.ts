import type { QrMatrix } from './qr-matrix';

export interface QrPosterContent {
  readonly title: string;
  readonly condominium: string;
  readonly location: string;
  readonly instruction: string;
  readonly link: string;
}

interface TextStyle {
  readonly y: number;
  readonly size: number;
  readonly weight: number;
  readonly color: string;
}

const POSTER = {
  width: 1200,
  height: 1650,
  maxTextWidth: 1040,
  qrTop: 300,
  qrSize: 900,
  quietZoneModules: 4,
  quietZoneSides: 2,
} as const;

const TEXT_STYLES = {
  title: { y: 150, size: 76, weight: 700, color: '#1e3a8a' },
  condominium: { y: 230, size: 40, weight: 500, color: '#475569' },
  location: { y: 1300, size: 56, weight: 700, color: '#0f172a' },
  instruction: { y: 1400, size: 38, weight: 500, color: '#334155' },
  link: { y: 1560, size: 24, weight: 400, color: '#64748b' },
} as const satisfies Readonly<Record<string, TextStyle>>;

const COLORS = { background: '#ffffff', module: '#0f172a' } as const;
const FONT_FAMILY = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const PNG_MIME_TYPE = 'image/png';
const HALF = 0.5;

class QrPosterPainter {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  fillBackground(): void {
    this.context.fillStyle = COLORS.background;
    this.context.fillRect(0, 0, POSTER.width, POSTER.height);
  }

  drawCenteredText(text: string, style: TextStyle): void {
    this.context.font = `${String(style.weight)} ${String(style.size)}px ${FONT_FAMILY}`;
    this.context.fillStyle = style.color;
    this.context.textAlign = 'center';
    this.context.fillText(text, POSTER.width * HALF, style.y, POSTER.maxTextWidth);
  }

  drawQrModules(matrix: QrMatrix): void {
    const totalModules = matrix.length + POSTER.quietZoneModules * POSTER.quietZoneSides;
    const moduleSize = Math.floor(POSTER.qrSize / totalModules);
    const quietZone = POSTER.quietZoneModules * moduleSize;
    const offset = (POSTER.qrSize - moduleSize * totalModules) * HALF + quietZone;
    const left = (POSTER.width - POSTER.qrSize) * HALF + offset;
    const top = POSTER.qrTop + offset;

    this.context.fillStyle = COLORS.module;
    for (const [rowIndex, row] of matrix.entries()) {
      for (const [columnIndex, isDark] of row.entries()) {
        if (isDark) {
          const x = left + columnIndex * moduleSize;
          this.context.fillRect(x, top + rowIndex * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }
}

async function exportPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('The QR poster could not be exported'));
        return;
      }
      resolve(blob);
    }, PNG_MIME_TYPE);
  });
}

export async function renderQrPoster(matrix: QrMatrix, content: QrPosterContent): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = POSTER.width;
  canvas.height = POSTER.height;
  const context = canvas.getContext('2d');

  if (context === null) {
    throw new Error('The 2D canvas context is not available');
  }

  const painter = new QrPosterPainter(context);
  painter.fillBackground();
  painter.drawCenteredText(content.title, TEXT_STYLES.title);
  painter.drawCenteredText(content.condominium, TEXT_STYLES.condominium);
  painter.drawQrModules(matrix);
  painter.drawCenteredText(content.location, TEXT_STYLES.location);
  painter.drawCenteredText(content.instruction, TEXT_STYLES.instruction);
  painter.drawCenteredText(content.link, TEXT_STYLES.link);

  return exportPng(canvas);
}
