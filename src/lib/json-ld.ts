import type {
  AboutPage,
  BlogPosting,
  CollectionPage,
  Person,
  SoftwareSourceCode,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts'

import {
  MY_NAME,
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_TWITTER_URL,
  SITE_YOUTUBE_URL,
} from '@/constants/site'
import { getBaseUrl } from '@/utils/get-base-url'

const ALL_SAME_AS = [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_TWITTER_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL]

type JsonLdPersonOptions = {
  description?: string
  sameAs?: string[]
}

function createJsonLdPerson(options?: JsonLdPersonOptions): Person {
  return {
    '@type': 'Person',
    name: MY_NAME,
    url: getBaseUrl(),
    ...(options?.description && { description: options.description }),
    ...(options?.sameAs && { sameAs: options.sameAs }),
  }
}

function createJsonLdWebSiteRef(): WebSite {
  return {
    '@type': 'WebSite',
    name: MY_NAME,
    url: getBaseUrl(),
  }
}

export type JsonLdWebSiteOptions = {
  description: string
  url: string
  locale: string
}

export function createJsonLdWebSite(options: JsonLdWebSiteOptions): WithContext<WebSite> {
  const baseUrl = getBaseUrl()
  const fullUrl = `${baseUrl}${options.url}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': fullUrl,
    name: MY_NAME,
    description: options.description,
    url: fullUrl,
    publisher: createJsonLdPerson({ sameAs: ALL_SAME_AS }),
    dateCreated: '2022-02-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    copyrightYear: new Date().getFullYear(),
    inLanguage: options.locale,
  }
}

export type JsonLdWebPageOptions = {
  title: string
  description: string
  url: string
  locale: string
}

export function createJsonLdWebPage(options: JsonLdWebPageOptions): WithContext<WebPage> {
  const baseUrl = getBaseUrl()
  const fullUrl = `${baseUrl}${options.url}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.title,
    description: options.description,
    url: fullUrl,
    isPartOf: createJsonLdWebSiteRef(),
    inLanguage: options.locale,
  }
}

export type JsonLdAboutPageOptions = {
  title: string
  description: string
  url: string
  siteDescription: string
  locale: string
}

export function createJsonLdAboutPage(options: JsonLdAboutPageOptions): WithContext<AboutPage> {
  const baseUrl = getBaseUrl()
  const fullUrl = `${baseUrl}${options.url}`

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: options.title,
    description: options.description,
    url: fullUrl,
    mainEntity: createJsonLdPerson({ description: options.siteDescription, sameAs: ALL_SAME_AS }),
    inLanguage: options.locale,
  }
}

export type JsonLdBlogPostingOptions = {
  headline: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified: string
  locale: string
}

export function createJsonLdBlogPosting(options: JsonLdBlogPostingOptions): WithContext<BlogPosting> {
  const baseUrl = getBaseUrl()
  const fullUrl = `${baseUrl}${options.url}`
  const fullImageUrl = `${baseUrl}${options.image}`
  const person = createJsonLdPerson()

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: options.headline,
    description: options.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    image: fullImageUrl,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    author: person,
    publisher: person,
    inLanguage: options.locale,
  }
}

export type JsonLdSoftwareSourceCodeOptions = {
  name: string
  description: string
  url: string
  codeRepository: string
  dateCreated: string
  dateModified: string
  slug: string
  locale: string
}

export function createJsonLdSoftwareSourceCode(
  options: JsonLdSoftwareSourceCodeOptions,
): WithContext<SoftwareSourceCode> {
  const baseUrl = getBaseUrl()
  const fullUrl = `${baseUrl}${options.url}`

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: options.name,
    description: options.description,
    url: fullUrl,
    codeRepository: options.codeRepository,
    license: 'https://opensource.org/licenses/MIT',
    programmingLanguage: 'TypeScript',
    dateCreated: options.dateCreated,
    dateModified: options.dateModified,
    author: createJsonLdPerson(),
    thumbnailUrl: `${baseUrl}/images/projects/${options.slug}/cover.png`,
    inLanguage: options.locale,
  }
}

export type JsonLdCollectionPageOptions<T extends { '@type': string; url: string }> = {
  id: string
  title: string
  description: string
  url: string
  locale: string
  items: Array<T & { position: number }>
}

export function createJsonLdCollectionPage<T extends { '@type': string; url: string }>(
  options: JsonLdCollectionPageOptions<T>,
): WithContext<CollectionPage> {
  const baseUrl = getBaseUrl()
  const fullUrl = `${baseUrl}${options.url}`

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}${options.id}`,
    name: options.title,
    description: options.description,
    url: fullUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: options.items.map((item) => ({
        ...item,
        url: `${baseUrl}${item.url}`,
      })),
    },
    isPartOf: createJsonLdWebSiteRef(),
    inLanguage: options.locale,
  } as WithContext<CollectionPage>
}
