import { MoreVerticalIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCommentContext } from '@/contexts/comment.context'
import { useCommentsContext } from '@/contexts/comments.context'
import { useDeletePostComment } from '@/hooks/queries/comment.query'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSession } from '@/lib/auth-client'

function CommentMenu() {
  const { comment } = useCommentContext()
  const { slug } = useCommentsContext()
  const { data: session } = useSession()
  const [copy] = useCopyToClipboard()
  const [open, setOpen] = useState(false)
  const t = useTranslations()

  const { mutate: deleteComment, isPending: isDeleting } = useDeletePostComment({ slug }, () => {
    toast.success(t('success.comment-deleted'), { testId: 'comment-deleted-toast' })
  })

  const {
    isDeleted,
    id,
    user: { id: userId },
    parentId,
  } = comment

  const commentQuery = parentId ? `comment=${parentId}&reply=${id}` : `comment=${id}`

  const isAuthor = !isDeleted && session?.user.id === userId

  function handleDeleteComment() {
    if (isDeleting) return
    deleteComment({ id })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label={t('blog.comments.open-menu')}
              data-testid='comment-menu-button'
            >
              <MoreVerticalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => {
              void copy({
                text: `${globalThis.location.origin}/blog/${slug}?${commentQuery}`,
                successMessage: t('success.link-copied'),
              })
            }}
          >
            {t('blog.comments.copy-link')}
          </DropdownMenuItem>
          {isAuthor && (
            <DropdownMenuItem
              disabled={isDeleting}
              aria-disabled={isDeleting}
              data-testid='comment-delete-button'
              variant='destructive'
              onClick={() => {
                setOpen(true)
              }}
            >
              {t('common.delete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent data-testid='comment-dialog'>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.dialogs.delete-comment.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.dialogs.delete-comment.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className={buttonVariants({ variant: 'destructive' })}
              data-testid='comment-dialog-delete-button'
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CommentMenu
