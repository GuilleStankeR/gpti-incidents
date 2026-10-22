import { chmod, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, posix, resolve, sep } from 'node:path';

const READ_ONLY_FILE_MODE = 0o444;
const CREATE_EXCLUSIVE_FLAG = 'wx';

export function buildStoragePath(directory: string, fileName: string): string {
  return posix.join(directory, fileName);
}

function resolveInsideRoot(rootDirectory: string, storagePath: string): string {
  const absolutePath = resolve(rootDirectory, storagePath);

  if (!absolutePath.startsWith(`${rootDirectory}${sep}`)) {
    throw new Error(`Storage path escapes the storage directory: ${storagePath}`);
  }

  return absolutePath;
}

export async function saveImmutableFile(
  rootDirectory: string,
  storagePath: string,
  content: Buffer,
): Promise<void> {
  const absolutePath = resolveInsideRoot(rootDirectory, storagePath);

  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, { flag: CREATE_EXCLUSIVE_FLAG });
  await chmod(absolutePath, READ_ONLY_FILE_MODE);
}

export async function readStoredFile(rootDirectory: string, storagePath: string): Promise<Buffer> {
  return readFile(resolveInsideRoot(rootDirectory, storagePath));
}

export async function removeStoredFile(rootDirectory: string, storagePath: string): Promise<void> {
  await rm(resolveInsideRoot(rootDirectory, storagePath), { force: true });
}
