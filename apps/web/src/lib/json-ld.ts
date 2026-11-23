import type { Project } from 'content-collections'
import type {
  AboutPage,
  BlogPosting,
  CollectionPage,
  ListItem,
  Person,
  SoftwareApplication,
  SoftwareSourceCode,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts'
import type { Locale } from '@/paraglide/runtime'

import { ENV } from '@/env'

import { getLocalizedUrl, getOgImageUrl } from './seo'
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

const webSiteUrl = new URL('/', ENV.SITE_URL).href
const webSite = {
  '@type': 'WebSite',
  '@id': `${webSiteUrl}#website`,
  name: SITE.name,
  url: webSiteUrl,
} satisfies WebSite

type JsonLdWebSiteOptions = {
  description: string
  locale: Locale
}

type JsonLdPageOptions = JsonLdWebSiteOptions & {
  pathname: `/${string}`
}

type JsonLdWebPageOptions = JsonLdPageOptions & {
  title: string
}

type JsonLdBlogPostingOptions = JsonLdPageOptions & {
  headline: string
  image?: `/${string}`
  datePublished: string
  dateModified?: string
}

type JsonLdProjectOptions = JsonLdPageOptions &
  Pick<Project, 'schemaType' | 'license' | 'programmingLanguages' | 'dateCreated'> & {
    name: string
    codeRepository?: string
  }

type JsonLdCollectionPageOptions = JsonLdWebPageOptions & {
  items: Array<Omit<ListItem, '@type' | 'position'>>
}

export function createJsonLdWebSite(options: JsonLdWebSiteOptions): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    ...webSite,
    description: options.description,
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
    image: options.image
      ? getLocalizedUrl(options.image, options.locale)
      : getOgImageUrl(options.pathname, options.locale),
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    author: person,
    publisher: person,
    inLanguage: options.locale,
  }
}

export function createJsonLdProject(
  options: JsonLdProjectOptions,
): WithContext<SoftwareSourceCode | SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': options.schemaType,
    name: options.name,
    description: options.description,
    url: getLocalizedUrl(options.pathname, options.locale),
    ...(options.license && { license: options.license }),
    ...(options.schemaType === 'SoftwareSourceCode' && {
      ...(options.codeRepository && { codeRepository: options.codeRepository }),
      ...(options.programmingLanguages && { programmingLanguage: options.programmingLanguages }),
    }),
    dateCreated: options.dateCreated,
    author: createJsonLdPerson(),
    thumbnailUrl: getOgImageUrl(options.pathname, options.locale),
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
