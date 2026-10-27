import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { getPage } from '@/features/pages/pages.functions'
import { FilteredPosts } from '@/features/posts/filtered-posts'
import { getPosts } from '@/features/posts/posts.functions'
import { createJsonLdCollectionPage } from '@/lib/json-ld'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
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

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/blog',
      locale,
      jsonLd: createJsonLdCollectionPage({
        title: page.title,
        description: page.description,
        pathname: '/blog',
        locale,
        items: posts.map((post) => ({
          item: {
            '@type': 'BlogPosting',
            headline: post.title,
            url: getLocalizedUrl(`/blog/${post.slug}`, locale),
            datePublished: post.publishedAt,
          },
        })),
      }),
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
