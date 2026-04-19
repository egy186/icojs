import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text-summary'],
      reportsDirectory: 'coverage'
    },
    projects: [
      {
        test: {
          environment: 'node',
          include: ['src/node/*.test.ts'],
          name: 'node',
          setupFiles: ['src/test-fixtures/setup.ts']
        }
      },
      {
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [
              { browser: 'chromium' },
              { browser: 'firefox' },
              { browser: 'webkit' }
            ],
            provider: playwright()
          },
          include: ['src/browser/*.test.ts'],
          name: 'browser',
          setupFiles: ['src/test-fixtures/setup.ts']
        }
      }
    ]
  }
});
