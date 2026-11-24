import contentCollections from '@content-collections/vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { varlockVitePlugin } from '@varlock/vite-integration'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

import { languageIconsPlugin } from './vite-plugins/language-icons.ts'

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
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      outputStructure: 'message-modules',
      emitTsDeclarations: true,
      cookieName: 'PARAGLIDE_LOCALE',
      strategy: ['cookie', 'preferredLanguage', 'url', 'baseLocale'],
      routeStrategies: [
        { match: '/api/:path(.*)?', exclude: true },
        { match: '/robots.txt', exclude: true },
        { match: '/sitemap.xml', exclude: true },
        { match: '/rss.xml', strategy: ['baseLocale'] },
        {
          match: '/:locale(zh-TW|zh-CN|ja|es|pt-BR){/:path(.*)}?',
          strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
        },
      ],
      urlPatterns: [
        {
          pattern: '/',
          localized: [
            ['en', '/'],
            ['zh-TW', '/zh-TW'],
            ['zh-CN', '/zh-CN'],
            ['ja', '/ja'],
            ['es', '/es'],
            ['pt-BR', '/pt-BR'],
          ],
        },
        {
          pattern: '/:path(.*)?',
          localized: [
            ['zh-TW', '/zh-TW/:path(.*)?'],
            ['zh-CN', '/zh-CN/:path(.*)?'],
            ['ja', '/ja/:path(.*)?'],
            ['es', '/es/:path(.*)?'],
            ['pt-BR', '/pt-BR/:path(.*)?'],
            ['en', '/:path(.*)?'],
          ],
        },
      ],
    }),
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
