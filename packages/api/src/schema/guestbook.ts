import * as z from 'zod'

import { InfiniteQueryCursorSchema } from './pagination'

export const GUESTBOOK_MESSAGE_MAX_LENGTH = 500

export const CreateGuestbookMessageInputSchema = z.object({
  body: z.string().trim().min(1).max(GUESTBOOK_MESSAGE_MAX_LENGTH),
})

export const GuestbookMessageSchema = z.object({
  id: z.string(),
  body: z.string(),
  userId: z.string(),
  createdAt: z.date(),
})

export const ListGuestbookMessagesOutputSchema = z.object({
  messages: z.array(
    GuestbookMessageSchema.extend({
      user: z.object({ id: z.string(), name: z.string(), image: z.string().nullable() }),
    }),
  ),
  nextCursor: InfiniteQueryCursorSchema.optional(),
})

export const DeleteGuestbookMessageInputSchema = z.object({
  id: z.string().min(1),
})
