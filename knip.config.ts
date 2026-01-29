import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    // PostCSS is already installed under Next.js
    'postcss'
  ]
}

export default config
