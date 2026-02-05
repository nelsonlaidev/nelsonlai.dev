import NumberFlow from '@number-flow/react'
import { ChevronDownIcon, MessageSquareIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useCommentContext } from '@/contexts/comment.context'
import { useCommentsContext } from '@/contexts/comments.context'
import { useCreateVote } from '@/hooks/queries/vote.query'
import { useSession } from '@/lib/auth-client'

function CommentActions() {
  const { slug } = useCommentsContext()
  const { comment, setIsReplying, isOpenReplies, setIsOpenReplies } = useCommentContext()
  const { data: session } = useSession()
  const t = useTranslations()

  const { mutate: voteComment, isPending: isVoting } = useCreateVote({ slug })

  const isAuthenticated = session !== null

  function handleVoteComment(like: boolean) {
    if (isVoting) return

    if (!isAuthenticated) {
      toast.error(t('error.need-logged-in-to-vote'))
      return
    }
    voteComment({ id: comment.id, isLike: like === comment.liked ? null : like })
  }

  const hasReplies = !comment.parentId && comment.replyCount > 0

  return (
    <>
      <div className='flex gap-1'>
        <Button
          variant='secondary'
          onClick={() => {
            handleVoteComment(true)
          }}
          data-active={comment.liked === true}
          size='sm'
          className='font-mono text-xs text-muted-foreground data-active:bg-accent data-active:text-accent-foreground'
          aria-label={t('common.like')}
          disabled={isVoting}
        >
          <ThumbsUpIcon />
          <NumberFlow value={comment.likeCount} />
        </Button>
        <Button
          variant='secondary'
          onClick={() => {
            handleVoteComment(false)
          }}
          data-active={comment.liked === false}
          size='sm'
          className='font-mono text-xs text-muted-foreground data-active:bg-accent data-active:text-accent-foreground'
          aria-label={t('blog.comments.dislike')}
          disabled={isVoting}
        >
          <ThumbsDownIcon />
          <NumberFlow value={comment.dislikeCount} />
        </Button>
        {comment.parentId ? null : (
          <Button
            variant='secondary'
            size='sm'
            className='text-xs text-muted-foreground'
            onClick={() => {
              setIsReplying(true)
            }}
            data-testid='comment-reply-button'
          >
            <MessageSquareIcon />
            {t('blog.comments.reply')}
          </Button>
        )}
      </div>
      {hasReplies && (
        <Button
          variant='ghost'
          size='sm'
          className='mt-4 text-xs data-open:[&>svg]:rotate-180'
          onClick={() => {
            setIsOpenReplies(!isOpenReplies)
          }}
          data-state={isOpenReplies ? 'open' : 'closed'}
          data-testid='comment-replies-expand-button'
        >
          <ChevronDownIcon data-icon='inline-start' className='size-4 transition-transform duration-200' />
          <NumberFlow value={comment.replyCount} data-testid='comment-reply-count' />
          {t('blog.comments.replies', { count: comment.replyCount })}
        </Button>
      )}
    </>
  )
}

export default CommentActions
