// We sometimes need to use interface to extend existing types,
// so we disable both rules for consistency in this file.
// oxlint-disable typescript/consistent-type-definitions, typescript/consistent-indexed-object-style
import type messages from '@/i18n/messages/en.json'
import type { routing } from '@/i18n/routing'

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
