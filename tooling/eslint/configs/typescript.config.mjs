import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import { ROOT_DIRECTORY, TYPESCRIPT_FILES } from '../constants.mjs';

const BOOLEAN_PREFIXES = ['is', 'has', 'can', 'should', 'was', 'will'];

const NAMING_CONVENTION = [
  {
    selector: 'default',
    format: ['camelCase'],
    leadingUnderscore: 'forbid',
    trailingUnderscore: 'forbid',
  },
  { selector: 'import', format: ['camelCase', 'PascalCase'] },
  { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
  { selector: 'variable', types: ['boolean'], format: ['PascalCase'], prefix: BOOLEAN_PREFIXES },
  { selector: 'variable', modifiers: ['destructured'], format: null },
  { selector: 'function', format: ['camelCase', 'PascalCase'] },
  {
    selector: 'parameter',
    modifiers: ['unused'],
    format: ['camelCase'],
    leadingUnderscore: 'require',
  },
  { selector: 'typeLike', format: ['PascalCase'] },
  { selector: 'interface', format: ['PascalCase'], custom: { regex: '^I[A-Z]', match: false } },
  { selector: ['classProperty', 'typeProperty'], format: ['camelCase', 'UPPER_CASE'] },
  { selector: 'objectLiteralProperty', format: null },
  {
    selector: ['classProperty', 'typeProperty', 'objectLiteralProperty'],
    modifiers: ['requiresQuotes'],
    format: null,
  },
  { selector: 'enumMember', format: ['UPPER_CASE'] },
];

const MAGIC_NUMBERS = {
  ignore: [-1, 0, 1],
  ignoreArrayIndexes: true,
  ignoreDefaultValues: true,
  enforceConst: true,
  detectObjects: false,
  ignoreEnums: true,
  ignoreNumericLiteralTypes: true,
  ignoreReadonlyClassProperties: true,
  ignoreTypeIndexes: true,
};

export const typescriptConfig = defineConfig({
  files: TYPESCRIPT_FILES,
  extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: ROOT_DIRECTORY,
    },
  },
  rules: {
    'max-params': 'off',
    'no-magic-numbers': 'off',
    '@typescript-eslint/max-params': ['error', { max: 4 }],
    '@typescript-eslint/no-magic-numbers': ['error', MAGIC_NUMBERS],
    '@typescript-eslint/naming-convention': ['error', ...NAMING_CONVENTION],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
    '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    '@typescript-eslint/method-signature-style': ['error', 'property'],
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      { allowString: false, allowNumber: false, allowNullableObject: true },
    ],
  },
});
