import { ORPCError } from '@orpc/client'
import { eq } from 'drizzle-orm'

import { DEFAULT_SETTINGS } from '@/db/constants'
import { settings } from '@/db/schemas'
import { captureServerEvent } from '@/lib/posthog'
import { POSTHOG_EVENTS } from '@/lib/posthog-events'

import { protectedProcedure } from '../procedures'
import {
  GetSettingsOutputSchema,
  UpdateSettingsInputSchema,
  UpdateSettingsOutputSchema,
} from '../schemas/settings.schema'

const getSettings = protectedProcedure.output(GetSettingsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db.select().from(settings).where(eq(settings.userId, context.session.user.id))

  if (!result) return DEFAULT_SETTINGS

  return result
})

const updateSettings = protectedProcedure
  .input(UpdateSettingsInputSchema)
  .output(UpdateSettingsOutputSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .insert(settings)
      .values({
        userId: context.session.user.id,
        ...input,
      })
      .onConflictDoUpdate({
        target: settings.userId,
        set: input,
      })
      .returning()

    if (!result) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Failed to update settings' })
    }

    captureServerEvent(
      POSTHOG_EVENTS.accountSettingsUpdated,
      {
        reply_notifications_enabled: result.replyNotificationsEnabled,
      },
      {
        headers: context.headers,
        userId: context.session.user.id,
        userRole: context.session.user.role,
      },
    )

    return result
  })

export const settingsRouter = {
  get: getSettings,
  update: updateSettings,
}
