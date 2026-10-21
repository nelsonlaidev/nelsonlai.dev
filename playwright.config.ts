import 'varlock/auto-load'

import { defineConfig, devices } from '@playwright/test'

import { ENV } from '@/env'

const baseURL = 'http://localhost:3000'

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: !ENV.CI,
  forbidOnly: ENV.CI,
  retries: ENV.CI ? 2 : 1,
  workers: ENV.CI ? 1 : '50%',
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
    command: ENV.CI
      ? 'env -u __VARLOCK_ENV pnpm start'
      : 'env -u __VARLOCK_ENV pnpm build && env -u __VARLOCK_ENV pnpm start',
    env: {
      NODE_ENV: 'production',
      DISCORD_WEBHOOK_URL: '',
      AUTHOR_EMAIL: '',
      RESEND_API_KEY: '',
    },
    url: baseURL,
    timeout: 180_000,
    reuseExistingServer: false,
  },
})
