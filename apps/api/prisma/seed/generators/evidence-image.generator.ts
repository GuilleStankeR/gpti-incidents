import sharp from 'sharp';

import { evidenceImageLabel } from '../data/seed-texts.data';

const IMAGE_LAYOUT = {
  width: 800,
  height: 600,
  folioFontSize: 72,
  labelFontSize: 32,
  folioBaseline: '47%',
  labelBaseline: '60%',
  jpegQuality: 82,
  fontFamily: 'Helvetica, Arial, sans-serif',
  textColor: '#ffffff',
} as const;

const BACKGROUND_COLORS = ['#1e3a8a', '#065f46', '#7c2d12', '#4c1d95', '#155e75', '#713f12'];
const DEFAULT_BACKGROUND = '#334155';

function buildSvg(folio: string, label: string, background: string): string {
  const { width, height, fontFamily, textColor } = IMAGE_LAYOUT;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${String(width)}" height="${String(height)}">`,
    `<rect width="100%" height="100%" fill="${background}"/>`,
    `<text x="50%" y="${IMAGE_LAYOUT.folioBaseline}" font-family="${fontFamily}" font-size="${String(IMAGE_LAYOUT.folioFontSize)}" font-weight="bold" fill="${textColor}" text-anchor="middle">${folio}</text>`,
    `<text x="50%" y="${IMAGE_LAYOUT.labelBaseline}" font-family="${fontFamily}" font-size="${String(IMAGE_LAYOUT.labelFontSize)}" fill="${textColor}" text-anchor="middle">${label}</text>`,
    '</svg>',
  ].join('');
}

export async function generateEvidenceImage(
  folio: string,
  position: number,
  total: number,
): Promise<Buffer> {
  const background =
    BACKGROUND_COLORS[(folio.length + position) % BACKGROUND_COLORS.length] ?? DEFAULT_BACKGROUND;
  const svg = buildSvg(folio, evidenceImageLabel(position, total), background);

  return sharp(Buffer.from(svg)).jpeg({ quality: IMAGE_LAYOUT.jpegQuality }).toBuffer();
}
