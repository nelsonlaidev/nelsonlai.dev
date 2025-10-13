import * as z from 'zod'

export const getCommentReplyPrefsOutputSchema = z.object({
  isEnabled: z.boolean()
})

export const updateGlobalReplyPrefsInputSchema = z.object({
  isEnabled: z.boolean()
})

export const updateCommentReplyPrefsInputSchema = z.object({
  token: z.string().min(1)
})
