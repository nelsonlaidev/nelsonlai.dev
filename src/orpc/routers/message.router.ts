import { ORPCError } from '@orpc/client'
import { and, desc, eq, lt } from 'drizzle-orm'

import { messages } from '@/db/schemas'
import { IS_PRODUCTION } from '@/lib/constants'
import { sendGuestbookNotification } from '@/lib/discord'
import { getDefaultImage } from '@/utils/get-default-image'

import { protectedProcedure, publicProcedure } from '../procedures'
import { EmptyOutputSchema } from '../schemas/common.schema'
import {
  CreateMessageInputSchema,
  CreateMessageOutputSchema,
  DeleteMessageInputSchema,
  ListMessagesInputSchema,
  ListMessagesOutputSchema,
} from '../schemas/message.schema'

const listMessages = publicProcedure
  .input(ListMessagesInputSchema)
  .output(ListMessagesOutputSchema)
  .handler(async ({ input, context }) => {
    const query = await context.db.query.messages.findMany({
      where: and(input.cursor ? lt(messages.createdAt, input.cursor) : undefined),
      limit: input.limit,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
            id: true,
          },
        },
      },
      orderBy: desc(messages.updatedAt),
    })

    const result = query.map((message) => {
      const defaultImage = getDefaultImage(message.user.id)

      return {
        ...message,
        user: {
          ...message.user,
          name: message.user.name,
          image: message.user.image ?? defaultImage,
        },
      }
    })

    return {
      messages: result,
      nextCursor: result.at(-1)?.updatedAt,
    }
  })

const createMessage = protectedProcedure
  .input(CreateMessageInputSchema)
  .output(CreateMessageOutputSchema)
  .handler(async ({ input, context }) => {
    const { user } = context.session

    const [message] = await context.db
      .insert(messages)
      .values({
        body: input.message,
        userId: user.id,
      })
      .returning()

    if (!message) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create message',
      })
    }

    if (IS_PRODUCTION) {
      await sendGuestbookNotification(input.message, user.name, user.image ?? getDefaultImage(user.id))
    }

    return message
  })

const deleteMessage = protectedProcedure
  .input(DeleteMessageInputSchema)
  .output(EmptyOutputSchema)
  .handler(async ({ input, context }) => {
    const { user } = context.session

    const message = await context.db.query.messages.findFirst({
      where: and(eq(messages.id, input.id), eq(messages.userId, user.id)),
    })

    if (!message) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Message not found',
      })
    }

    await context.db.delete(messages).where(eq(messages.id, input.id))
  })

export const messageRouter = {
  list: listMessages,
  create: createMessage,
  delete: deleteMessage,
}
