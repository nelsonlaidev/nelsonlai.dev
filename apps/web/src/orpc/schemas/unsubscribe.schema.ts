import * as z from 'zod'

export const GetCommentReplyPrefsOutputSchema = z.object({
  isEnabled: z.boolean()
})

export const UpdateGlobalReplyPrefsInputSchema = z.object({
  isEnabled: z.boolean()
})

export const UpdateCommentReplyPrefsInputSchema = z.object({
  token: z.string().min(1)
})
