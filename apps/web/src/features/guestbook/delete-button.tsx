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

import { getMutationErrorMessage } from '@/lib/get-mutation-error-message'
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
        })

        void queryClient.invalidateQueries({ queryKey: orpc.guestbook.list.key() })
      },
      onError: (error) => {
        toast.add({ type: 'error', title: getMutationErrorMessage(error, m.error_delete_message_failed()) })
      },
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
        <AlertDialogTrigger render={<Button variant='destructive' />} disabled={deletion.isPending}>
          {m.common_delete()}
        </AlertDialogTrigger>
        <AlertDialogContent
          aria-busy={deletion.isPending}
          className='max-h-[calc(100dvh-32px)] overflow-y-auto border shadow-md ring-0 data-[size=default]:max-w-[min(480px,calc(100vw-32px))] data-[size=sm]:max-w-[min(480px,calc(100vw-32px))] sm:data-[size=default]:max-w-[min(480px,calc(100vw-32px))]'
        >
          <AlertDialogHeader>
            <AlertDialogTitle className='pr-8 leading-tight tracking-tight'>
              {m.common_dialogs_delete_message_title()}
            </AlertDialogTitle>
            <AlertDialogDescription className='leading-relaxed'>
              {m.common_dialogs_delete_message_description()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletion.isPending}>{m.common_cancel()}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deletion.isPending) deletion.mutate({ id })
              }}
              variant='destructive'
              disabled={deletion.isPending}
            >
              {m.common_delete()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
