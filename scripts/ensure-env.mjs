import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');
const envFilePath = join(rootDirectory, '.env');
const exampleFilePath = join(rootDirectory, '.env.example');

if (!existsSync(envFilePath)) {
  copyFileSync(exampleFilePath, envFilePath);
  process.stdout.write('Created .env from .env.example\n');
}
