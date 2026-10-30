import { matchQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'
import { orpc } from '@/lib/orpc-client'

export function useSessionEnded() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { refetch } = authClient.useSession()

  return async function reconcileSessionEnded() {
    const privateKeys = [orpc.account.key(), orpc.admin.key(), orpc.notifications.getPreference.key()]
    const filters = {
      predicate: (query: Parameters<typeof matchQuery>[1]) =>
        privateKeys.some((queryKey) => matchQuery({ queryKey }, query)),
    }

    async function clearPrivateQueries() {
      await queryClient.cancelQueries(filters)
      queryClient.removeQueries(filters)
    }

    await clearPrivateQueries()
    try {
      try {
        // The RPC revocation does not notify Better Auth's client session atom.
        await refetch()
      } finally {
        // Guards read the server session independently of the client refresh.
        await router.invalidate()
      }
    } finally {
      // A mounted observer may have started another request during reconciliation.
      await clearPrivateQueries()
    }
  }
}
