import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig({
  tailwindEntryPoint: './src/styles/main.css',
  nextjs: false,
  overrides: {
    tailwindcss: {
      'better-tailwindcss/no-unregistered-classes': ['error', { ignore: ['not-prose', 'toaster'] }]
    },
    sonarjs: {
      'sonarjs/table-header': 'off'
    },
    react: {
      // They are OK in UI components
      'jsx-a11y/prefer-tag-over-role': 'off'
    }
  }
})
