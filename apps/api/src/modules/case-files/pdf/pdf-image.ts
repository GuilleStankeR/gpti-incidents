import sharp from 'sharp';

import { IMAGE_RENDITION } from './case-file-layout.constants';

export interface PdfImage {
  readonly content: Buffer;
  readonly width: number;
  readonly height: number;
}

export async function toPdfImage(source: Buffer): Promise<PdfImage> {
  const { data, info } = await sharp(source)
    .rotate()
    .resize({
      width: IMAGE_RENDITION.maxDimension,
      height: IMAGE_RENDITION.maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: IMAGE_RENDITION.jpegQuality })
    .toBuffer({ resolveWithObject: true });

  return { content: data, width: info.width, height: info.height };
}
