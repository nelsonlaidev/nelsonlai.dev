import type { PostSummary } from '@/features/posts/types'

import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

import { PostCard } from '@/components/post-card'
import { usePostStats } from '@/features/posts/use-post-stats'
import { m } from '@/paraglide/messages'

const variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
}

type LatestArticlesProps = {
  posts: PostSummary[]
}

export function LatestArticles(props: LatestArticlesProps) {
  const { posts } = props
  const reducedMotion = useReducedMotion()
  const articlesRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(articlesRef, { once: true, margin: '-100px' })
  const statsQuery = usePostStats(posts.map((post) => post.slug))

  return (
    <motion.div
      initial='initial'
      animate={reducedMotion || isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={articlesRef}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
      className='relative my-24'
    >
      <motion.h2
        className='text-center text-3xl font-semibold'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        {m.homepage_latest_articles_title()}
      </motion.h2>
      <motion.div
        className='mt-12 grid gap-4 md:grid-cols-2'
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            stats={statsQuery.data?.get(post.slug)}
            isStatsError={statsQuery.isError}
            featured
          />
        ))}
      </motion.div>
      <div className='my-8 flex items-center justify-center'>
        <Link to='/blog' className={cn(buttonVariants({ variant: 'outline' }))}>
          {m.homepage_latest_articles_view_all()}
        </Link>
      </div>
    </motion.div>
  )
}
