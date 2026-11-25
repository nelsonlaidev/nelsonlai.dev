import { ORPCError } from '@orpc/client'

import { m } from '@/paraglide/messages'

export function getMutationErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ORPCError && error.code === 'TOO_MANY_REQUESTS') {
    return m.error_too_many_requests()
  }

  return fallbackMessage
}
