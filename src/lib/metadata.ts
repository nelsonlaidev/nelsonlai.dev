import type { Metadata } from 'next'
import type { TemplateString } from 'next/dist/lib/metadata/types/metadata-types'
import type { Locale } from 'next-intl'

import { routing } from '@/i18n/routing'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

import {
  MY_NAME,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  TWITTER_USER_ID,
  TWITTER_USERNAME,
} from '../constants/site'

type RootMetadataOptions = {
  title: TemplateString
}

export function createRootMetadata(options: RootMetadataOptions): Metadata {
  const baseUrl = getBaseUrl()

  return {
    title: options.title,
    metadataBase: new URL(baseUrl),
  }
}

type PageMetadataOptions = {
  /** `null` to use the root layout default title. */
  title: string | null
  description: string
  canonical: string
  /** `null` to use `/images/banner.png`. */
  openGraphImage: string | null
  locale: Locale
  date?: string
  lastModified?: string
}

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const baseUrl = getBaseUrl()
  const localizedCanonical = getLocalizedPath(options.canonical, options.locale)
  const ogImageUrl = options.openGraphImage ?? '/images/banner.png'

  return {
    ...(options.title !== null && { title: options.title }),
    description: options.description,
    creator: MY_NAME,
    openGraph: {
      url: localizedCanonical,
      siteName: MY_NAME,
      type: options.date ? 'article' : 'website',
      locale: options.locale,
      images: {
        url: getLocalizedPath(ogImageUrl, options.locale),
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        type: OG_IMAGE_TYPE,
      },
      ...(options.date && { publishedTime: options.date }),
      ...(options.lastModified && { modifiedTime: options.lastModified }),
    },
    alternates: {
      canonical: localizedCanonical,
      languages: {
        'x-default': getLocalizedPath(options.canonical, routing.defaultLocale),
        ...Object.fromEntries(routing.locales.map((l) => [l, getLocalizedPath(options.canonical, l)])),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    authors: {
      name: MY_NAME,
      url: baseUrl,
    },
    twitter: {
      card: 'summary_large_image',
      siteId: TWITTER_USER_ID,
      creatorId: TWITTER_USER_ID,
      site: `@${TWITTER_USERNAME}`,
      creator: `@${TWITTER_USERNAME}`,
    },
    icons: {
      icon: [
        {
          url: '/favicon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          url: '/favicon.svg',
          type: 'image/svg+xml',
        },
      ],
      shortcut: '/favicon.ico',
      apple: {
        url: `/apple-touch-icon.png`,
        sizes: '180x180',
      },
    },
    manifest: '/site.webmanifest',
  }
}
