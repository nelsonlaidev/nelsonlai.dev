import { useTranslations } from 'next-intl'

import { toast } from '@/components/ui/toast'
import { useRouter } from '@/i18n/navigation'
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
          toast.add({ type: 'success', title: t('success.signed-out') })
        },
        onError: () => {
          toast.add({ type: 'error', title: t('error.sign-out-failed') })
        },
      },
    })
  }
}
