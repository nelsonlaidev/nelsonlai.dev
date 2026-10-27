import type { MetaDescriptor } from '@tanstack/react-router'
import type { Thing, WithContext } from 'schema-dts'
import type { Locale } from '@/paraglide/runtime'

import { ENV } from '@/env'
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime'

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from './og'
import { SITE } from './site'

type SeoHeadOptions = {
  /** Use null for the site name without a page title suffix. */
  title: string | null
  description: string
  pathname: `/${string}`
  locale: Locale
  jsonLd?: WithContext<Thing>
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

export function createPrivateSeoHead(options: Pick<SeoHeadOptions, 'title' | 'description' | 'pathname' | 'locale'>) {
  const { title, description, pathname, locale } = options

  return {
    meta: [
      { title: title === null ? SITE.name : `${title} | ${SITE.name}` },
      { name: 'description', content: description },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    ],
    links: [{ rel: 'canonical', href: getLocalizedUrl(pathname, locale) }],
  }
}

export function createSeoHead(options: SeoHeadOptions) {
  const { title, description, pathname, locale, jsonLd } = options
  const pageTitle = title === null ? SITE.name : `${title} | ${SITE.name}`
  const canonicalUrl = getLocalizedUrl(pathname, locale)
  const imagePath = `/og${pathname === '/' ? '' : pathname}/image.webp` as const
  const imageUrl = getLocalizedUrl(imagePath, locale)

  const meta: MetaDescriptor[] = [
    { title: pageTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: options.type ?? 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:locale', content: OPEN_GRAPH_LOCALES[locale] },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:type', content: 'image/webp' },
    { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
    { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

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
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hrefLang: 'x-default', href: getLocalizedUrl(pathname, baseLocale) },
      ...locales.map((alternateLocale) => ({
        rel: 'alternate',
        hrefLang: alternateLocale,
        href: getLocalizedUrl(pathname, alternateLocale),
      })),
    ],
  }
}
