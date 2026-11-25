import contentCollections from '@content-collections/vite'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { varlockVitePlugin } from '@varlock/vite-integration'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

import { languageIconsPlugin } from './vite-plugins/language-icons.ts'
import { paraglidePlugin } from './vite-plugins/paraglide.ts'

const config = defineConfig({
  build: {
    // Keep fonts on the same origin rather than data URLs blocked by font-src 'self'.
    assetsInlineLimit(filePath) {
      return /\.(?:woff2?|ttf|otf|eot)$/.test(filePath) ? false : undefined
    },
  },
  resolve: { tsconfigPaths: true },
  ssr: {
    external: ['sharp'],
    // Bundle Bowser before Nitro generates a CommonJS facade with a missing module.exports export.
    noExternal: ['bowser'],
  },
  plugins: [
    languageIconsPlugin(),
    varlockVitePlugin(),
    contentCollections(),
    paraglidePlugin,
    devtools(),
    nitro({
      exportConditions: ['!unwasm'],
      routeRules: {
        '/**': {
          headers: {
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          },
        },
      },
      traceDeps: ['@takumi-rs/core*', 'sharp*'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({ compiler: true }),
  ],
})

export default config
