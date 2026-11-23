import 'varlock/auto-load'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import { languageIconsPlugin } from './vite-plugins/language-icons.ts'

export default defineConfig({
  plugins: [languageIconsPlugin(), react()],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/tests/unit/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/tests/**', 'src/paraglide/**', 'src/routeTree.gen.ts'],
    },
  },
})
