import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        // https://github.com/vercel/next.js/issues/77200
        inline: ['next-intl']
      }
    }
  }
})
