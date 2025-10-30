import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    // Knip can't detect it since we use `pnpm with-env` in front of it
    'tsx',
    // PostCSS is already installed under Next.js
    'postcss'
  ],
  workspaces: {
    'apps/web': {
      entry: [
        'content-collections.ts',
        'src/i18n/request.ts',
        'src/tests/e2e/**/*.setup.ts',
        'src/tests/e2e/**/*.teardown.ts'
      ],
      ignoreDependencies: [
        // Used in spotify.route.ts
        '@types/spotify-api'
      ]
    },
    'apps/docs': {
      entry: ['source.config.ts', 'src/components/demos/*.tsx']
    },
    'packages/db': {
      entry: ['src/reset.ts', 'src/seed.ts']
    },
    'packages/email': {
      ignoreDependencies: [
        // For tailwindcss intellisense
        'tailwindcss',
        // Required by react email
        '@react-email/preview-server',
        'react-dom'
      ],
      ignore: ['src/styles.css']
    },
    'packages/ui': {
      entry: ['src/scripts/shadcn.ts']
    }
  },
  // Credit to https://github.com/webpro-nl/knip/issues/1008#issuecomment-2756559038
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)(?:import|plugin)[^;]+/g)].join('\n').replace('plugin', 'import')
  }
}

export default config
