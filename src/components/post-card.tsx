'use client'

import type { Post } from 'content-collections'

import { PencilIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useCountLike } from '@/hooks/queries/like.query'
import { useCountView } from '@/hooks/queries/view.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'

import { ContentCard } from './content-card'

type PostCardProps = {
  post: Post
  featured?: boolean
}

export function PostCard(props: PostCardProps) {
  const { post, featured } = props
  const formattedDate = useFormattedDate(post.date)
  const t = useTranslations()

  const viewsQuery = useCountView({ slug: post.slug })
  const likesQuery = useCountLike({ slug: post.slug })

  return (
    <ContentCard
      key={post.slug}
      href={`/blog/${post.slug}`}
      title={t('homepage.latest-articles.card')}
      image={`/images/blog/${post.slug}/cover.png`}
      imageAlt={post.title}
      icon={<PencilIcon className='size-4.5' />}
      featured={featured}
    >
      <div className='flex items-center justify-between gap-2 px-2 pt-4 text-sm text-muted-foreground'>
        {formattedDate ?? '--'}
        <div className='flex gap-2'>
          {likesQuery.isLoading && '--'}
          {likesQuery.isError && t('common.error')}
          {likesQuery.isSuccess && <div>{t('common.likes', { count: likesQuery.data.likes })}</div>}
          <div>&middot;</div>
          {viewsQuery.isLoading && '--'}
          {viewsQuery.isError && t('common.error')}
          {viewsQuery.isSuccess && <div>{t('common.views', { count: viewsQuery.data.views })}</div>}
        </div>
      </div>
      <div className='flex flex-col px-2 py-4 transition-transform ease-out group-hover:translate-x-0.5'>
        <h3 className='text-2xl font-semibold'>{post.title}</h3>
        <p className='mt-2 text-muted-foreground'>{post.summary}</p>
      </div>
    </ContentCard>
  )
}
