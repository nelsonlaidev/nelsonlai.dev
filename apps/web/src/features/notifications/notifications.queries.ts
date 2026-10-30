import { orpc } from '@/lib/orpc-client'

export function replyPreferenceQueryOptions(userId: string | undefined) {
  return orpc.notifications.getPreference.queryOptions({
    queryKey: [...orpc.notifications.getPreference.key(), { userId }],
    enabled: Boolean(userId),
  })
}
