import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useCreateCommentUnsubscribe(onSuccess?: () => void) {
  return useMutation(orpc.unsubscribe.createComment.mutationOptions({ onSuccess }))
}
