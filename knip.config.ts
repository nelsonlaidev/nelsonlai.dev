import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    // PostCSS is already installed under Next.js
    'postcss',
    // Required by react-email
    '@react-email/preview-server',
  ],
  ignore: [
    'src/components/ui/*.{ts,tsx}',
    // Remove spotify now playing temporarily until we have a premium account to fetch the data
    'src/components/layout/now-playing.tsx',
    'src/hooks/queries/stats.query.ts',
  ],
  entry: ['content-collections.ts', 'src/db/reset.ts', 'src/db/seed.ts'],
}

export default config
