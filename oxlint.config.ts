import { defineConfig, paraglide, playwright, react, tailwindcss, vitest } from '@nelsonlaidev/oxlint-config'

export default defineConfig({
  overrides: [
    react(),
    tailwindcss({
      rules: {
        'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['not-prose', 'shiki'] }],
      },
    }),
    playwright({
      files: ['apps/web/src/tests/e2e/**/*.test.{ts,tsx}'],
      rules: {
        'playwright/expect-expect': ['error', { assertFunctionNames: ['a11y'] }],
      },
    }),
    vitest({
      files: ['apps/web/src/tests/unit/**/*.test.{ts,tsx}'],
    }),
    paraglide(),
  ],
  settings: {
    'better-tailwindcss': {
      cwd: './packages/ui',
      entryPoint: './src/styles/globals.css',
    },
  },
})
