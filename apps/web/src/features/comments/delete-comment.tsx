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
      <AlertDialogContent aria-busy={deletion.isPending}>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.common_dialogs_delete_comment_title()}</AlertDialogTitle>
          <AlertDialogDescription>{m.common_dialogs_delete_comment_description()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletion.isPending}>{m.common_cancel()}</AlertDialogCancel>
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
