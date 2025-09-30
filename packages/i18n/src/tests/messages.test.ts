import { describe, expect, test } from 'vitest'

import { routing } from '../routing'
import { flattenKeys, loadMessages } from '../utils'

describe('i18n messages', () => {
  test('matches keys across all languages', async () => {
    const defaultMessages = await loadMessages(routing.defaultLocale)
    const defaultKeys = flattenKeys(defaultMessages)

    for (const locale of routing.locales) {
      if (locale === routing.defaultLocale) continue

      const messages = await loadMessages(locale)
      const messageKeys = flattenKeys(messages)

      // Check if all default keys exist in current locale
      for (const key of defaultKeys) {
        expect(messageKeys).toContain(key)
      }

      // Check if all locale keys exist in default
      for (const key of messageKeys) {
        expect(defaultKeys).toContain(key)
      }
    }
  })
})
