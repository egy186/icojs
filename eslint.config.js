import { base, browser } from '@egy186/eslint-config';
// eslint-disable-next-line import/no-unresolved
import { defineConfig, globalIgnores } from 'eslint/config';

const config = defineConfig([
  globalIgnores([
    'coverage',
    'dist',
    'types'
  ]),
  {
    ...base,
    files: [
      '**/*.js',
      '!src/browser/**/*.js',
      '!src/test-fixtures/is-same-browser.js'
    ],
    rules: {
      ...base.rules,
      'jsdoc/no-defaults': 'off',
      'jsdoc/no-undefined-types': 'off'
    }
  },
  {
    ...browser,
    files: [
      'docs/**/*.js',
      'src/browser/**/*.js',
      'src/test-fixtures/is-same-browser.js'
    ],
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
    files: ['src/**/*.test.js'],
    rules: {
      '@stylistic/array-element-newline': 'off'
    }
  }
]);

export default config;
