import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useGetAvatarUploadUrl = () => {
  return useMutation(orpc.r2.getAvatarUploadUrl.mutationOptions())
}
