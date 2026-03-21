'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useCommentContext } from '@/contexts/comment.context'
import { useCommentsContext } from '@/contexts/comments.context'
import { useCreatePostComment } from '@/hooks/queries/comment.query'
import { useSession } from '@/lib/auth-client'

import { CommentEditor } from './comment-editor'
import { UnauthenticatedOverlay } from './unauthenticated-overlay'

export function CommentReply() {
  const [content, setContent] = useState('')
  const { data: session } = useSession()
  const { comment, setIsReplying } = useCommentContext()
  const { slug } = useCommentsContext()
  const t = useTranslations()

  const { mutate: createReply, isPending: isCreating } = useCreatePostComment({ slug }, () => {
    setIsReplying(false)
    toast.success(t('success.reply-posted'), { testId: 'comment-reply-posted-toast' })
  })

  function submitCommentReply(e?: React.SubmitEvent<HTMLFormElement>) {
    e?.preventDefault()

    if (isCreating) return

    if (!content.trim()) {
      toast.error(t('error.reply-cannot-be-empty'))
      return
    }

    createReply({
      slug,
      content: content.trim(),
      parentId: comment.id,
    })
  }

  const isAuthenticated = session !== null
  const disabled = !isAuthenticated || isCreating

  return (
    <form onSubmit={submitCommentReply}>
      <div className='relative'>
        <CommentEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          onModEnter={submitCommentReply}
          onEscape={() => {
            setIsReplying(false)
          }}
          placeholder={t('blog.comments.reply-to-comment')}
          disabled={disabled}
          // autoFocus is necessary because user is replying to a comment
          // oxlint-disable-next-line jsx_a11y/no-autofocus
          autoFocus
          data-testid='comment-textarea-reply'
        />
        {isAuthenticated ? null : <UnauthenticatedOverlay />}
      </div>
      <div className='mt-2 space-x-1'>
        <Button
          variant='secondary'
          size='sm'
          type='submit'
          disabled={disabled || !content.trim()}
          aria-disabled={disabled || !content.trim()}
          data-testid='comment-submit-reply-button'
        >
          {t('blog.comments.reply')}
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => {
            setIsReplying(false)
          }}
        >
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  )
}
