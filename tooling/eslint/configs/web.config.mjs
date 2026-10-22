import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import {
  WEB_COMPONENT_FILES,
  WEB_FILES,
  WEB_HTTP_CLIENT_FILES,
  WEB_SESSION_STORAGE_FILES,
} from '../constants.mjs';
import { RESTRICTED_SYNTAX } from './base.config.mjs';
import { WEB_LAYER_ZONES } from './web-layers.mjs';

const COPY_MESSAGE = 'User-facing text must come from a *.copy.ts file.';
const USER_FACING_ATTRIBUTES =
  '/^(placeholder|title|alt|label|aria-label|aria-description|aria-placeholder|aria-roledescription|aria-valuetext)$/';

const WEB_RESTRICTED_SYNTAX = [
  ...RESTRICTED_SYNTAX,
  {
    selector: `JSXAttribute[name.name=${USER_FACING_ATTRIBUTES}] > Literal`,
    message: COPY_MESSAGE,
  },
  {
    selector: `JSXAttribute[name.name=${USER_FACING_ATTRIBUTES}] > JSXExpressionContainer > :matches(Literal, TemplateLiteral)`,
    message: COPY_MESSAGE,
  },
];

const FETCH_MESSAGE = 'Use the shared http-client instead of calling fetch directly.';
const STORAGE_MESSAGE = 'Use the auth session storage module instead of localStorage.';
const FETCH_GLOBALS = [{ name: 'fetch', message: FETCH_MESSAGE }];
const STORAGE_GLOBALS = [{ name: 'localStorage', message: STORAGE_MESSAGE }];
const FETCH_PROPERTIES = [
  { object: 'window', property: 'fetch', message: FETCH_MESSAGE },
  { object: 'globalThis', property: 'fetch', message: FETCH_MESSAGE },
];
const STORAGE_PROPERTIES = [
  { object: 'window', property: 'localStorage', message: STORAGE_MESSAGE },
  { object: 'globalThis', property: 'localStorage', message: STORAGE_MESSAGE },
];

export const webConfig = defineConfig(
  {
    files: WEB_FILES,
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
    settings: { react: { version: '18.3' } },
    rules: {
      'no-restricted-syntax': ['error', ...WEB_RESTRICTED_SYNTAX],
      'no-restricted-globals': ['error', ...FETCH_GLOBALS, ...STORAGE_GLOBALS],
      'no-restricted-properties': ['error', ...FETCH_PROPERTIES, ...STORAGE_PROPERTIES],
      'import-x/no-restricted-paths': ['error', { zones: WEB_LAYER_ZONES }],
      'react/prop-types': 'off',
      'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: true }],
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/button-has-type': 'error',
      'react/hook-use-state': 'error',
    },
  },
  {
    files: WEB_COMPONENT_FILES,
    rules: {
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: WEB_HTTP_CLIENT_FILES,
    rules: {
      'no-restricted-globals': ['error', ...STORAGE_GLOBALS],
      'no-restricted-properties': ['error', ...STORAGE_PROPERTIES],
    },
  },
  {
    files: WEB_SESSION_STORAGE_FILES,
    rules: {
      'no-restricted-globals': ['error', ...FETCH_GLOBALS],
      'no-restricted-properties': ['error', ...FETCH_PROPERTIES],
    },
  },
);
