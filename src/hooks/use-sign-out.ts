import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { useRouter } from '@/i18n/routing'
import { authClient } from '@/lib/auth-client'

type UseSignOutOptions = {
  redirectTo?: string
}

export function useSignOut(options: UseSignOutOptions = {}) {
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
          toast.success(t('success.signed-out'))
        },
        onError: () => {
          toast.error(t('error.sign-out-failed'))
        },
      },
    })
  }
}
