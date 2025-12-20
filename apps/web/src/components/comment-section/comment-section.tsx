'use client'

import type { ListCommentsInput } from '@/orpc/routers'

import { useState } from 'react'

import { CommentsProvider } from '@/contexts/comments.context'

import CommentList from './comment-list'
import CommentPost from './comment-post'

type CommentSectionProps = {
  slug: string
}

function CommentSection(props: CommentSectionProps) {
  const { slug } = props
  const [sort, setSort] = useState<ListCommentsInput['sort']>('newest')

  return (
    <CommentsProvider value={{ slug, sort, setSort }}>
      <div className='space-y-6'>
        <CommentPost />
        <CommentList />
      </div>
    </CommentsProvider>
  )
}

export default CommentSection
