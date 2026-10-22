import sharp from 'sharp';

export async function isDecodableImage(content: Buffer): Promise<boolean> {
  try {
    const { width, height } = await sharp(content).metadata();
    return width > 0 && height > 0;
  } catch {
    return false;
  }
}
