import { noCommentsRule } from './no-comments.rule.mjs';

export const localPlugin = {
  meta: { name: 'eslint-plugin-local' },
  rules: {
    'no-comments': noCommentsRule,
  },
};
