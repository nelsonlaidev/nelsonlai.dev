import { sessions } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import z from 'zod'

export const listSessionsSchema = z.object({
  sessions: z.array(
    createSelectSchema(sessions).extend({
      isCurrentSession: z.boolean()
    })
  )
})
