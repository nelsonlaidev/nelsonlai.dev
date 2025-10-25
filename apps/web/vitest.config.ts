import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const resolve = (path: string) => new URL(path, import.meta.url).pathname

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
        inline: ['next-intl']
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  }
})
