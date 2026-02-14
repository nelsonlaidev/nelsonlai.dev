import type messages from '@/i18n/messages/en.json'
import type { routing } from '@/i18n/routing'

import '@total-typescript/ts-reset'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}

declare module 'mdast' {
  interface Data {
    hProperties?: {
      id?: string
    }
  }
}
