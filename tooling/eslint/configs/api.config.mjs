import { defineConfig } from 'eslint/config';
import globals from 'globals';

import {
  API_CONTROLLER_FILES,
  API_DOMAIN_FILES,
  API_ENVIRONMENT_READER_FILES,
  API_FILES,
  API_PRISMA_RUNTIME_FILES,
} from '../constants.mjs';

const PRISMA_RUNTIME_RESTRICTION = {
  name: '@prisma/client',
  allowTypeImports: true,
  message: 'Only repositories and the database module may use the Prisma client at runtime.',
};

const DOMAIN_RESTRICTIONS = {
  patterns: [
    {
      group: [
        '@nestjs/*',
        '@prisma/*',
        'express',
        'multer',
        'pdfkit',
        'sharp',
        'rxjs',
        'class-validator',
        'class-transformer',
        'node:*',
      ],
      message: 'The domain layer must stay pure: no framework, ORM or I/O imports.',
    },
    {
      group: [
        '@/config/**',
        '@/database/**',
        '**/*.service',
        '**/*.repository',
        '**/*.controller',
        '**/*.module',
        '**/*.adapter',
      ],
      message: 'The domain layer cannot depend on application or infrastructure code.',
    },
  ],
};

export const apiConfig = defineConfig(
  {
    files: API_FILES,
    languageOptions: { globals: globals.node },
    rules: {
      'unicorn/prefer-top-level-await': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        { paths: [PRISMA_RUNTIME_RESTRICTION] },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'process', property: 'env', message: 'Read configuration through AppConfig.' },
      ],
    },
  },
  {
    files: API_PRISMA_RUNTIME_FILES,
    rules: { '@typescript-eslint/no-restricted-imports': 'off' },
  },
  {
    files: API_ENVIRONMENT_READER_FILES,
    rules: { 'no-restricted-properties': 'off' },
  },
  {
    files: API_DOMAIN_FILES,
    rules: { '@typescript-eslint/no-restricted-imports': ['error', DOMAIN_RESTRICTIONS] },
  },
  {
    files: API_CONTROLLER_FILES,
    rules: {
      'max-lines-per-function': ['error', { max: 15, skipBlankLines: true, skipComments: true }],
    },
  },
);
