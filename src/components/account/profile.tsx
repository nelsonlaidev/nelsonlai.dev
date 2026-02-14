'use client'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useUpdateUser } from '@/hooks/queries/auth.query'
import { useGetAvatarUploadUrl } from '@/hooks/queries/r2.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { type User, useSession } from '@/lib/auth-client'
import { AVATAR_MAX_FILE_SIZE, type AvatarMimeType, SUPPORTED_AVATAR_MIME_TYPES } from '@/lib/constants'
import { getAbbreviation } from '@/utils/get-abbreviation'

import { Spinner } from '../ui/spinner'

import ProfileSkeleton from './profile-skeleton'

function Profile() {
  const { data, isPending: isSessionLoading } = useSession()
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>{t('account.profile')}</h2>
      {isSessionLoading && <ProfileSkeleton />}
      {data && <ProfileInfo user={data.user} />}
    </div>
  )
}

type ProfileInfoProps = {
  user: User
}

function ProfileInfo(props: ProfileInfoProps) {
  const { user } = props
  const createdAt = useFormattedDate(user.createdAt)
  const t = useTranslations()

  return (
    <Card className='p-4 sm:p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.avatar')}</span>
          <Avatar className='size-24'>
            <AvatarImage
              src={user.image ?? undefined}
              alt={t('common.avatar-alt', { name: user.name })}
              className='size-full'
            />
            <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
          </Avatar>
        </div>
        <UpdateAvatar />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.display-name')}</span>
          <span>{user.name}</span>
        </div>
        <EditName name={user.name} />
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.email')}</span>
          <span>{user.email}</span>
        </div>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.account-created')}</span>
          <span>{createdAt ?? '--'}</span>
        </div>
      </div>
    </Card>
  )
}

type EditNameProps = {
  name: string
}

function EditName(props: EditNameProps) {
  const { name } = props
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const { refetch: refetchSession } = useSession()

  const EditNameFormSchema = z.object({
    name: z.string().min(1, t('error.name-cannot-be-empty')).max(50, t('error.name-too-long')),
  })

  const form = useForm({
    defaultValues: {
      name,
    },
    validators: {
      onSubmit: EditNameFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isUpdating) return
      updateUser({ name: value.name })
    },
  })

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(() => {
    setOpen(false)
    toast.success(t('success.name-updated'))
    void refetchSession()
  })

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void form.handleSubmit()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant='outline'>{t('account.edit-name')}</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('account.edit-name')}</AlertDialogTitle>
          <AlertDialogDescription>{t('account.edit-name-description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <form className='space-y-6' id='edit-name-form' onSubmit={handleSubmit}>
          <FieldGroup>
            <form.Field name='name'>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      disabled={isUpdating}
                      placeholder={t('account.display-name')}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>{t('common.cancel')}</AlertDialogCancel>
          <Button type='submit' form='edit-name-form' disabled={isUpdating}>
            {isUpdating && <Spinner data-icon='inline-start' />}
            {t('common.save')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function UpdateAvatar() {
  const t = useTranslations()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { refetch: refetchSession } = useSession()

  const { mutateAsync: getAvatarUploadUrl } = useGetAvatarUploadUrl()
  const { mutateAsync: updateUser } = useUpdateUser(() => {
    toast.success(t('success.avatar-updated'))
    void refetchSession()
  })

  function handleSelectFile() {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    event.target.value = ''

    if (!SUPPORTED_AVATAR_MIME_TYPES.includes(file.type as AvatarMimeType)) {
      toast.error(t('error.avatar-unsupported-file'))
      return
    }

    if (file.size > AVATAR_MAX_FILE_SIZE) {
      const maxSizeInMb = (AVATAR_MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)
      toast.error(t('error.avatar-too-large', { size: maxSizeInMb }))
      return
    }

    try {
      setIsUploading(true)

      const { uploadUrl, publicUrl } = await getAvatarUploadUrl({
        fileName: file.name,
        fileType: file.type as AvatarMimeType,
        fileSize: file.size,
      })

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      await updateUser({ image: publicUrl })
    } catch {
      toast.error(t('error.update-avatar-failed'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type='file'
        accept={SUPPORTED_AVATAR_MIME_TYPES.join(',')}
        className='hidden'
        onChange={handleFileChange}
      />
      <Button variant='outline' onClick={handleSelectFile} disabled={isUploading}>
        {t('account.update-avatar')}
      </Button>
    </div>
  )
}

export default Profile
