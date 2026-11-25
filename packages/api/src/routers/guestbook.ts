import { ORPCError } from '@orpc/server'
import { users } from '@repo/db/schema/auth'
import { guestbookMessages } from '@repo/db/schema/guestbook'
import { and, eq } from 'drizzle-orm'
import * as z from 'zod'

import { sendGuestbookNotification } from '../lib/discord'
import { createTimestampPagination } from '../pagination'
import { protectedProcedure, publicProcedure } from '../procedures'
import {
  CreateGuestbookMessageInputSchema,
  DeleteGuestbookMessageInputSchema,
  GuestbookMessageSchema,
  ListGuestbookMessagesOutputSchema,
} from '../schema/guestbook'
import { InfiniteQueryInputSchema } from '../schema/pagination'

const listMessages = publicProcedure
  .input(InfiniteQueryInputSchema)
  .output(ListGuestbookMessagesOutputSchema)
  .handler(async ({ input, context }) => {
    const pagination = createTimestampPagination(guestbookMessages, input)
    const rows = await context.db
      .select({
        id: guestbookMessages.id,
        body: guestbookMessages.body,
        userId: guestbookMessages.userId,
        createdAt: guestbookMessages.createdAt,
        user: { id: users.id, name: users.name, image: users.image },
      })
      .from(guestbookMessages)
      .innerJoin(users, eq(guestbookMessages.userId, users.id))
      .where(pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit)

    const { items, nextCursor } = pagination.getPage(rows)

    return { messages: items, nextCursor }
  })

const createMessage = protectedProcedure
  .input(CreateGuestbookMessageInputSchema)
  .output(GuestbookMessageSchema)
  .handler(async ({ input, context }) => {
    const { user } = context.session
    const [message] = await context.db
      .insert(guestbookMessages)
      .values({ body: input.body, userId: user.id })
      .returning()

    if (!message) {
      throw new ORPCError('INTERNAL_SERVER_ERROR')
    }

    await sendGuestbookNotification(message.body, user.name, user.image ?? null)

    return message
  })

const deleteMessage = protectedProcedure
  .input(DeleteGuestbookMessageInputSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    const deleted = await context.db
      .delete(guestbookMessages)
      .where(and(eq(guestbookMessages.id, input.id), eq(guestbookMessages.userId, context.session.user.id)))
      .returning({ id: guestbookMessages.id })

    if (deleted.length === 0) {
      throw new ORPCError('NOT_FOUND')
    }
  })

export const guestbookRouter = {
  list: listMessages,
  create: createMessage,
  delete: deleteMessage,
}
