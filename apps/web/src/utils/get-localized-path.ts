import { routing } from '@repo/i18n/routing'

import { getBaseUrl } from './get-base-url'

type LocalizedDocument = {
  locale: string
  pathname?: string
}

export const getLocalizedPath = (doc: LocalizedDocument) => {
  const { locale, pathname = '' } = doc
  const baseUrl = getBaseUrl()

  const localePath = locale === routing.defaultLocale ? baseUrl : `${baseUrl}/${locale}`

  return `${localePath}${pathname}`
}
