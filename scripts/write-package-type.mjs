import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SUPPORTED_MODULE_TYPES = new Set(['commonjs', 'module']);
const [outputDirectory, moduleType] = process.argv.slice(2);

if (outputDirectory === undefined || !SUPPORTED_MODULE_TYPES.has(moduleType)) {
  throw new Error('Usage: write-package-type.mjs <output-directory> <commonjs|module>');
}

const packageJsonPath = join(resolve(outputDirectory), 'package.json');
writeFileSync(packageJsonPath, `${JSON.stringify({ type: moduleType }, undefined, 2)}\n`);
