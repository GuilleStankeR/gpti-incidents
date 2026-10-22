import { defineConfig } from 'eslint/config';

import { apiConfig } from './tooling/eslint/configs/api.config.mjs';
import { baseConfig } from './tooling/eslint/configs/base.config.mjs';
import { formattingConfig } from './tooling/eslint/configs/formatting.config.mjs';
import { importsConfig } from './tooling/eslint/configs/imports.config.mjs';
import { sharedPackageConfig } from './tooling/eslint/configs/shared-package.config.mjs';
import { toolingConfig } from './tooling/eslint/configs/tooling.config.mjs';
import { typescriptConfig } from './tooling/eslint/configs/typescript.config.mjs';
import { unicornConfig } from './tooling/eslint/configs/unicorn.config.mjs';
import { webConfig } from './tooling/eslint/configs/web.config.mjs';

export default defineConfig(
  baseConfig,
  typescriptConfig,
  importsConfig,
  unicornConfig,
  apiConfig,
  webConfig,
  sharedPackageConfig,
  toolingConfig,
  formattingConfig,
);
