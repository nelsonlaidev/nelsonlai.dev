import { settings } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'

export const GetSettingsOutputSchema = createSelectSchema(settings).pick({
  replyNotificationsEnabled: true
})

export { GetSettingsOutputSchema as UpdateSettingsInputSchema }

export const UpdateSettingsOutputSchema = createSelectSchema(settings)
