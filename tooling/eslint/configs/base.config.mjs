import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';

import { IGNORED_PATHS, SOURCE_FILES } from '../constants.mjs';
import { localPlugin } from '../local.plugin.mjs';

export const RESTRICTED_SYNTAX = [
  {
    selector: 'TSEnumDeclaration',
    message: 'Use an `as const` object with a derived type instead of an enum.',
  },
  {
    selector:
      'TSAsExpression[expression.type="TSAsExpression"][expression.typeAnnotation.type="TSUnknownKeyword"]',
    message: 'Double type assertions through unknown are not allowed.',
  },
];

export const baseConfig = defineConfig(
  globalIgnores(IGNORED_PATHS),
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: SOURCE_FILES,
    extends: [js.configs.recommended],
    plugins: { local: localPlugin },
    rules: {
      'local/no-comments': 'error',
      'no-console': 'error',
      'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX],
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-lonely-if': 'error',
      'no-param-reassign': ['error', { props: true }],
      'no-return-assign': 'error',
      'no-useless-rename': 'error',
      'no-useless-concat': 'error',
      'no-implicit-coercion': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-object-spread': 'error',
      'object-shorthand': 'error',
      eqeqeq: ['error', 'always'],
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['error', 4],
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
    },
  },
);
