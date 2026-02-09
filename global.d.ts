import type messages from '@/i18n/messages/en.json'
import type { routing } from '@/i18n/routing'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- It must be an interface
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
