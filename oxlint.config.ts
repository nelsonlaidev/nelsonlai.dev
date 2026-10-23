import { defineConfig, react, tailwindcss } from '@nelsonlaidev/oxlint-config'

export default defineConfig({
  overrides: [react(), tailwindcss()],
  settings: {
    'better-tailwindcss': {
      cwd: './packages/ui',
      entryPoint: './src/styles/globals.css',
    },
  },
})
