import 'varlock/auto-load'

import { defineConfig, devices } from '@playwright/test'

import { ENV } from './src/env'

const port = '3000'
const baseURL = `http://localhost:${port}`
const preview = `env -u __VARLOCK_ENV pnpm preview --host localhost --port ${port} --strictPort`

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: false,
  forbidOnly: ENV.CI,
  retries: ENV.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
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
    command: ENV.CI ? preview : `env -u __VARLOCK_ENV pnpm build && ${preview}`,
    url: baseURL,
    timeout: 180_000,
    reuseExistingServer: false,
    env: {
      NODE_ENV: 'production',
      BETTER_AUTH_URL: baseURL,
      DISCORD_WEBHOOK_URL: '',
      AUTHOR_EMAIL: '',
      RESEND_API_KEY: '',
    },
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
})
