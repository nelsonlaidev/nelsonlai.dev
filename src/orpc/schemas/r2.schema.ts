import * as z from 'zod'

import { AVATAR_MAX_FILE_SIZE, SUPPORTED_AVATAR_MIME_TYPES } from '@/lib/constants'

export const GetAvatarUploadUrlInputSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(SUPPORTED_AVATAR_MIME_TYPES),
  fileSize: z.number().int().positive().max(AVATAR_MAX_FILE_SIZE),
})

export const GetAvatarUploadUrlOutputSchema = z.object({
  uploadUrl: z.url(),
  publicUrl: z.url(),
  key: z.string(),
})
