import { defineConfig, GLOB_SRC_EXT } from '@nelsonlaidev/eslint-config'

export default defineConfig({
  tailwindEntryPoint: './src/styles/globals.css',
  playwrightGlob: `./src/tests/e2e/**/*.test.${GLOB_SRC_EXT}`,
  vitestGlob: `./src/tests/unit/**/*.test.${GLOB_SRC_EXT}`,
  overrides: {
    tailwindcss: {
      'better-tailwindcss/no-unregistered-classes': ['error', { ignore: ['not-prose', 'shiki'] }]
    },
    playwright: {
      'playwright/expect-expect': ['error', { assertFunctionNames: ['a11y', 'checkAppliedTheme', 'checkStoredTheme'] }]
    },
    javascript: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/navigation',
              importNames: ['usePathname', 'useRouter', 'redirect', 'permanentRedirect'],
              message: 'Please use `@repo/i18n/routing` instead.'
            },
            {
              name: 'next/link',
              importNames: ['default'],
              message: 'Please use `@repo/ui/components/link` instead.'
            }
          ],
          patterns: [
            {
              regex: String.raw`\.content-collections\/generated`,
              message: 'Please use `@/lib/content` instead.'
            }
          ]
        }
      ]
    }
  }
})
