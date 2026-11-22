import { orpc } from '@/lib/orpc-client'

export function emailPreferencesQueryOptions(userId: string | undefined) {
  return orpc.notifications.getEmailPreferences.queryOptions({
    queryKey: [...orpc.notifications.getEmailPreferences.key(), { userId }],
    enabled: Boolean(userId),
  })
}
