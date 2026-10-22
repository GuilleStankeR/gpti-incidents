export const PAGE_LAYOUT = {
  size: 'LETTER',
  margin: 50,
} as const;

export const FONTS = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
  italic: 'Helvetica-Oblique',
} as const;

export const FONT_SIZES = {
  title: 16,
  folio: 26,
  subtitle: 10,
  sectionTitle: 12,
  body: 10,
  small: 8,
  footer: 7,
} as const;

export const COLORS = {
  text: '#1f2937',
  muted: '#4b5563',
  accent: '#1e3a8a',
  divider: '#cbd5e1',
} as const;

export const SPACING = {
  sectionGap: 1.2,
  afterTitle: 0.4,
  paragraphGap: 0.5,
  fieldGap: 4,
  labelWidth: 190,
  blockGap: 0.8,
} as const;

export const EVIDENCE_IMAGE = {
  maxWidth: 240,
  maxHeight: 240,
  detailsHeight: 70,
} as const;

export const IMAGE_RENDITION = {
  maxDimension: 960,
  jpegQuality: 85,
} as const;

export const ARROW = {
  gap: 6,
  length: 14,
  headSize: 3,
  lineWidth: 0.8,
} as const;

export const FOOTER = {
  offsetFromBottom: 40,
  legendGap: 2,
} as const;

export const MINIMUM_BLOCK_HEIGHT = 60;
