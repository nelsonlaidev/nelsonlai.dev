import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

function resolve(path: string) {
  return new URL(path, import.meta.url).pathname
}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/unit/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**'],
    setupFiles: ['./src/tests/unit/setup.ts'],
    server: {
      deps: {
        // https://github.com/vercel/next.js/issues/77200
        inline: ['next-intl'],
      },
    },
    coverage: {
      reporter: ['lcov', 'html'],
      provider: 'v8',
      include: ['**/src/**/*.{ts,tsx}'],
      exclude: ['**/tests/**', '**/e2e/**', '**/fixtures/**'],
    },
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
      'content-collections': resolve('.content-collections/generated'),
    },
  },
})
