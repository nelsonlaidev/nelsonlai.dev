import { notFound } from 'next/navigation'
import * as rootParams from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'
import { loadMessages } from './utils'

export default getRequestConfig(async ({ locale }) => {
  let resolvedLocale = locale

  if (!resolvedLocale) {
    const paramValue = await rootParams.locale()

    if (!hasLocale(routing.locales, paramValue)) {
      notFound()
    }

    resolvedLocale = paramValue
  }

  const messages = await loadMessages(resolvedLocale)

  return {
    locale: resolvedLocale,
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
