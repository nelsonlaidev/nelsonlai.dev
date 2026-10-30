import type { PostDetail, PostSummary } from '@/features/posts/types'

import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import * as z from 'zod'

import { Mdx } from '@/components/mdx/mdx'
import { CommentSection } from '@/features/comments/comment-section'
import { ArticleGallery } from '@/features/posts/article-gallery'
import { BlogFooter } from '@/features/posts/blog-footer'
import { BlogHeader } from '@/features/posts/blog-header'
import { BlogError, BlogLayout, BlogPending } from '@/features/posts/blog-layout'
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
    const [post, posts] = await Promise.all([
      getPost({ data: { slug: params.slug, locale } }),
      getPosts({ data: { locale } }),
    ])

    if (!post) throw notFound()

    const next = posts[(posts.findIndex((item) => item.slug === post.slug) + 1) % posts.length]
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
  pendingComponent: BlogPending,
  errorComponent: BlogError,
  component: RouteComponent,
})

function RouteComponent() {
  const { post, locale, next } = Route.useLoaderData()
  const { comment, reply } = Route.useSearch()
  return (
    <BlogLayout>
      <ArticleDetail key={`${locale}:${post.slug}`} post={post} next={next} comment={comment} reply={reply} />
    </BlogLayout>
  )
}

function ArticleDetail(props: { post: PostDetail; next?: PostSummary; comment?: string; reply?: string }) {
  const { post, next, comment, reply } = props
  const likes = usePostLike(post.slug)
  return (
    <>
      <Link
        to='/blog'
        className='mb-13.75 inline-flex min-h-11 items-center gap-3 text-sm/normal text-[#a9c6bf] max-[601px]:mb-9.5'
      >
        <ArrowLeftIcon size={17} aria-hidden='true' />
        {m.ocean_blog_all()}
      </Link>
      <BlogHeader post={post} />
      <div className='grid grid-cols-[200px_minmax(0,1fr)] gap-16.25 border-t border-t-border pt-11.25 max-[1201px]:grid-cols-[155px_minmax(0,1fr)] max-[1201px]:gap-8.75 max-[1001px]:block max-[601px]:pt-7.5'>
        <TableOfContents toc={post.toc}>
          <LikeButton state={likes} placement='desktop' />
        </TableOfContents>
        <ArticleGallery>
          <article className='max-w-[70ch] min-w-0 bg-[#062633] px-7.5 pt-0 pb-7.5 max-[1201px]:px-2.5 max-[1001px]:max-w-none max-[1001px]:px-4 max-[1001px]:py-5 max-[601px]:-mx-4 max-[601px]:px-4'>
            <div className='mx-0 mt-0 mb-11.25 border-l border-l-[#9cbeac55] py-0.5 pr-0 pl-5.75'>
              <span className='mb-3.5 block text-xs leading-[normal] tracking-[normal] text-[#b5cdbb]'>
                {m.ocean_blog_before()}
              </span>
              <p className='text-base/[1.65] leading-[1.65] text-[#8eafa1]'>{post.description}</p>
            </div>
            <Mdx
              code={post.mdx}
              className='text-lg leading-[1.7] text-[#b7cbbf] prose-headings:scroll-mt-10 prose-headings:leading-[1.35] prose-headings:font-normal prose-headings:tracking-[-0.035em] prose-headings:text-[#e7eee5] prose-h2:mx-0 prose-h2:mt-12 prose-h2:mb-5.5 prose-h2:text-[29px] max-[601px]:prose-h2:text-[26px] prose-h3:mx-0 prose-h3:mt-8 prose-h3:mb-5 prose-h3:text-[23px] prose-p:my-4.75 prose-a:text-[#d0e0c7]! prose-a:decoration-[#8eae9270] prose-a:underline-offset-4 prose-figure:my-7.5! prose-figcaption:mt-3 prose-figcaption:text-left prose-figcaption:text-sm/[1.8] prose-figcaption:text-[#85aa96] prose-strong:font-[550] prose-strong:text-[#d0e0c7] prose-code:rounded-[3px]! prose-code:border-[#a8c2a21c]! prose-code:bg-[#b9d4b30c]! prose-code:px-1.25! prose-code:py-0.5! prose-code:text-[0.85em]! prose-code:text-inherit prose-ol:mt-4.75 prose-ol:mb-6.25 prose-ol:pl-5.75 prose-ul:mt-4.75 prose-ul:mb-6.25 prose-ul:pl-5.75 prose-li:my-1.75 prose-li:pl-1.25 prose-table:text-base prose-th:border prose-th:border-[#8eae922b] prose-th:px-3.75 prose-th:py-3.25 prose-td:border prose-td:border-[#8eae922b] prose-td:px-3.75 prose-td:py-3.25 prose-img:rounded-[3px] prose-img:border-border [&>h2:first-child]:mt-0 [&>p:first-child]:mt-0 [&>p:first-child]:mb-11.25 [&>p:first-child]:border-l [&>p:first-child]:border-[#9cbeac55] [&>p:first-child]:py-0.5 [&>p:first-child]:pl-5.75 [&>p:first-child]:text-base [&>p:first-child]:text-[#8eafa1]'
            />
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
          className='mt-27.5 flex items-center justify-between gap-7.5 border-t border-t-border pt-11.25 max-[601px]:mt-16.25 max-[601px]:gap-5 max-[601px]:pt-8'
        >
          <div>
            <span className='mb-6 block text-xs leading-[normal] tracking-[normal] text-[#b4cec4]'>
              {m.ocean_blog_next()}
            </span>
            <h2 className='max-w-175 text-[33px] leading-normal font-[410] tracking-tighter max-[601px]:text-[25px] max-[601px]:leading-[1.3]'>
              {next.title}
            </h2>
            <p className='mt-4.5 max-w-130 text-base/[1.65] text-[#93b2aa]'>{next.description}</p>
          </div>
          <ArrowRightIcon aria-hidden='true' className='size-10.5 shrink-0 max-[601px]:size-7' />
        </Link>
      )}
    </>
  )
}
