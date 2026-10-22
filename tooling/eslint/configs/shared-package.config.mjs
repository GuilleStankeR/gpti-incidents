import { defineConfig } from 'eslint/config';

import { SHARED_PACKAGE_FILES } from '../constants.mjs';

export const sharedPackageConfig = defineConfig({
  files: SHARED_PACKAGE_FILES,
  rules: {
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@incidents/*', '@/*', 'node:*', 'react', 'react-*', '@nestjs/*', '@prisma/*'],
            message:
              'The shared package must stay framework-agnostic and free of runtime dependencies.',
          },
        ],
      },
    ],
  },
});
