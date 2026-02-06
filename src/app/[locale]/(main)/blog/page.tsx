import type { Metadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { type Locale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import FilteredPosts from '@/components/filtered-posts'
import JsonLd from '@/components/json-ld'
import PageHeader from '@/components/page-header'
import { MY_NAME } from '@/lib/constants'
import { getLatestPosts } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.blog')
  const description = t('blog.description')

  return createMetadata({
    pathname: '/blog',
    title,
    description,
    locale,
  })
}

function Page(props: PageProps<'/[locale]/blog'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const title = t('common.labels.blog')
  const description = t('blog.description')
  const url = getLocalizedPath({ locale, pathname: '/blog' })

  const posts = getLatestPosts(locale)

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${url}/${post.slug}`,
        datePublished: post.date,
        dateModified: post.modifiedTime,
        position: index + 1,
      })),
    },
    isPartOf: {
      '@type': 'WebSite',
      name: MY_NAME,
      url: getBaseUrl(),
    },
    inLanguage: locale,
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <FilteredPosts posts={posts} />
    </>
  )
}

export default Page
