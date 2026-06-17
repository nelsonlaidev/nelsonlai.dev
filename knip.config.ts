import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    // Knip can't detect it since we added "bun with-env" before the scripts
    'tsx',
  ],
  ignore: ['src/components/ui/*.{ts,tsx}'],
  entry: ['content-collections.ts', 'src/db/reset.ts', 'src/db/seed.ts'],
}

export default config
