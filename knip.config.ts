import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'apps/web': {
      entry: ['content-collections.ts'],
    },
  },
}

export default config
