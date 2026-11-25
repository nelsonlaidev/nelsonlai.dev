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

import { getMutationErrorMessage } from '@/lib/get-mutation-error-message'
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
  const mutation = useMutation(
    orpc.comments.delete.mutationOptions({
      onSuccess: () => {
        onOpenChange(false)
        void queryClient.invalidateQueries({ queryKey: orpc.comments.key() })
        toast.add({ type: 'success', title: m.success_comment_deleted() })
      },
      onError: (error) => {
        toast.add({ type: 'error', title: getMutationErrorMessage(error, m.error_delete_comment_failed()) })
      },
    }),
  )

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value, details) => {
        if (mutation.isPending) {
          details.cancel()
          return
        }
        onOpenChange(value)
      }}
    >
      <AlertDialogContent aria-busy={mutation.isPending}>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.common_dialogs_delete_comment_title()}</AlertDialogTitle>
          <AlertDialogDescription>{m.common_dialogs_delete_comment_description()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>{m.common_cancel()}</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            disabled={mutation.isPending}
            onClick={() => {
              if (!mutation.isPending) mutation.mutate({ id })
            }}
          >
            {m.common_delete()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
