import { createHash } from 'node:crypto';

const SHA256_ALGORITHM = 'sha256';
const HEX_ENCODING = 'hex';

export function calculateSha256(content: Buffer): string {
  return createHash(SHA256_ALGORITHM).update(content).digest(HEX_ENCODING);
}
