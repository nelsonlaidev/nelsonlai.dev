import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Suspense, use } from 'react'

import { BlogFooter } from '@/components/blog/blog-footer'
import { BlogHeader } from '@/components/blog/blog-header'
import { LikeButton } from '@/components/blog/like-button'
import { MobileTableOfContents } from '@/components/blog/mobile-table-of-contents'
import { ProgressBar } from '@/components/blog/progress-bar'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { CommentSection } from '@/components/comment-section'
import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { getPost, getPosts } from '@/lib/content'
import { createJsonLdBlogPosting } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export function generateStaticParams(): Array<{ slug: string; locale: string }> {
  return getPosts().map((post) => ({
    slug: post.slug,
    locale: post.locale,
  }))
}

export async function generateMetadata(props: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { params } = props
  const { slug, locale } = await params

  const post = getPost(slug, locale)

  if (!post) return {}

  return createPageMetadata({
    title: post.title,
    description: post.description,
    canonical: `/blog/${slug}`,
    openGraphImage: post.opengraphImage.url,
    locale: locale as Locale,
    date: post.date,
    lastModified: post.lastModified,
  })
}

function Page(props: PageProps<'/[locale]/blog/[slug]'>) {
  const { params } = props
  const { slug, locale } = use(params)

  setRequestLocale(locale as Locale)

  const post = getPost(slug, locale)
  const url = getLocalizedPath(`/blog/${slug}`, locale as Locale)

  if (!post) notFound()

  const jsonLd = createJsonLdBlogPosting({
    headline: post.title,
    description: post.description,
    url,
    image: getLocalizedPath(post.opengraphImage.url, locale as Locale),
    datePublished: post.date,
    dateModified: post.lastModified,
    locale: locale as Locale,
  })

  return (
    <>
      <JsonLd json={jsonLd} />

      <BlogHeader post={post} />

      <div className='mt-8 flex flex-col justify-between lg:flex-row'>
        <article className='w-full lg:max-w-2xl'>
          <Mdx code={post.code} />
        </article>
        <aside className='w-full lg:w-68'>
          <div className='sticky top-24'>
            {post.toc.length > 0 && <TableOfContents toc={post.toc} />}
            <LikeButton slug={slug} />
          </div>
        </aside>
      </div>
      <ProgressBar />

      {post.toc.length > 0 && <MobileTableOfContents toc={post.toc} />}
      <BlogFooter post={post} />

      <Suspense>
        <CommentSection slug={slug} />
      </Suspense>
    </>
  )
}

export default Page
