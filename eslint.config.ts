import { defineConfig, GLOB_SRC_EXT } from '@nelsonlaidev/eslint-config'

export default defineConfig(
  {
    tailwindcss: {
      entryPoint: './src/styles/globals.css',
      rootFontSize: 16,
      noUnknownClasses: {
        ignore: ['not-prose', 'shiki', 'toaster'],
      },
    },
    playwright: {
      files: [`src/tests/e2e/**/*.test.${GLOB_SRC_EXT}`],
      expectExpect: {
        assertFunctionNames: ['a11y', 'checkAppliedTheme', 'checkStoredTheme'],
      },
    },
    vitest: {
      files: [`src/tests/unit/**/*.test.${GLOB_SRC_EXT}`],
    },
    importX: {
      noNamespace: {
        ignore: ['./schemas'],
      },
    },
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/navigation',
              importNames: ['usePathname', 'useRouter', 'redirect', 'permanentRedirect'],
              message: 'Please use `@/i18n/routing` instead.',
            },
            {
              name: 'next/link',
              importNames: ['default'],
              message: 'Please use `@/components/ui/link` instead.',
            },
          ],
        },
      ],
    },
  },
)
