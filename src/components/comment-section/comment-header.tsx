import type { CommentListInput } from '@/orpc/client'

import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { ListFilterIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCommentsContext } from '@/contexts/comments.context'
import { useCountComment } from '@/hooks/queries/comment.query'
import { useCountReply } from '@/hooks/queries/reply.query'

function CommentHeader() {
  const { slug, sort, setSort } = useCommentsContext()
  const t = useTranslations()

  const commentCountQuery = useCountComment({ slug })
  const replyCountQuery = useCountReply({ slug })

  return (
    <div className='flex items-center justify-between px-1'>
      <NumberFlowGroup>
        <div>
          {commentCountQuery.isLoading && `-- ${t('blog.comments.comments', { count: 0 })}`}
          {commentCountQuery.isError && t('common.error')}
          {commentCountQuery.isSuccess && (
            <NumberFlow
              value={commentCountQuery.data.count}
              suffix={` ${t('blog.comments.comments', { count: commentCountQuery.data.count })}`}
              data-testid='blog-comment-count'
            />
          )}
          {' · '}
          {replyCountQuery.isLoading && `-- ${t('blog.comments.replies', { count: 0 })}`}
          {replyCountQuery.isError && t('common.error')}
          {replyCountQuery.isSuccess && (
            <NumberFlow
              value={replyCountQuery.data.count}
              suffix={` ${t('blog.comments.replies', { count: replyCountQuery.data.count })}`}
              data-testid='reply-count'
            />
          )}
        </div>
      </NumberFlowGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant='outline' size='sm'>
              <ListFilterIcon data-icon='inline-start' />
              <span>{t('blog.comments.sort-by')}</span>
            </Button>
          }
        />
        <DropdownMenuContent align='end'>
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => {
              setSort(value as CommentListInput['sort'])
            }}
          >
            <DropdownMenuRadioItem value='newest'>{t('blog.comments.newest')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='oldest'>{t('blog.comments.oldest')}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CommentHeader
