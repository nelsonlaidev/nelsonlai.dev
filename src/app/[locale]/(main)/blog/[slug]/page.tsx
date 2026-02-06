import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import type { BlogPosting, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Suspense, use } from 'react'

import BlogFooter from '@/components/blog/blog-footer'
import BlogHeader from '@/components/blog/blog-header'
import LikeButton from '@/components/blog/like-button'
import MobileTableOfContents from '@/components/blog/mobile-table-of-contents'
import ProgressBar from '@/components/blog/progress-bar'
import TableOfContents from '@/components/blog/table-of-contents'
import CommentSection from '@/components/comment-section'
import JsonLd from '@/components/json-ld'
import Mdx from '@/components/mdx'
import { MY_NAME } from '@/lib/constants'
import { getPostBySlug } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export function generateStaticParams(): Array<{ slug: string; locale: string }> {
  return allPosts.map((post) => ({
    slug: post.slug,
    locale: post.locale,
  }))
}

export async function generateMetadata(props: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { params } = props
  const { slug, locale } = await params

  const post = getPostBySlug(locale, slug)

  if (!post) return {}

  return createMetadata({
    pathname: `/blog/${slug}`,
    title: post.title,
    description: post.summary,
    locale,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modifiedTime,
    },
  })
}

function Page(props: PageProps<'/[locale]/blog/[slug]'>) {
  const { params } = props
  const { slug, locale } = use(params)

  setRequestLocale(locale as Locale)

  const post = getPostBySlug(locale, slug)
  const url = getLocalizedPath({ locale, pathname: `/blog/${slug}` })
  const baseUrl = getBaseUrl()

  if (!post) {
    notFound()
  }

  const ogImage = getLocalizedPath({ locale, pathname: `/og/blog/${post.slug}/image.webp` })

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: ogImage,
    datePublished: post.date,
    dateModified: post.modifiedTime,
    author: {
      '@type': 'Person',
      name: MY_NAME,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Person',
      name: MY_NAME,
      url: baseUrl,
    },
    inLanguage: locale,
  }

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
