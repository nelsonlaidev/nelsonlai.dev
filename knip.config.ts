import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    // PostCSS is already installed under Next.js
    'postcss',
    // Required by react-email
    '@react-email/preview-server',
    // Required by react-cosmos
    'react-cosmos-core',
  ],
  ignore: ['src/components/ui/*.tsx'],
  entry: ['content-collections.ts', 'src/db/reset.ts', 'src/db/seed.ts'],
}

export default config
