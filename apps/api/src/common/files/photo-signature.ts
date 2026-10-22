import type { PhotoMimeType } from '@incidents/shared';

const JPEG_SIGNATURE = Buffer.from('ffd8ff', 'hex');
const PNG_SIGNATURE = Buffer.from('89504e470d0a1a0a', 'hex');
const RIFF_SIGNATURE = Buffer.from('RIFF', 'ascii');
const WEBP_SIGNATURE = Buffer.from('WEBP', 'ascii');
const WEBP_SIGNATURE_OFFSET = 8;

export const PHOTO_FILE_EXTENSIONS: Readonly<Record<PhotoMimeType, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function startsWithAt(content: Buffer, signature: Buffer, offset = 0): boolean {
  return content.subarray(offset, offset + signature.length).equals(signature);
}

export function detectPhotoMimeType(content: Buffer): PhotoMimeType | null {
  if (startsWithAt(content, JPEG_SIGNATURE)) {
    return 'image/jpeg';
  }

  if (startsWithAt(content, PNG_SIGNATURE)) {
    return 'image/png';
  }

  if (
    startsWithAt(content, RIFF_SIGNATURE) &&
    startsWithAt(content, WEBP_SIGNATURE, WEBP_SIGNATURE_OFFSET)
  ) {
    return 'image/webp';
  }

  return null;
}
