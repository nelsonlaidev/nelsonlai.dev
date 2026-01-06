import { ORPCError } from '@orpc/client'
import { DEFAULT_SETTINGS, eq, settings } from '@repo/db'

import { protectedProcedure } from '../orpc'
import {
  GetSettingsOutputSchema,
  UpdateSettingsInputSchema,
  UpdateSettingsOutputSchema
} from '../schemas/settings.schema'

const getSettings = protectedProcedure.output(GetSettingsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db.select().from(settings).where(eq(settings.userId, context.session.user.id))

  if (!result) return DEFAULT_SETTINGS

  return result
})

const updateSettings = protectedProcedure
  .input(UpdateSettingsInputSchema)
  .output(UpdateSettingsOutputSchema)
  .handler(async ({ context, input }) => {
    const [result] = await context.db
      .insert(settings)
      .values({
        userId: context.session.user.id,
        ...input
      })
      .onConflictDoUpdate({
        target: settings.userId,
        set: input
      })
      .returning()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!result) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Failed to update settings' })
    }

    return result
  })

export const settingsRouter = {
  get: getSettings,
  update: updateSettings
}
