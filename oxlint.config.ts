import { defineConfig, nextjs, playwright, react, tailwindcss, vitest } from '@nelsonlaidev/oxlint-config'

export default defineConfig({
  settings: {
    'better-tailwindcss': {
      entryPoint: 'src/styles/globals.css',
    },
  },
  overrides: [
    react(),
    nextjs(),
    tailwindcss({
      rules: {
        'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['not-prose', 'shiki', 'toaster'] }],
      },
    }),
    playwright({
      files: [`src/tests/e2e/**/*.test.{ts,tsx}`],
      rules: {
        'playwright/expect-expect': [
          'error',
          {
            assertFunctionNames: ['a11y', 'checkAppliedTheme', 'checkStoredTheme'],
          },
        ],
      },
    }),
    vitest({
      files: [`src/tests/unit/**/*.test.{ts,tsx}`],
    }),
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@tanstack/react-table',
                importNames: ['useReactTable'],
                message: 'Please use the custom hook from `@/hooks/use-react-table` instead.',
              },
            ],
          },
        ],
      },
    },
  ],
  // },
})
