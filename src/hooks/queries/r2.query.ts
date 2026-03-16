import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useAvatarUploadUrl() {
  return useMutation(orpc.r2.avatarUploadUrl.mutationOptions())
}
