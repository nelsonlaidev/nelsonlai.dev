import contentCollections from '@content-collections/vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    contentCollections(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      outputStructure: 'message-modules',
      cookieName: 'PARAGLIDE_LOCALE',
      strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
      urlPatterns: [
        {
          pattern: '/',
          localized: [
            ['en', '/'],
            ['zh-TW', '/zh-TW'],
          ],
        },
        {
          pattern: '/:path(.*)?',
          localized: [
            ['zh-TW', '/zh-TW/:path(.*)?'],
            ['en', '/:path(.*)?'],
          ],
        },
      ],
    }),
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
