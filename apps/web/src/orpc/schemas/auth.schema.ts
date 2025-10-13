import { sessions } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

export const listSessionsOutputSchema = z.object({
  sessions: z.array(
    createSelectSchema(sessions).extend({
      isCurrentSession: z.boolean(),
      location: z.string().nullable()
    })
  )
})

export const revokeSessionInputSchema = z.object({
  token: z.string()
})

export const updateUserInputSchema = z
  .object({
    name: z.string().min(1).max(50).optional(),
    image: z.url().nullable().optional()
  })
  .refine((value) => value.name !== undefined || value.image !== undefined, {
    message: 'At least one field is required'
  })
