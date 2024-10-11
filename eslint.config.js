import { base, browser } from '@egy186/eslint-config';
import globals from 'globals';

/** @satisfies {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      'coverage',
      'dist',
      'types'
    ]
  },
  {
    ...base,
    rules: {
      ...base.rules,
      'jsdoc/no-defaults': 'off',
      'jsdoc/no-undefined-types': 'off'
    }
  },
  {
    ...browser,
    files: ['docs/**/*.js', 'src/browser/**/*.js'],
    rules: {
      ...browser.rules,
      'jsdoc/no-defaults': 'off'
    }
  },
  {
    files: ['docs/**/*.js'],
    languageOptions: {
      globals: {
        $: true,
        ICO: true,
        hljs: true
      }
    },
    rules: {
      'import/unambiguous': 'off',
      'no-console': 'off'
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: { globals: globals.mocha },
    rules: {
      '@stylistic/array-element-newline': 'off',
      'no-unused-expressions': 'off'
    }
  }
];

export default config;
