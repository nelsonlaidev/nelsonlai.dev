import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    // PostCSS is already installed under Next.js
    'postcss',
    // Used in Spotify router
    '@types/spotify-api'
  ],
  ignore: ['src/components/ui/*.tsx'],
  entry: ['content-collections.ts', 'src/db/reset.ts', 'src/db/seed.ts']
}

export default config
