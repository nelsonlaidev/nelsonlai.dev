import * as rootParams from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'
import { loadMessages } from './utils'

export default getRequestConfig(async () => {
  const paramValue = await rootParams.locale()

  const locale = hasLocale(routing.locales, paramValue) ? paramValue : routing.defaultLocale
  const messages = await loadMessages(locale)

  return {
    locale,
    messages,
    formats: {
      dateTime: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      },
    },
  }
})
