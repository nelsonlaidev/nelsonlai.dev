import type { MessageListOutput } from '@/orpc/client'

import { useTranslations } from 'next-intl'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { useDeleteMessage } from '@/hooks/queries/message.query'

type DeleteButtonProps = {
  message: MessageListOutput['messages'][number]
}

function DeleteButton(props: DeleteButtonProps) {
  const { message } = props
  const t = useTranslations()

  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage(() => {
    toast.success(t('success.message-deleted'), { testId: 'guestbook-message-deleted-toast' })
  })

  function handleDeleteMessage(id: string) {
    if (isDeleting) return
    deleteMessage({ id })
  }

  return (
    <div className='mt-4 flex justify-end'>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant='destructive'
              disabled={isDeleting}
              aria-disabled={isDeleting}
              data-testid='guestbook-delete-button'
            >
              {t('common.delete')}
            </Button>
          }
        />
        <AlertDialogContent data-testid='guestbook-dialog'>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.dialogs.delete-comment.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.dialogs.delete-comment.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteMessage(message.id)
              }}
              className={buttonVariants({ variant: 'destructive' })}
              data-testid='guestbook-dialog-delete-button'
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteButton
