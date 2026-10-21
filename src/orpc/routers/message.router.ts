import { ORPCError } from '@orpc/client'
import { and, eq } from 'drizzle-orm'

import { IS_PRODUCTION } from '@/constants/common'
import { messages } from '@/db/schemas'
import { sendGuestbookNotification } from '@/lib/discord'
import { getDefaultImage } from '@/utils/get-default-image'

import { createTimestampPagination } from '../pagination'
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
    const pagination = createTimestampPagination(messages, input)

    const query = await context.db.query.messages.findMany({
      where: pagination.where,
      limit: pagination.limit,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
            id: true,
          },
        },
      },
      orderBy: pagination.orderBy,
    })

    const { items, nextCursor } = pagination.getPage(query)

    const result = items.map((message) => {
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
      nextCursor,
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
