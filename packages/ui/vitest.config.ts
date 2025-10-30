import { defineConfig } from 'vitest/config'

const resolve = (path: string) => new URL(path, import.meta.url).pathname

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  }
})
