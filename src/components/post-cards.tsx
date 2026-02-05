'use client'

import type { Post } from 'content-collections'

import { useTranslations } from 'next-intl'

import BlurImage from '@/components/blur-image'
import { Link } from '@/components/ui/link'
import { useCountLike } from '@/hooks/queries/like.query'
import { useCountView } from '@/hooks/queries/view.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'

type PostCardsProps = {
  posts: Post[]
}

type PostCardProps = Post

function PostCards(props: PostCardsProps) {
  const { posts } = props

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}

function PostCard(props: PostCardProps) {
  const { slug, title, summary, date } = props
  const formattedDate = useFormattedDate(date)
  const t = useTranslations()

  const viewsQuery = useCountView({ slug })
  const likesQuery = useCountLike({ slug })

  return (
    <Link href={`/blog/${slug}`} className='group rounded-2xl p-2 shadow-feature-card'>
      <BlurImage
        src={`/images/blog/${slug}/cover.png`}
        className='rounded-lg'
        width={1200}
        height={630}
        imageClassName='transition-transform group-hover:scale-105'
        alt={title}
      />
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
      <div className='flex flex-col px-2 py-4'>
        <h3 className='text-2xl font-semibold'>{title}</h3>
        <p className='mt-2 text-muted-foreground'>{summary}</p>
      </div>
    </Link>
  )
}

export default PostCards
