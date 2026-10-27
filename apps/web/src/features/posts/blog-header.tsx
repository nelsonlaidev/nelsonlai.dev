import type { PostDetail } from './types'

import NumberFlow from '@number-flow/react'
import { BlurImage } from '@repo/ui/components/blur-image'
import { ExternalLink } from '@repo/ui/components/external-link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import Zoom from 'react-medium-image-zoom'

import { useFormattedDate } from '@/hooks/use-formatted-date'
import { orpc } from '@/lib/orpc-client'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

import { usePostStats } from './use-post-stats'

type BlogHeaderProps = { post: PostDetail }

export function BlogHeader(props: BlogHeaderProps) {
  const { post } = props
  const formattedDate = useFormattedDate(post.publishedAt)
  const queryClient = useQueryClient()
  const stats = usePostStats([post.slug])
  const counts = useQuery(orpc.comments.counts.queryOptions({ input: { slug: post.slug } }))
  const hasIncrementedRef = useRef(false)
  const increment = useMutation(
    orpc.posts.incrementView.mutationOptions({
      onSuccess: async (data) => {
        const queryKey = orpc.posts.stats.queryOptions({ input: { slugs: [post.slug] } }).queryKey
        await queryClient.cancelQueries({ queryKey })
        queryClient.setQueryData(queryKey, [data])
        void queryClient.invalidateQueries({ queryKey: orpc.posts.stats.key() })
      },
    }),
  )
  const statsFallback = stats.isError ? m.common_error() : '--'
  const countsFallback = counts.isError ? m.common_error() : '--'

  useEffect(() => {
    if (!hasIncrementedRef.current) {
      hasIncrementedRef.current = true
      increment.mutate({ slug: post.slug })
    }
  }, [increment, post.slug])

  return (
    <div className='space-y-16 py-16'>
      <div className='space-y-16 sm:px-8'>
        <h1 className='bg-linear-to-b from-black via-black/90 to-black/70 to-90% bg-clip-text text-center text-4xl font-semibold text-transparent md:text-5xl/16 dark:from-white dark:via-white/90 dark:to-white/70'>
          {post.title}
        </h1>
        <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{m.blog_header_written_by()}</div>
            <ExternalLink href={SITE.socials.github} className='flex items-center gap-2'>
              <BlurImage
                src='/images/avatar.png'
                className='size-6 rounded-full'
                width={1024}
                height={1024}
                alt={m.common_avatar_alt({ name: SITE.name })}
              />
              {SITE.name}
            </ExternalLink>
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{m.blog_header_published_on()}</div>
            <time dateTime={post.publishedAt}>{formattedDate ?? '--'}</time>
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{m.blog_header_views()}</div>
            {stats.data?.[0] ? <NumberFlow value={stats.data[0].views} /> : statsFallback}
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{m.common_labels_comments()}</div>
            {counts.data ? <NumberFlow value={counts.data.comments + counts.data.replies} /> : countsFallback}
          </div>
        </div>
      </div>
      <Zoom zoomMargin={40}>
        <BlurImage
          src={`/images/blog/${post.slug}/cover.png`}
          className='rounded-lg'
          width={1200}
          height={630}
          lazy={false}
          fetchPriority='high'
          alt={post.title}
        />
      </Zoom>
    </div>
  )
}
