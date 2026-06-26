import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { FilteredPosts } from '@/components/filtered-posts'
import { JsonLd } from '@/components/json-ld'
import { PageHeader } from '@/components/page-header'
import { getLatestPosts, getSite } from '@/lib/content'
import { createJsonLdCollectionPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const page = getSite('blog', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/blog',
    openGraphImage: page.opengraphImage.url,
    locale: locale as Locale,
  })
}

function Page(props: PageProps<'/[locale]/blog'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const page = getSite('blog', locale)
  const url = getLocalizedPath('/blog', locale as Locale)

  if (!page) notFound()

  const { title, description } = page

  const posts = getLatestPosts(locale)

  const jsonLd = createJsonLdCollectionPage({
    id: url,
    title,
    description,
    url,
    locale: locale as Locale,
    items: posts.map((post, index) => ({
      '@type': 'BlogPosting' as const,
      headline: post.title,
      url: `${url}/${post.slug}`,
      datePublished: post.date,
      dateModified: post.lastModified,
      position: index + 1,
    })),
  })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <FilteredPosts posts={posts} />
    </>
  )
}

export default Page
