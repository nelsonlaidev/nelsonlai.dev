import { defineConfig } from '@nelsonlaidev/oxlint-config'

export default defineConfig(
  {
    overrides: [
      {
        files: ['src/components/ui/*.fixture.tsx'],
        plugins: ['nextjs'],
        rules: {
          'nextjs/no-html-link-for-pages': 'off',
        },
      },
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
  },
  {
    tailwindcss: {
      entryPoint: 'src/styles/globals.css',
      rootFontSize: 16,
      ignore: ['not-prose', 'shiki', 'toaster'],
    },
    playwright: {
      files: [`src/tests/e2e/**/*.test.{ts,tsx}`],
      assertFunctionNames: ['a11y', 'checkAppliedTheme', 'checkStoredTheme'],
    },
    vitest: {
      files: [`src/tests/unit/**/*.test.{ts,tsx}`],
    },
  },
)
