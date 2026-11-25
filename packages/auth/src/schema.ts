import * as z from 'zod'

export const DISPLAY_NAME_MAX_LENGTH = 50

export const UpdateNameInputSchema = z.object({
  name: z.string().trim().min(1).max(DISPLAY_NAME_MAX_LENGTH),
})
