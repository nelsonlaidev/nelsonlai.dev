import { describe, expect, test } from 'vitest'

import { routing } from '@/i18n/routing'
import { flattenKeys, loadMessages } from '@/i18n/utils'

describe('i18n messages', () => {
  const nonDefaultLocales = routing.locales.filter((locale) => locale !== routing.defaultLocale)

  test.each(nonDefaultLocales)('%s matches keys with default locale', async (locale) => {
    expect.assertions(2)

    const defaultMessages = await loadMessages(routing.defaultLocale)
    const defaultKeys = flattenKeys(defaultMessages)

    const messages = await loadMessages(locale)
    const messageKeys = flattenKeys(messages)

    // Check if all default keys exist in current locale
    expect(messageKeys).toStrictEqual(expect.arrayContaining(defaultKeys))

    // Check if all locale keys exist in default
    expect(defaultKeys).toStrictEqual(expect.arrayContaining(messageKeys))
  })
})
