'use client'

import { SendIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useCommentsContext } from '@/contexts/comments.context'
import { useCreatePostComment } from '@/hooks/queries/comment.query'
import { useIsHydrated } from '@/hooks/use-is-hydrated'
import { useSession } from '@/lib/auth-client'

import { Spinner } from '../ui/spinner'
import { CommentEditor } from './comment-editor'
import { UnauthenticatedOverlay } from './unauthenticated-overlay'

export function CommentPost() {
  const { slug } = useCommentsContext()
  const [content, setContent] = useState('')
  const [tabsValue, setTabsValue] = useState<'write' | 'preview'>('write')
  const isHydrated = useIsHydrated()
  const { data: session, isPending: isSessionLoading } = useSession()
  const t = useTranslations()

  const { mutate: createComment, isPending: isCreating } = useCreatePostComment({ slug }, () => {
    setContent('')
    toast.success(t('success.comment-posted'), { testId: 'comment-posted-toast' })
    setTabsValue('write')
  })

  function submitComment(e?: React.SubmitEvent<HTMLFormElement>) {
    e?.preventDefault()

    if (isCreating) return

    if (!content.trim()) {
      toast.error(t('error.comment-cannot-be-empty'))
      return
    }

    createComment({
      slug,
      content: content.trim(),
    })
  }

  if (!isHydrated) {
    return (
      <div className='flex h-32.5 items-center justify-center'>
        <Spinner />
      </div>
    )
  }

  const isAuthenticated = session !== null && !isSessionLoading
  const disabled = !isAuthenticated || isCreating

  return (
    <form onSubmit={submitComment}>
      <div className='relative'>
        <CommentEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          tabsValue={tabsValue}
          onTabsValueChange={(value) => {
            setTabsValue(value as 'write' | 'preview')
          }}
          onModEnter={submitComment}
          placeholder={t('blog.comments.placeholder')}
          disabled={disabled}
          data-testid='comment-textarea-post'
        />
        <Button
          variant='ghost'
          size='icon-xs'
          className='absolute right-3 bottom-3'
          type='submit'
          disabled={disabled || !content.trim()}
          aria-label={t('blog.comments.send-comment')}
          aria-disabled={disabled || !content.trim()}
          data-testid='comment-submit-button'
        >
          <SendIcon className='size-4' />
        </Button>
        {isAuthenticated ? null : <UnauthenticatedOverlay />}
      </div>
    </form>
  )
}
