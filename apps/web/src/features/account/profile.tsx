import type { Session } from '@repo/auth'

import {
  AVATAR_MAX_FILE_SIZE,
  AVATAR_MIME_TYPES,
  AvatarUploadInputSchema,
  UpdateNameInputSchema,
} from '@repo/api/schema/account'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent } from '@repo/ui/components/card'
import { Field, FieldError, FieldLabel } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { Spinner } from '@repo/ui/components/spinner'
import { toast } from '@repo/ui/components/toast'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId, useRef, useState } from 'react'

import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { authClient } from '@/lib/auth-client'
import { client, orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type ProfileProps = {
  user: Session['user']
}

export function Profile(props: ProfileProps) {
  const { user } = props
  const createdAt = useFormattedDate(user.createdAt)

  return (
    <section className='space-y-6' aria-labelledby='profile-heading'>
      <h2 id='profile-heading' className='text-xl/[calc(1.75/1.125)] font-[450] tracking-tight'>
        {m.account_profile()}
      </h2>
      <Card className='border shadow-none ring-0'>
        <CardContent className='space-y-6 wrap-anywhere'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>{m.account_avatar()}</p>
              <UserAvatar id={user.id} name={user.name} image={user.image} className='size-24' />
            </div>
            <UpdateAvatar />
          </div>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='min-w-0 space-y-2'>
              <p className='text-sm text-muted-foreground'>{m.account_display_name()}</p>
              <p className='wrap-break-word'>{user.name}</p>
            </div>
            <EditName name={user.name} />
          </div>
          <dl className='space-y-6'>
            <div className='space-y-2'>
              <dt className='text-sm text-muted-foreground'>{m.account_email()}</dt>
              <dd className='wrap-break-word'>{user.email}</dd>
            </div>
            <div className='space-y-2'>
              <dt className='text-sm text-muted-foreground'>{m.account_account_created()}</dt>
              <dd>{createdAt ?? '--'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}

type EditNameProps = {
  name: string
}

function EditName(props: EditNameProps) {
  const { name } = props
  const [open, setOpen] = useState(false)
  const inputId = useId()
  const { refetch } = authClient.useSession()
  const queryClient = useQueryClient()
  const update = useMutation(
    orpc.account.updateName.mutationOptions({
      onSuccess: async () => {
        await refetch()
        setOpen(false)
        toast.add({ type: 'success', title: m.success_name_updated() })
        void queryClient.invalidateQueries({ queryKey: orpc.comments.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.guestbook.key() })
      },
      onError: () => toast.add({ type: 'error', title: m.error_something_went_wrong() }),
    }),
  )

  const form = useForm({
    defaultValues: {
      name,
    },
    validators: {
      onSubmit: ({ value }) => {
        const parsed = UpdateNameInputSchema.safeParse(value, {
          error: (issue) => {
            if (issue.code === 'too_small') return m.error_name_cannot_be_empty()
            if (issue.code === 'too_big') return m.error_name_too_long()
            return issue.message
          },
        })

        return parsed.success ? undefined : { fields: { name: parsed.error.issues } }
      },
    },
    onSubmit: ({ value }) => {
      if (update.isPending) return

      update.mutate(value)
    },
  })

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value, details) => {
        if (update.isPending) {
          details.cancel()
          return
        }
        if (value) form.reset({ name })
        setOpen(value)
      }}
    >
      <AlertDialogTrigger render={<Button variant='outline' />}>{m.account_edit_name()}</AlertDialogTrigger>
      <AlertDialogContent
        aria-busy={update.isPending}
        className='max-h-[calc(100dvh-32px)] overflow-y-auto border shadow-md ring-0 data-[size=default]:max-w-[min(480px,calc(100vw-32px))] data-[size=sm]:max-w-[min(480px,calc(100vw-32px))] sm:data-[size=default]:max-w-[min(480px,calc(100vw-32px))]'
      >
        <AlertDialogHeader>
          <AlertDialogTitle className='pr-8 leading-tight tracking-[-0.035em]'>
            {m.account_edit_name()}
          </AlertDialogTitle>
          <AlertDialogDescription className='leading-[1.65]'>
            {m.account_edit_name_description()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          className='space-y-6'
          onSubmit={async (event) => {
            event.preventDefault()
            await form.handleSubmit()
          }}
        >
          <form.Field name='name'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={inputId}>{m.account_display_name()}</FieldLabel>
                  <Input
                    id={inputId}
                    name={field.name}
                    autoComplete='name'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value)
                    }}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? `${inputId}-error` : undefined}
                    disabled={update.isPending}
                  />
                  {isInvalid && <FieldError id={`${inputId}-error`} errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant='outline' disabled={update.isPending} />}>
              {m.common_cancel()}
            </AlertDialogCancel>
            <Button type='submit' disabled={update.isPending}>
              {update.isPending && <Spinner />}
              {m.common_save()}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function UpdateAvatar() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { refetch } = authClient.useSession()
  const queryClient = useQueryClient()
  const upload = useMutation({
    mutationFn: async (file: File) => {
      const { key, uploadUrl } = await client.account.createAvatarUpload(
        AvatarUploadInputSchema.parse({
          fileType: file.type,
          fileSize: file.size,
        }),
      )
      const response = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!response.ok) throw new Error('Failed to upload avatar')
      await client.account.updateAvatar({ key })
    },
    onSuccess: async () => {
      await refetch()
      toast.add({ type: 'success', title: m.success_avatar_updated() })
      void queryClient.invalidateQueries({ queryKey: orpc.comments.key() })
      void queryClient.invalidateQueries({ queryKey: orpc.guestbook.key() })
    },
    onError: () => toast.add({ type: 'error', title: m.error_update_avatar_failed() }),
  })

  return (
    <div>
      <input
        ref={inputRef}
        type='file'
        accept={AVATAR_MIME_TYPES.join(',')}
        aria-label={m.account_update_avatar()}
        className='hidden'
        disabled={upload.isPending}
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file || upload.isPending) return
          if (!AVATAR_MIME_TYPES.some((type) => type === file.type)) {
            toast.add({ type: 'error', title: m.error_avatar_unsupported_file() })
            return
          }
          if (file.size === 0 || file.size > AVATAR_MAX_FILE_SIZE) {
            toast.add({
              type: 'error',
              title: m.error_avatar_too_large({ size: String(AVATAR_MAX_FILE_SIZE / 1024 / 1024) }),
            })
            return
          }
          upload.mutate(file)
        }}
      />
      <Button variant='outline' disabled={upload.isPending} onClick={() => inputRef.current?.click()}>
        {upload.isPending && <Spinner />}
        {m.account_update_avatar()}
      </Button>
    </div>
  )
}
