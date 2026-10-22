import { defineConfig } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver, importX } from 'eslint-plugin-import-x';

import { APP_SOURCE_FILES, DEV_DEPENDENCY_FILES, SOURCE_FILES } from '../constants.mjs';

const PARENT_RELATIVE_IMPORT = {
  regex: String.raw`^\.\./`,
  message: 'Import through the @/ alias instead of a parent relative path.',
};

const IMPORT_ORDER = {
  groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
  pathGroups: [
    { pattern: '@incidents/**', group: 'internal', position: 'before' },
    { pattern: '@/**', group: 'internal' },
  ],
  pathGroupsExcludedImportTypes: ['builtin'],
  'newlines-between': 'always',
  alphabetize: { order: 'asc', caseInsensitive: true },
};

export const importsConfig = defineConfig(
  {
    files: SOURCE_FILES,
    plugins: { 'import-x': importX },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
          noWarnOnMultipleProjects: true,
        }),
        createNodeResolver(),
      ],
    },
    rules: {
      'import-x/order': ['error', IMPORT_ORDER],
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-default-export': 'error',
      'import-x/no-mutable-exports': 'error',
      'import-x/no-relative-packages': 'error',
      'import-x/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: DEV_DEPENDENCY_FILES, includeTypes: false },
      ],
    },
  },
  {
    files: APP_SOURCE_FILES,
    rules: {
      'no-restricted-imports': ['error', { patterns: [PARENT_RELATIVE_IMPORT] }],
    },
  },
);
