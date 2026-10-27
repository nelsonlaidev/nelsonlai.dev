import { createFileRoute, notFound } from '@tanstack/react-router'
import * as z from 'zod'

import { Mdx } from '@/components/mdx/mdx'
import { CommentSection } from '@/features/comments/comment-section'
import { BlogFooter } from '@/features/posts/blog-footer'
import { BlogHeader } from '@/features/posts/blog-header'
import { LikeButton } from '@/features/posts/like-button'
import { getPost } from '@/features/posts/posts.functions'
import { ProgressBar } from '@/features/posts/progress-bar'
import { TableOfContents } from '@/features/posts/table-of-contents'
import { createJsonLdBlogPosting } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
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
    const post = await getPost({ data: { slug: params.slug, locale } })

    if (!post) throw notFound()

    return { post, locale }
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
  component: RouteComponent,
})

function RouteComponent() {
  const { post, locale } = Route.useLoaderData()
  const { comment, reply } = Route.useSearch()

  return (
    <div key={`${locale}:${post.slug}`}>
      <BlogHeader post={post} />
      <div className='mt-8 flex flex-col justify-between gap-8 lg:flex-row'>
        <article className='w-full min-w-0 lg:max-w-2xl'>
          <Mdx code={post.mdx} />
        </article>
        <aside className='w-full shrink-0 lg:w-68'>
          <div className='sticky top-24'>
            <TableOfContents toc={post.toc} />
            <LikeButton slug={post.slug} />
          </div>
        </aside>
      </div>
      <ProgressBar />
      <BlogFooter post={post} />
      <CommentSection slug={post.slug} highlightedCommentId={comment} highlightedReplyId={reply} />
    </div>
  )
}
