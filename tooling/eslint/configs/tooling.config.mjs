import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { CONFIG_FILES, JAVASCRIPT_FILES } from '../constants.mjs';

export const toolingConfig = defineConfig(
  {
    files: JAVASCRIPT_FILES,
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  {
    files: CONFIG_FILES,
    rules: { 'import-x/no-default-export': 'off' },
  },
);
