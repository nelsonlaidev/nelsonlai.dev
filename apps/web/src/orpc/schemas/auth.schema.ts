import { sessions } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import z from 'zod'

export const listSessionsOutputSchema = z.object({
  sessions: z.array(
    createSelectSchema(sessions).extend({
      isCurrentSession: z.boolean()
    })
  )
})

export const revokeSessionInputSchema = z.object({
  token: z.string()
})
