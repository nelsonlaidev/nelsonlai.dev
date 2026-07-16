'use client'

import type { CommentsContextValue } from '@/contexts/comments.context'
import type { CommentListInput } from '@/orpc/client'

import { useMemo, useState } from 'react'

import { CommentsProvider } from '@/contexts/comments.context'

import { CommentList } from './comment-list'
import { CommentPost } from './comment-post'

type CommentSectionProps = {
  slug: string
}

export function CommentSection(props: CommentSectionProps) {
  const { slug } = props
  const [sort, setSort] = useState<CommentListInput['sort']>('newest')

  const contextValue = useMemo<CommentsContextValue>(() => ({ slug, sort, setSort }), [slug, sort])

  return (
    <CommentsProvider value={contextValue}>
      <div className='space-y-6'>
        <CommentPost />
        <CommentList />
      </div>
    </CommentsProvider>
  )
}
