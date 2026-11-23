import { appendFileSync, copyFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');
const envFilePath = join(rootDirectory, '.env');
const exampleFilePath = join(rootDirectory, '.env.example');

const readEntries = (filePath) =>
  readFileSync(filePath, 'utf8')
    .split('\n')
    .filter((line) => line.includes('='));

const readKeys = (filePath) => new Set(readEntries(filePath).map((line) => line.split('=')[0]));

if (existsSync(envFilePath)) {
  const existingKeys = readKeys(envFilePath);
  const missingEntries = readEntries(exampleFilePath).filter(
    (line) => !existingKeys.has(line.split('=')[0]),
  );

  if (missingEntries.length > 0) {
    const separator = readFileSync(envFilePath, 'utf8').endsWith('\n') ? '' : '\n';
    appendFileSync(envFilePath, `${separator}${missingEntries.join('\n')}\n`);
    process.stdout.write(
      `Added to .env: ${missingEntries.map((line) => line.split('=')[0]).join(', ')}\n`,
    );
  }
} else {
  copyFileSync(exampleFilePath, envFilePath);
  process.stdout.write('Created .env from .env.example\n');
}
