import { defineConfig, devices } from '@playwright/test'

import { env } from './src/lib/env'

const baseURL = 'http://localhost:3000'

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: !env.CI,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 1,
  workers: env.CI ? 1 : '50%',
  reporter: 'html',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    ...devices['Desktop Chrome'],
    contextOptions: {
      permissions: ['clipboard-read', 'clipboard-write'],
    },
  },
  expect: { timeout: 5000 },
  projects: [
    { name: 'setup', testMatch: '**/*.setup.ts', teardown: 'teardown' },
    {
      name: 'authenticated',
      testMatch: 'authenticated/**/*.test.ts',
      use: {
        storageState: './src/tests/e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    { name: 'unauthenticated', testMatch: 'unauthenticated/**/*.test.ts', dependencies: ['setup'] },
    { name: 'teardown', testMatch: '**/*.teardown.ts' },
  ],
  webServer: {
    command: env.CI ? 'pnpm start' : 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !env.CI,
  },
})
