import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, desc, eq, guestbook, lt } from '@repo/db'

import { sendGuestbookNotification } from '@/lib/discord'
import { getDefaultImage } from '@/utils/get-default-image'

import { protectedProcedure, publicProcedure } from '../root'
import { emptyOutputSchema } from '../schemas/common.schema'
import {
  createMessageInputSchema,
  createMessageOutputSchema,
  deleteMessageInputSchema,
  listMessagesInputSchema,
  listMessagesOutputSchema
} from '../schemas/guestbook.schema'

export const listMessages = publicProcedure
  .input(listMessagesInputSchema)
  .output(listMessagesOutputSchema)
  .handler(async ({ input, context }) => {
    const query = await context.db.query.guestbook.findMany({
      where: and(input.cursor ? lt(guestbook.createdAt, input.cursor) : undefined),
      limit: input.limit,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
            id: true
          }
        }
      },
      orderBy: desc(guestbook.updatedAt)
    })

    const result = query.map((message) => {
      const defaultImage = getDefaultImage(message.user.id)

      return {
        ...message,
        user: {
          ...message.user,
          name: message.user.name,
          image: message.user.image ?? defaultImage
        }
      }
    })

    return {
      messages: result,
      nextCursor: result.at(-1)?.updatedAt
    }
  })

export const createMessage = protectedProcedure
  .input(createMessageInputSchema)
  .output(createMessageOutputSchema)
  .handler(async ({ input, context }) => {
    const user = context.session.user

    const [message] = await context.db
      .insert(guestbook)
      .values({
        id: createId(),
        body: input.message,
        userId: user.id
      })
      .returning()

    if (!message) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create message'
      })
    }

    await sendGuestbookNotification(input.message, user.name, user.image ?? getDefaultImage(user.id))

    return message
  })

export const deleteMessage = protectedProcedure
  .input(deleteMessageInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    const user = context.session.user

    const message = await context.db.query.guestbook.findFirst({
      where: and(eq(guestbook.id, input.id), eq(guestbook.userId, user.id))
    })

    if (!message) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Message not found'
      })
    }

    await context.db.delete(guestbook).where(eq(guestbook.id, input.id))
  })
