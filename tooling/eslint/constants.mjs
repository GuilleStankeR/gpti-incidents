import { resolve } from 'node:path';

export const ROOT_DIRECTORY = resolve(import.meta.dirname, '..', '..');

export const TYPESCRIPT_FILES = ['**/*.ts', '**/*.tsx'];
export const JAVASCRIPT_FILES = ['**/*.js', '**/*.mjs', '**/*.cjs'];
export const SOURCE_FILES = [...TYPESCRIPT_FILES, ...JAVASCRIPT_FILES];

export const API_FILES = ['apps/api/**/*.ts'];
export const API_SOURCE_FILES = ['apps/api/src/**/*.ts'];
export const API_DOMAIN_FILES = ['apps/api/src/**/domain/**/*.ts'];
export const API_CONTROLLER_FILES = ['apps/api/src/**/*.controller.ts'];
export const API_PRISMA_RUNTIME_FILES = [
  'apps/api/src/database/**/*.ts',
  'apps/api/src/**/*.repository.ts',
  'apps/api/prisma/**/*.ts',
];
export const API_ENVIRONMENT_READER_FILES = [
  'apps/api/src/config/**/*.ts',
  'apps/api/prisma/**/*.ts',
];

export const WEB_FILES = ['apps/web/**/*.ts', 'apps/web/**/*.tsx'];
export const WEB_COMPONENT_FILES = ['apps/web/src/**/*.tsx'];
export const WEB_HTTP_CLIENT_FILES = ['apps/web/src/shared/api/http-client.ts'];
export const WEB_SESSION_STORAGE_FILES = ['apps/web/src/features/auth/session-storage.ts'];

export const APP_SOURCE_FILES = ['apps/*/src/**/*.ts', 'apps/*/src/**/*.tsx'];
export const SHARED_PACKAGE_FILES = ['packages/shared/**/*.ts'];

export const CONFIG_FILES = [
  'eslint.config.mjs',
  '**/vite.config.ts',
  '**/tailwind.config.ts',
  '**/postcss.config.mjs',
];

export const DEV_DEPENDENCY_FILES = [
  ...CONFIG_FILES,
  'tooling/**',
  'scripts/**',
  'apps/api/prisma/**',
];

export const IGNORED_PATHS = [
  '**/node_modules/',
  '**/dist/',
  '**/coverage/',
  'apps/api/storage/',
  'apps/api/prisma/migrations/',
];
