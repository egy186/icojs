// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['lcov', 'text-summary'],
      reportsDirectory: 'coverage'
    },
    environment: 'node',
    globals: true,
    include: ['src/node/*.spec.js']
  }
});
