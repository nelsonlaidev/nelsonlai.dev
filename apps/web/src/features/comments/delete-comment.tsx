import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/alert-dialog'
import { toast } from '@repo/ui/components/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type DeleteCommentProps = {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteComment(props: DeleteCommentProps) {
  const { id, open, onOpenChange } = props
  const queryClient = useQueryClient()
  const deletion = useMutation(
    orpc.comments.delete.mutationOptions({
      onSuccess: () => {
        onOpenChange(false)
        void queryClient.invalidateQueries({ queryKey: orpc.comments.key() })
        toast.add({ type: 'success', title: m.success_comment_deleted() })
      },
      onError: () => toast.add({ type: 'error', title: m.error_something_went_wrong() }),
    }),
  )

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value, details) => {
        if (deletion.isPending) details.cancel()
        else onOpenChange(value)
      }}
    >
      <AlertDialogContent
        aria-busy={deletion.isPending}
        className='max-h-[calc(100dvh-32px)] overflow-y-auto border shadow-md ring-0 data-[size=default]:max-w-[min(480px,calc(100vw-32px))] data-[size=sm]:max-w-[min(480px,calc(100vw-32px))] sm:data-[size=default]:max-w-[min(480px,calc(100vw-32px))]'
      >
        <AlertDialogHeader>
          <AlertDialogTitle className='pr-8 leading-tight tracking-[-0.035em]'>
            {m.common_dialogs_delete_comment_title()}
          </AlertDialogTitle>
          <AlertDialogDescription className='leading-[1.65]'>
            {m.common_dialogs_delete_comment_description()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletion.isPending} className='min-h-11'>
            {m.common_cancel()}
          </AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            disabled={deletion.isPending}
            onClick={() => {
              if (!deletion.isPending) deletion.mutate({ id })
            }}
          >
            {m.common_delete()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
