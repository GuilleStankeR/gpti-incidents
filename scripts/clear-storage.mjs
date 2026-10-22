import { rmSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const storageDirectory = process.env.STORAGE_DIR;

if (storageDirectory === undefined || storageDirectory.length === 0) {
  throw new Error('STORAGE_DIR is not defined');
}

const workingDirectory = process.cwd();
const absoluteStorageDirectory = resolve(workingDirectory, storageDirectory);
const pathFromWorkingDirectory = relative(workingDirectory, absoluteStorageDirectory);

if (pathFromWorkingDirectory.length === 0 || pathFromWorkingDirectory.startsWith('..')) {
  throw new Error(`Refusing to clear a directory outside the project: ${absoluteStorageDirectory}`);
}

rmSync(absoluteStorageDirectory, { recursive: true, force: true });
process.stdout.write(`Cleared storage directory ${absoluteStorageDirectory}\n`);
