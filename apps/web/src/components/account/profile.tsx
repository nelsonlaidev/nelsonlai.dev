'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@repo/ui/components/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { Button } from '@repo/ui/components/button'
import { Card } from '@repo/ui/components/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { toast } from '@repo/ui/components/sonner'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useUpdateUser } from '@/hooks/queries/auth.query'
import { useGetAvatarUploadUrl } from '@/hooks/queries/r2.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { type User, useSession } from '@/lib/auth-client'
import { AVATAR_MAX_FILE_SIZE, type AvatarMimeType, SUPPORTED_AVATAR_MIME_TYPES } from '@/lib/constants'
import { getAbbreviation } from '@/utils/get-abbreviation'

import ProfileSkeleton from './profile-skeleton'

const Profile = () => {
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

const ProfileInfo = (props: ProfileInfoProps) => {
  const { user } = props
  const createdAt = useFormattedDate(user.createdAt)
  const t = useTranslations()

  return (
    <Card className='p-4 sm:p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.avatar')}</span>
          <Avatar className='size-24'>
            <AvatarImage src={user.image ?? undefined} className='size-full' />
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
          <span>{createdAt}</span>
        </div>
      </div>
    </Card>
  )
}

type EditNameProps = {
  name: string
}

const EditName = (props: EditNameProps) => {
  const { name } = props
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const { refetch: refetchSession } = useSession()

  const editNameFormSchema = z.object({
    name: z.string().min(1, t('error.name-cannot-be-empty')).max(50, t('error.name-too-long'))
  })

  const form = useForm<z.infer<typeof editNameFormSchema>>({
    resolver: zodResolver(editNameFormSchema),
    defaultValues: {
      name
    }
  })

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(() => {
    form.reset({ name: form.getValues('name') })
    setOpen(false)
    toast.success(t('account.edit-name-successfully'))
    refetchSession()
  })

  const onSubmit = (values: z.infer<typeof editNameFormSchema>) => {
    if (isUpdating) return
    updateUser({ name: values.name })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline'>{t('account.edit-name')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('account.edit-name')}</AlertDialogTitle>
              <AlertDialogDescription>{t('account.edit-name-description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account.display-name')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('account.display-name')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <Button type='submit'>{t('common.save')}</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const UpdateAvatar = () => {
  const t = useTranslations()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { refetch: refetchSession } = useSession()

  const { mutateAsync: getAvatarUploadUrl } = useGetAvatarUploadUrl()
  const { mutateAsync: updateUser } = useUpdateUser(() => {
    toast.success(t('account.update-avatar-successfully'))
    refetchSession()
  })

  const handleSelectFile = () => {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        fileSize: file.size
      })

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
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
