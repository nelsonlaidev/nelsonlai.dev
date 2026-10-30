import { createFileRoute, notFound } from '@tanstack/react-router'

import { getPage } from '@/features/pages/pages.functions'
import { BlogError, BlogLayout, BlogPending } from '@/features/posts/blog-layout'
import { FilteredPosts } from '@/features/posts/filtered-posts'
import { getPosts } from '@/features/posts/posts.functions'
import { createJsonLdCollectionPage } from '@/lib/json-ld'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { m } from '@/paraglide/messages'
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
  pendingComponent: BlogPending,
  errorComponent: BlogError,
  component: RouteComponent,
})

function RouteComponent() {
  const { page, posts, locale } = Route.useLoaderData()

  return (
    <BlogLayout>
      <header className='mb-18.75 max-[601px]:mb-12.5'>
        <span className='mb-6 block text-xs leading-[normal] tracking-[normal] text-[#b4cec4]'>02 / {page.title}</span>
        <h1 className='text-[clamp(48px,5.8vw,86px)] leading-[1.04] font-[420] tracking-[-0.065em]'>{page.title}</h1>
        <p className='mt-7 max-w-150 text-lg/[1.65] whitespace-pre-line text-[#b1cbc4]'>{m.ocean_blog_intro()}</p>
      </header>
      <FilteredPosts key={locale} posts={posts} />
    </BlogLayout>
  )
}
