import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig(
  {
    tailwindEntryPoint: './src/styles/globals.css',
    overrides: {
      tailwindcss: {
        'better-tailwindcss/no-unregistered-classes': ['error', { ignore: ['not-prose', 'toaster'] }]
      }
    }
  },
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      // They are OK in UI components
      'jsx-a11y/prefer-tag-over-role': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'sonarjs/table-header': 'off',
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off'
    }
  }
)
