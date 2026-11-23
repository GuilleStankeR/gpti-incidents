import { posix } from 'node:path';

export function buildStoragePath(directory: string, fileName: string): string {
  return posix.join(directory, fileName);
}
