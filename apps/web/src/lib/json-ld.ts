import type {
  AboutPage,
  BlogPosting,
  CollectionPage,
  ListItem,
  Person,
  SoftwareSourceCode,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts'
import type { Locale } from '@/paraglide/runtime'

import { ENV } from '@/env'

import { getLocalizedUrl } from './seo'
import { SITE } from './site'

type JsonLdPersonOptions = {
  description?: string
  sameAs?: string[]
}

function createJsonLdPerson(options?: JsonLdPersonOptions): Person {
  return {
    '@type': 'Person',
    name: SITE.name,
    url: ENV.SITE_URL,
    ...(options?.description && { description: options.description }),
    ...(options?.sameAs && { sameAs: options.sameAs }),
  }
}

const webSite = {
  '@type': 'WebSite',
  name: SITE.name,
  url: ENV.SITE_URL,
} satisfies WebSite

type JsonLdWebSiteOptions = {
  description: string
  pathname: `/${string}`
  locale: Locale
}

type JsonLdWebPageOptions = JsonLdWebSiteOptions & {
  title: string
}

type JsonLdBlogPostingOptions = JsonLdWebSiteOptions & {
  headline: string
  image: `/${string}`
  datePublished: string
  dateModified?: string
}

type JsonLdSoftwareSourceCodeOptions = JsonLdWebSiteOptions & {
  name: string
  codeRepository: string
  dateCreated: string
  dateModified?: string
  slug: string
}

type JsonLdCollectionPageOptions = JsonLdWebPageOptions & {
  items: Array<Omit<ListItem, '@type' | 'position'>>
}

export function createJsonLdWebSite(options: JsonLdWebSiteOptions): WithContext<WebSite> {
  const url = getLocalizedUrl(options.pathname, options.locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': url,
    name: SITE.name,
    description: options.description,
    url,
    publisher: createJsonLdPerson({ sameAs: Object.values(SITE.socials) }),
    dateCreated: '2022-02-01T00:00:00Z',
    copyrightYear: new Date().getFullYear(),
    inLanguage: options.locale,
  }
}

export function createJsonLdWebPage(options: JsonLdWebPageOptions): WithContext<WebPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.title,
    description: options.description,
    url: getLocalizedUrl(options.pathname, options.locale),
    isPartOf: webSite,
    inLanguage: options.locale,
  }
}

export function createJsonLdAboutPage(options: JsonLdWebPageOptions): WithContext<AboutPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: options.title,
    description: options.description,
    url: getLocalizedUrl(options.pathname, options.locale),
    mainEntity: createJsonLdPerson({
      description: options.description,
      sameAs: Object.values(SITE.socials),
    }),
    inLanguage: options.locale,
  }
}

export function createJsonLdBlogPosting(options: JsonLdBlogPostingOptions): WithContext<BlogPosting> {
  const person = createJsonLdPerson()

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: options.headline,
    description: options.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getLocalizedUrl(options.pathname, options.locale),
    },
    image: getLocalizedUrl(options.image, options.locale),
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    author: person,
    publisher: person,
    inLanguage: options.locale,
  }
}

export function createJsonLdSoftwareSourceCode(
  options: JsonLdSoftwareSourceCodeOptions,
): WithContext<SoftwareSourceCode> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: options.name,
    description: options.description,
    url: getLocalizedUrl(options.pathname, options.locale),
    codeRepository: options.codeRepository,
    license: 'https://opensource.org/licenses/MIT',
    programmingLanguage: 'TypeScript',
    dateCreated: options.dateCreated,
    dateModified: options.dateModified,
    author: createJsonLdPerson(),
    thumbnailUrl: new URL(`/images/projects/${options.slug}/cover.png`, ENV.SITE_URL).href,
    inLanguage: options.locale,
  }
}

export function createJsonLdCollectionPage(options: JsonLdCollectionPageOptions): WithContext<CollectionPage> {
  const url = getLocalizedUrl(options.pathname, options.locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: options.title,
    description: options.description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: options.items.map((item, index) => ({
        ...item,
        '@type': 'ListItem',
        position: index + 1,
      })),
    },
    isPartOf: webSite,
    inLanguage: options.locale,
  }
}
