import { paraglideVitePlugin } from '@inlang/paraglide-js'

export const paraglidePlugin = paraglideVitePlugin({
  project: './project.inlang',
  outdir: './src/paraglide',
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
})
