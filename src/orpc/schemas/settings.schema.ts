import { createSelectSchema } from 'drizzle-zod'

import { settings } from '@/db/schemas'

export const GetSettingsOutputSchema = createSelectSchema(settings).pick({
  replyNotificationsEnabled: true,
})

export { GetSettingsOutputSchema as UpdateSettingsInputSchema }

export const UpdateSettingsOutputSchema = createSelectSchema(settings)
