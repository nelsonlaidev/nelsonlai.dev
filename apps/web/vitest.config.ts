import './src/tests/env'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('src', import.meta.url).pathname,
      '@messages': new URL('messages', import.meta.url).pathname,
      'content-collections': new URL('.content-collections/generated/index.js', import.meta.url).pathname,
    },
  },
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
