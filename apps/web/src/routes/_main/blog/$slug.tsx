import type { PostDetail, PostSummary } from '@/features/posts/types'

import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import * as z from 'zod'

import { Mdx } from '@/components/mdx/mdx'
import { OceanPage } from '@/components/ocean-page'
import { PagePending } from '@/components/page-pending'
import { RouteError } from '@/components/route-error'
import { CommentSection } from '@/features/comments/comment-section'
import { ArticleGallery } from '@/features/posts/article-gallery'
import { BlogFooter } from '@/features/posts/blog-footer'
import { BlogHeader } from '@/features/posts/blog-header'
import { LikeButton, usePostLike } from '@/features/posts/like-button'
import { getPost, getPosts } from '@/features/posts/posts.functions'
import { ProgressBar } from '@/features/posts/progress-bar'
import { TableOfContents } from '@/features/posts/table-of-contents'
import { createJsonLdBlogPosting } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/blog/$slug')({
  validateSearch: (search) => {
    const parsed = z
      .object({ comment: z.string().min(1).max(100).optional(), reply: z.string().min(1).max(100).optional() })
      .safeParse(search)

    return parsed.success ? parsed.data : { comment: undefined, reply: undefined }
  },
  loader: async ({ params }) => {
    const locale = getLocale()
    const [post, summaries] = await Promise.all([
      getPost({ data: { slug: params.slug, locale } }),
      getPosts({ data: { locale } }),
    ])

    if (!post) throw notFound()

    const next = summaries[(summaries.findIndex((item) => item.slug === post.slug) + 1) % summaries.length]

    return { post, locale, next }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { post, locale } = loaderData
    const pathname = `/blog/${post.slug}` as const

    return createSeoHead({
      title: post.title,
      description: post.description,
      pathname,
      locale,
      type: 'article',
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      jsonLd: createJsonLdBlogPosting({
        headline: post.title,
        description: post.description,
        pathname,
        image: `/og/blog/${post.slug}/image.webp`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        locale,
      }),
    })
  },
  pendingComponent: () => <PagePending title={m.blog_all_articles()} description={m.blog_intro()} />,
  errorComponent: (props) => (
    <OceanPage>
      <RouteError {...props} />
    </OceanPage>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { post, locale, next } = Route.useLoaderData()
  const { comment, reply } = Route.useSearch()

  return (
    <OceanPage className={next ? 'pb-0 sm:pb-0' : undefined}>
      <ArticleDetail key={`${locale}:${post.slug}`} post={post} next={next} comment={comment} reply={reply} />
    </OceanPage>
  )
}

type ArticleDetailProps = {
  post: PostDetail
  next?: PostSummary
  comment?: string
  reply?: string
}

function ArticleDetail(props: ArticleDetailProps) {
  const { post, next, comment, reply } = props
  const likes = usePostLike(post.slug)

  return (
    <>
      <Link to='/blog' className='group mb-10 inline-flex items-center gap-3 text-sm/normal text-link sm:mb-14'>
        <ArrowLeftIcon
          className='size-4 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1 motion-safe:group-focus-visible:-translate-x-1'
          aria-hidden='true'
        />
        {m.blog_all_articles()}
      </Link>
      <BlogHeader post={post} />
      <div className='border-t pt-8 sm:pt-11 lg:grid lg:grid-cols-[minmax(0,65ch)_--spacing(48)] lg:justify-center lg:gap-10 xl:gap-12'>
        <TableOfContents toc={post.toc}>
          <LikeButton state={likes} placement='desktop' />
        </TableOfContents>
        <ArticleGallery>
          <article className='mx-auto w-full max-w-prose min-w-0 lg:order-first'>
            <Mdx code={post.code} />
            <BlogFooter post={post}>
              <LikeButton state={likes} placement='mobile' />
            </BlogFooter>
            <CommentSection slug={post.slug} highlightedCommentId={comment} highlightedReplyId={reply} />
          </article>
        </ArticleGallery>
      </div>
      <ProgressBar />
      {next && (
        <Link
          to='/blog/$slug'
          params={{ slug: next.slug }}
          className='group mt-16 flex items-center justify-between gap-5 border-t pt-14 sm:mt-28 sm:gap-8'
        >
          <div>
            <span className='mb-6 block text-xs text-section-label'>{m.blog_next()}</span>
            <h2 className='max-w-2xl text-2xl tracking-tighter sm:text-3xl'>{next.title}</h2>
            <p className='mt-5 max-w-lg text-base/relaxed text-muted-foreground/80'>{next.description}</p>
          </div>
          <ArrowRightIcon
            aria-hidden='true'
            className='size-7 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 sm:size-11'
          />
        </Link>
      )}
    </>
  )
}
