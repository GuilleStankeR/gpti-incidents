import { defineConfig } from 'eslint/config';
import unicorn from 'eslint-plugin-unicorn';

import { JAVASCRIPT_FILES, SOURCE_FILES } from '../constants.mjs';

const ALLOWED_ABBREVIATIONS = {
  args: false,
  dev: false,
  dir: false,
  env: false,
  params: false,
  props: false,
  ref: false,
  refs: false,
};

export const unicornConfig = defineConfig(
  {
    files: SOURCE_FILES,
    extends: [unicorn.configs.recommended],
    rules: {
      'unicorn/prevent-abbreviations': ['error', { replacements: ALLOWED_ABBREVIATIONS }],
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-global-this': 'off',
    },
  },
  {
    files: ['**/*.ts', ...JAVASCRIPT_FILES],
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase', ignore: [String.raw`^main\.tsx$`] }],
    },
  },
);
