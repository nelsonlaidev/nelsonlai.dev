import './src/tests/env'

import contentCollections from '@content-collections/vite'
import { mdx } from '@repo/mdx'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Dev/build generates the collections; unit tests only need the official import alias.
  plugins: [contentCollections({ isEnabled: () => false }), mdx(), react()],
  resolve: {
    alias: {
      '@': new URL('src', import.meta.url).pathname,
      '@messages': new URL('messages', import.meta.url).pathname,
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
