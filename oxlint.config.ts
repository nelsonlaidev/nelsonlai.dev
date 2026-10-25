import { defineConfig, react, tailwindcss } from '@nelsonlaidev/oxlint-config'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'

export default defineConfig({
  overrides: [
    react(),
    tailwindcss({
      rules: {
        'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['not-prose', 'shiki'] }],
      },
    }),
  ],
  settings: {
    'better-tailwindcss': {
      cwd: './packages/ui',
      entryPoint: './src/styles/globals.css',
      selectors: [
        ...getDefaultSelectors(),
        {
          kind: 'variable',
          name: '^WORDS$',
          match: [{ type: 'objectValues', path: '^\\[\\d+\\]\\.className$' }],
        },
      ],
    },
  },
})
