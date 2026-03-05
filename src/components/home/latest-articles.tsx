'use client'

import type { Post } from 'content-collections'

import { motion, useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { cn } from '@/utils/cn'

import { PostCard } from '../post-card'

const variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
}

type LatestArticlesProps = {
  posts: Post[]
}

export function LatestArticles(props: LatestArticlesProps) {
  const { posts } = props
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })
  const t = useTranslations()

  return (
    <motion.div
      initial='initial'
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{ duration: 0.5 }}
      className='my-24'
    >
      <motion.h2
        className='text-center text-3xl font-semibold'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {t('homepage.latest-articles.title')}
      </motion.h2>
      <motion.div
        className='mt-12 grid gap-4 md:grid-cols-2'
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} featured />
        ))}
      </motion.div>
      <div className='my-8 flex items-center justify-center'>
        <Link href='/blog' className={cn(buttonVariants({ variant: 'outline' }))}>
          {t('homepage.latest-articles.more')}
        </Link>
      </div>
    </motion.div>
  )
}
