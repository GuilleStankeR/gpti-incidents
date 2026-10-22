import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';

import { SOURCE_FILES } from '../constants.mjs';

export const formattingConfig = defineConfig(prettierConfig, {
  files: SOURCE_FILES,
  rules: {
    curly: ['error', 'all'],
  },
});
