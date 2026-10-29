import './src/tests/env'

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: false,
  forbidOnly: process.env.CI === 'true',
  retries: process.env.CI === 'true' ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3100',
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  expect: { timeout: 8000 },
  projects: [
    { name: 'setup', testMatch: '**/*.setup.ts', teardown: 'teardown' },
    {
      name: 'authenticated',
      testMatch: 'authenticated/**/*.test.ts',
      use: { storageState: './src/tests/e2e/.auth/user.json' },
      dependencies: ['setup'],
    },
    { name: 'unauthenticated', testMatch: 'unauthenticated/**/*.test.ts', dependencies: ['setup'] },
    { name: 'teardown', testMatch: '**/*.teardown.ts' },
  ],
  webServer: {
    command: 'pnpm test:server',
    url: 'http://localhost:3100',
    timeout: 180_000,
    reuseExistingServer: false,
    env: { TEST_SERVER: '1' },
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
})
