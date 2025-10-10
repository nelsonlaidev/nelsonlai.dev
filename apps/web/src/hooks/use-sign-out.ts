import { useRouter } from '@repo/i18n/routing'
import { toast } from '@repo/ui/components/sonner'
import { useTranslations } from 'next-intl'

import { authClient } from '@/lib/auth-client'

type UseSignOutOptions = {
  redirectTo?: string
}

export const useSignOut = (options: UseSignOutOptions = {}) => {
  const { redirectTo } = options

  const router = useRouter()
  const t = useTranslations()

  return async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          if (redirectTo) {
            router.push(redirectTo)
          } else {
            router.refresh()
          }
          toast.success(t('auth.sign-out-successfully'))
        },
        onError: () => {
          toast.error(t('auth.sign-out-failed'))
        }
      }
    })
  }
}
