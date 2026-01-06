import type { CommentListInput } from '@/orpc/client'

import { createContext, use } from 'react'

type CommentsContextValue = {
  slug: string
  sort: CommentListInput['sort']
  setSort: (sort: CommentListInput['sort']) => void
}

const CommentsContext = createContext<CommentsContextValue | null>(null)
CommentsContext.displayName = 'CommentsContext'

export function useCommentsContext(): CommentsContextValue {
  const context = use(CommentsContext)

  if (!context) {
    throw new Error('useCommentsContext must be used within a CommentsProvider')
  }

  return context
}

export const CommentsProvider = CommentsContext.Provider
