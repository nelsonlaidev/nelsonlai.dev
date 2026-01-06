import * as z from 'zod'

export const CreateCommentUnsubscribeInputSchema = z.object({
  token: z.string().min(1)
})
