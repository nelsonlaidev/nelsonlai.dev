import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    'apps/web': {
      entry: ['content-collections.ts', 'src/server.ts', 'scripts/check-ssr.ts'],
    },
    'packages/mdx-plugins': {
      // Required by the VFile DataMap module augmentation in src/types.ts.
      ignoreDependencies: ['vfile'],
    },
  },
} satisfies KnipConfig
