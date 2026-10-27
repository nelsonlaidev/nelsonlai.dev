import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { ENV } from '@/env'
import { getPage } from '@/features/pages/pages.functions'
import { FilteredPosts } from '@/features/posts/filtered-posts'
import { getPosts } from '@/features/posts/posts.functions'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/blog/')({
  loader: async () => {
    const locale = getLocale()
    const [page, posts] = await Promise.all([
      getPage({ data: { slug: 'blog', locale } }),
      getPosts({ data: { locale } }),
    ])

    if (!page) throw notFound()

    return { page, posts, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, posts, locale } = loaderData
    const url = getLocalizedUrl('/blog', locale)

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/blog',
      locale,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': url,
        name: page.title,
        description: page.description,
        url,
        inLanguage: locale,
        isPartOf: {
          '@type': 'WebSite',
          name: SITE.name,
          url: ENV.SITE_URL,
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'BlogPosting',
              headline: post.title,
              url: getLocalizedUrl(`/blog/${post.slug}`, locale),
              datePublished: post.publishedAt,
            },
          })),
        },
      },
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { page, posts, locale } = Route.useLoaderData()

  return (
    <>
      <PageHeader title={page.title} description={page.description} />
      <FilteredPosts key={locale} posts={posts} />
    </>
  )
}
