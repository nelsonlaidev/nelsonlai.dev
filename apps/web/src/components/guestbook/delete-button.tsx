import type { ListMessagesOutput } from '@/orpc/routers'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@repo/ui/components/alert-dialog'
import { Button, buttonVariants } from '@repo/ui/components/button'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { useDeleteMessage } from '@/hooks/queries/message.query'

type DeleteButtonProps = {
  message: ListMessagesOutput['messages'][number]
}

const DeleteButton = (props: DeleteButtonProps) => {
  const { message } = props
  const t = useTranslations()

  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage(() => {
    toast.success(t('success.message-deleted'))
  })

  const handleDeleteMessage = (id: string) => {
    if (isDeleting) return
    deleteMessage({ id })
  }

  return (
    <div className='mt-4 flex justify-end'>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='destructive'
            disabled={isDeleting}
            aria-disabled={isDeleting}
            data-testid='guestbook-delete-button'
          >
            {t('common.delete')}
          </Button>
        </AlertDialogTrigger>
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
