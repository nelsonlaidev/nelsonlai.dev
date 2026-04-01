import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { usePathname, useRouter } from '@/i18n/routing'
import { authClient } from '@/lib/auth-client'
import { captureClientEvent, resetPostHogUser } from '@/lib/posthog-client'
import { POSTHOG_EVENTS } from '@/lib/posthog-events'

type UseSignOutOptions = {
  redirectTo?: string
}

export function useSignOut(options: UseSignOutOptions = {}) {
  const { redirectTo } = options

  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()

  return async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          captureClientEvent(POSTHOG_EVENTS.authSignOutSucceeded, {}, { locale, pathname })
          resetPostHogUser({ locale, pathname })

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
