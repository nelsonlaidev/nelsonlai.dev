import type { MetaDescriptor } from '@tanstack/react-router'
import type { Locale } from '@/paraglide/runtime'

import { ENV } from '@/env'
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime'

import { SITE } from './site'

type SeoHeadOptions = {
  /** Use null for the site name without a page title suffix. */
  title: string | null
  description: string
  pathname: `/${string}`
  locale: Locale
  image?: string
  jsonLd?: Extract<MetaDescriptor, { 'script:ld+json': unknown }>['script:ld+json']
} & ({ type?: 'website' } | { type: 'article'; publishedAt: string; updatedAt?: string })

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  'zh-TW': 'zh_TW',
  'zh-CN': 'zh_CN',
  ja: 'ja_JP',
  es: 'es_ES',
  'pt-BR': 'pt_BR',
}

// Resolve site paths to absolute, localized URLs for metadata and structured data.
export function getLocalizedUrl(pathname: `/${string}`, locale: Locale) {
  return localizeUrl(new URL(pathname, ENV.SITE_URL), { locale }).href
}

export function createSeoHead(options: SeoHeadOptions) {
  const { title, description, pathname, locale, image, jsonLd } = options
  const pageTitle = title === null ? SITE.name : `${title} | ${SITE.name}`
  const canonical = getLocalizedUrl(pathname, locale)
  const imageUrl = image ? new URL(image, ENV.SITE_URL).href : undefined

  const meta: MetaDescriptor[] = [
    { title: pageTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: options.type ?? 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:locale', content: OPEN_GRAPH_LOCALES[locale] },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: description },
  ]

  if (imageUrl) {
    meta.push({ property: 'og:image', content: imageUrl }, { name: 'twitter:image', content: imageUrl })
  }

  if (options.type === 'article') {
    meta.push({ property: 'article:published_time', content: options.publishedAt })

    if (options.updatedAt) {
      meta.push({ property: 'article:modified_time', content: options.updatedAt })
    }
  }

  if (jsonLd) {
    meta.push({ 'script:ld+json': jsonLd })
  }

  return {
    meta,
    links: [
      { rel: 'canonical', href: canonical },
      { rel: 'alternate', hrefLang: 'x-default', href: getLocalizedUrl(pathname, baseLocale) },
      ...locales.map((alternateLocale) => ({
        rel: 'alternate',
        hrefLang: alternateLocale,
        href: getLocalizedUrl(pathname, alternateLocale),
      })),
    ],
  }
}
