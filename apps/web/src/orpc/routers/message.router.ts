import { ORPCError } from '@orpc/client'
import { and, desc, eq, lt, messages } from '@repo/db'

import { IS_PRODUCTION } from '@/lib/constants'
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
} from '../schemas/message.schema'

export const listMessages = publicProcedure
  .input(listMessagesInputSchema)
  .output(listMessagesOutputSchema)
  .handler(async ({ input, context }) => {
    const query = await context.db.query.messages.findMany({
      where: and(input.cursor ? lt(messages.createdAt, input.cursor) : undefined),
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
      orderBy: desc(messages.updatedAt)
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
      .insert(messages)
      .values({
        body: input.message,
        userId: user.id
      })
      .returning()

    if (!message) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create message'
      })
    }

    if (IS_PRODUCTION) {
      await sendGuestbookNotification(input.message, user.name, user.image ?? getDefaultImage(user.id))
    }

    return message
  })

export const deleteMessage = protectedProcedure
  .input(deleteMessageInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    const user = context.session.user

    const message = await context.db.query.messages.findFirst({
      where: and(eq(messages.id, input.id), eq(messages.userId, user.id))
    })

    if (!message) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Message not found'
      })
    }

    await context.db.delete(messages).where(eq(messages.id, input.id))
  })
