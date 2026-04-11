import { base, browser } from '@egy186/eslint-config';
/* eslint-disable import/no-unresolved */
import { defineConfig, globalIgnores } from 'eslint/config';
import { typescriptConfig } from '@egy186/eslint-config/typescript';
import { vitest } from '@egy186/eslint-config/vitest';
/* eslint-enable import/no-unresolved */

const config = defineConfig([
  globalIgnores([
    'coverage',
    'dist',
    'docs'
  ]),
  {
    ...base,
    files: [
      '**/*.ts',
      'eslint.config.js',
      '!src/browser/**/*.ts',
      '!src/test-fixtures/is-same-browser.ts'
    ],
    rules: {
      ...base.rules,
      'jsdoc/no-defaults': 'off'
    }
  },
  {
    ...browser,
    files: [
      'assets/demo.js',
      'src/browser/**/*.ts',
      'src/test-fixtures/is-same-browser.ts'
    ],
    rules: {
      ...browser.rules,
      'jsdoc/no-defaults': 'off'
    }
  },
  {
    files: ['assets/demo.js'],
    languageOptions: {
      globals: {
        $: true,
        ICO: true
      }
    },
    rules: {
      'import/unambiguous': 'off',
      'max-lines-per-function': 'off',
      'no-await-in-loop': 'off',
      'no-console': 'off'
    }
  },
  typescriptConfig({ projectService: { allowDefaultProject: ['*.ts'] } }),
  {
    ...vitest,
    rules: {
      '@stylistic/array-element-newline': 'off'
    }
  }
]);

export default config;
