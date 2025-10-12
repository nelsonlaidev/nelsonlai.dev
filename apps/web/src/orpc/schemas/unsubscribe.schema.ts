import { z } from 'zod'

export const getCommentReplyPrefsOutputSchema = z.object({
  isEnabled: z.boolean()
})

export const updateGlobalReplyPrefsInputSchema = z.object({
  isEnabled: z.boolean()
})

export const updateCommentReplyPrefsInputSchema = z.object({
  commentId: z.string().min(1),
  userId: z.string().min(1),
  token: z.string().min(1)
})
