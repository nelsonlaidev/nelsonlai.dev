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
        ignore: ['./schemas', '../../../../cosmos.imports', 'recharts'],
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
          patterns: [
            {
              group: ['**/routing', '@/i18n/routing'],
              importNames: ['Link'],
              message: 'Please use `@/components/ui/link` instead.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "ImportDeclaration[source.value='lucide-react'] > ImportSpecifier[imported.name!=/Icon$/]",
          message: "Always use the 'Icon' suffixed version (e.g., 'HomeIcon' instead of 'Home').",
        },
        {
          selector: "ImportDeclaration[source.value='lucide-react'] > ImportSpecifier[imported.name=/^Loader2?Icon$/]",
          message:
            "Do not use LoaderIcon or Loader2Icon from lucide-react. Use the <Spinner /> component from '@/components/ui/spinner' instead.",
        },
        {
          selector: "ImportDeclaration[source.value='lucide-react'] > ImportSpecifier[imported.name='TrashIcon']",
          message: "Use 'Trash2Icon' instead of 'TrashIcon' for better visual consistency.",
        },
        {
          selector:
            "CallExpression[callee.name='buttonVariants']:not(CallExpression[callee.name='cn'] CallExpression[callee.name='buttonVariants'])",
          message:
            "Always wrap 'buttonVariants()' calls inside the 'cn()' utility to ensure Tailwind classes merge correctly.",
        },
      ],
    },
  },
  {
    files: ['src/components/ui/*.fixture.tsx'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
)
