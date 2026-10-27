import { ORPCError } from '@orpc/client'
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
} from '@repo/ui/components/alert-dialog'
import { Button } from '@repo/ui/components/button'
import { toast } from '@repo/ui/components/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type DeleteButtonProps = {
  id: string
}

export function DeleteButton(props: DeleteButtonProps) {
  const { id } = props
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const deletion = useMutation(
    orpc.guestbook.delete.mutationOptions({
      onSuccess: () => {
        setOpen(false)

        toast.add({
          type: 'success',
          title: m.success_message_deleted(),
          data: { testId: 'guestbook-message-deleted-toast' },
        })

        void queryClient.invalidateQueries({ queryKey: orpc.guestbook.list.key() })
      },
      onError: (error) =>
        toast.add({
          type: 'error',
          title:
            error instanceof ORPCError && error.code === 'TOO_MANY_REQUESTS'
              ? m.error_too_many_requests()
              : m.error_delete_message_failed(),
        }),
    }),
  )

  return (
    <div className='mt-4 flex justify-end'>
      <AlertDialog
        open={open}
        onOpenChange={(nextOpen, details) => {
          if (deletion.isPending) details.cancel()
          else setOpen(nextOpen)
        }}
      >
        <AlertDialogTrigger
          render={<Button variant='destructive' data-testid='guestbook-delete-button' />}
          disabled={deletion.isPending}
        >
          {m.common_delete()}
        </AlertDialogTrigger>
        <AlertDialogContent data-testid='guestbook-dialog' aria-busy={deletion.isPending}>
          <AlertDialogHeader>
            <AlertDialogTitle>{m.common_dialogs_delete_message_title()}</AlertDialogTitle>
            <AlertDialogDescription>{m.common_dialogs_delete_message_description()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletion.isPending}>{m.common_cancel()}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deletion.isPending) deletion.mutate({ id })
              }}
              variant='destructive'
              disabled={deletion.isPending}
              data-testid='guestbook-dialog-delete-button'
            >
              {m.common_delete()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
