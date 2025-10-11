import { z } from 'zod'

export const getReplyNotificationPrefsOutputSchema = z.object({
  isEnabled: z.boolean()
})

export const updateGlobalReplyNotificationPrefsInputSchema = z.object({
  isEnabled: z.boolean()
})

export const updateReplyNotificationPrefsInputSchema = z.object({
  commentId: z.string().min(1),
  userId: z.string().min(1),
  token: z.string().min(1)
})
