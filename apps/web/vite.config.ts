import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

import contentCollections from '@content-collections/vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { varlockVitePlugin } from '@varlock/vite-integration'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, esmExternalRequirePlugin } from 'vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // Keep CJS React consumers on the renderer's bundled React instance during SSR.
    // Remove after upgrading to a Nitro release containing https://github.com/nitrojs/nitro/pull/4889
    // and verifying production SSR. See https://github.com/nitrojs/nitro/issues/4171.
    {
      name: 'ssr-react-require-compat',
      apply: 'build',
      applyToEnvironment(environment) {
        return environment.name === 'ssr' ? esmExternalRequirePlugin({ external: ['react'] }) : false
      },
    },
    varlockVitePlugin(),
    {
      name: 'content-collections-cache',
      async config() {
        // Content Collections excludes external packages from its configuration checksum.
        const cacheDirectory = new URL('.content-collections/cache/', import.meta.url)
        const fingerprintFile = new URL('mdx-plugins.hash', cacheDirectory)
        const fingerprint = createHash('sha256')
          .update(await readFile(new URL(import.meta.resolve('@repo/mdx-plugins'))))
          .update(await readFile(new URL('../../pnpm-lock.yaml', import.meta.url)))
          .digest('hex')

        if (existsSync(fingerprintFile) && (await readFile(fingerprintFile, 'utf-8')) === fingerprint) return

        await rm(cacheDirectory, { recursive: true, force: true })
        await mkdir(cacheDirectory, { recursive: true })
        await writeFile(fingerprintFile, fingerprint)
      },
    },
    contentCollections(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      outputStructure: 'message-modules',
      emitTsDeclarations: true,
      cookieName: 'PARAGLIDE_LOCALE',
      strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
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
      traceDeps: ['takumi-js', '@takumi-rs/core*'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
