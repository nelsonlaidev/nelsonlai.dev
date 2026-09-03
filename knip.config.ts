import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['src/components/ui/*.{ts,tsx}'],
  entry: ['content-collections.ts'],
}

export default config
