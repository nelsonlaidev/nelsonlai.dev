import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['src/components/ui/*.{ts,tsx}'],
  entry: ['content-collections.ts', 'src/db/reset.ts', 'src/db/seed.ts'],
}

export default config
