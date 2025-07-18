import { base, browser } from '@egy186/eslint-config';
// eslint-disable-next-line import/no-unresolved
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const config = defineConfig([
  globalIgnores([
    'coverage',
    'dist',
    'types'
  ]),
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
]);

export default config;
