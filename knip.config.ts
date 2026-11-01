import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    'apps/web': {
      // Content Collections loads its configuration through the Vite plugin.
      entry: ['content-collections.ts'],
    },
  },
} satisfies KnipConfig
