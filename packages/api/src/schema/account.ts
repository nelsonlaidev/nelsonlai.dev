import * as z from 'zod'

export const AVATAR_MAX_FILE_SIZE = 2 * 1024 * 1024
export const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const UpdateNameInputSchema = z.object({ name: z.string().trim().min(1).max(50) })

export const AccountSessionsSchema = z.array(
  z.object({
    id: z.string(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    updatedAt: z.date(),
    isCurrentSession: z.boolean(),
    location: z.string().nullable(),
  }),
)

export const RevokeSessionInputSchema = z.object({ id: z.string().min(1) })

export const UpdateAvatarInputSchema = z
  .file()
  .min(1)
  .max(AVATAR_MAX_FILE_SIZE)
  .mime([...AVATAR_MIME_TYPES])
