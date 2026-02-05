'use client'

import type { Post } from 'content-collections'

import NumberFlow from '@number-flow/react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import BlurImage from '@/components/blur-image'
import ImageZoom from '@/components/image-zoom'
import { Link } from '@/components/ui/link'
import { useCountComment } from '@/hooks/queries/comment.query'
import { useCountView, useIncrementView } from '@/hooks/queries/view.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { MY_NAME } from '@/lib/constants'

type BlogHeaderProps = {
  post: Post
}

function BlogHeader(props: BlogHeaderProps) {
  const { post } = props
  const formattedDate = useFormattedDate(post.date)
  const t = useTranslations()

  const viewCountQuery = useCountView({ slug: post.slug })
  const commentCountQuery = useCountComment({ slug: post.slug, withReplies: true })

  const { mutate: incrementPostView } = useIncrementView({ slug: post.slug })

  const incremented = useRef(false)

  useEffect(() => {
    if (!incremented.current) {
      incrementPostView({ slug: post.slug })
      incremented.current = true
    }
  }, [incrementPostView, post.slug])

  return (
    <div className='space-y-16 py-16'>
      <div className='space-y-16 sm:px-8'>
        <h1 className='bg-linear-to-b from-black via-black/90 to-black/70 to-90% bg-clip-text text-center text-4xl font-semibold text-transparent md:text-5xl/16 dark:from-white dark:via-white/90 dark:to-white/70'>
          {post.title}
        </h1>
        <div className='grid grid-cols-2 text-sm max-md:gap-4 md:grid-cols-4'>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('blog.header.written-by')}</div>
            <Link href='https://github.com/nelsonlaidev' className='flex items-center gap-2'>
              <BlurImage
                src='/images/avatar.png'
                className='size-6 rounded-full'
                width={1024}
                height={1024}
                alt={t('common.avatar-alt', { name: MY_NAME })}
              />
              {MY_NAME}
            </Link>
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('blog.header.published-on')}</div>
            <div>{formattedDate ?? '--'}</div>
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('blog.header.views')}</div>
            {viewCountQuery.isLoading && '--'}
            {viewCountQuery.isError && t('common.error')}
            {viewCountQuery.isSuccess && <NumberFlow value={viewCountQuery.data.views} data-testid='view-count' />}
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('common.labels.comments')}</div>
            {commentCountQuery.isLoading && '--'}
            {commentCountQuery.isError && t('common.error')}
            {commentCountQuery.isSuccess && (
              <NumberFlow value={commentCountQuery.data.count} data-testid='comment-count' />
            )}
          </div>
        </div>
      </div>
      <ImageZoom>
        <BlurImage
          src={`/images/blog/${post.slug}/cover.png`}
          className='rounded-lg'
          width={1200}
          height={630}
          lazy={false}
          fetchPriority='high'
          alt={post.title}
        />
      </ImageZoom>
    </div>
  )
}

export default BlogHeader
