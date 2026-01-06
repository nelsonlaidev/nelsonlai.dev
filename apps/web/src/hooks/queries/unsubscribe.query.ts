import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useCreateCommentReplyUnsubscribe(onSuccess?: () => void) {
  return useMutation(orpc.unsubscribe.createCommentReply.mutationOptions({ onSuccess }))
}
