import react from '@vitejs/plugin-react'
import { mergeConfig } from 'vitest/config'

import { sharedProjectConfig } from '../../vitest.shared'

const resolve = (path: string) => new URL(path, import.meta.url).pathname

export default mergeConfig(sharedProjectConfig, {
  plugins: [react()],
  test: {
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
