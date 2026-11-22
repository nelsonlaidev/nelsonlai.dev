import * as z from 'zod'

const PaginationInputSchema = z.object({
  page: z.number().int().min(1).max(1_000_000).default(1),
  limit: z.number().int().min(1).max(100).default(10),
})

export const ListCommentsInputSchema = PaginationInputSchema
export const ListUsersInputSchema = PaginationInputSchema

const ActivityUserSchema = z.object({ id: z.string(), name: z.string(), image: z.string().nullable() })

export const ListCommentsOutputSchema = z.object({
  comments: z.array(
    z.object({
      id: z.string(),
      body: z.string(),
      postId: z.string(),
      parentId: z.string().nullable(),
      userId: z.string().nullable(),
      isDeleted: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
      user: ActivityUserSchema,
    }),
  ),
  pageCount: z.number(),
  totalCount: z.number(),
})

export const ListUsersOutputSchema = z.object({
  users: z.array(ActivityUserSchema.extend({ email: z.string(), role: z.string().nullable(), createdAt: z.date() })),
  pageCount: z.number(),
  totalCount: z.number(),
})

export const StatsOutputSchema = z.object({
  totalUsers: z.number(),
  totalComments: z.number(),
  totalMessages: z.number(),
  totalViews: z.number(),
  totalLikes: z.number(),
})

export const RecentActivityOutputSchema = z.object({
  activities: z.array(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('comment'),
        id: z.string(),
        body: z.string(),
        user: ActivityUserSchema,
        postId: z.string(),
        createdAt: z.date(),
      }),
      z.object({
        type: z.literal('message'),
        id: z.string(),
        body: z.string(),
        user: ActivityUserSchema,
        createdAt: z.date(),
      }),
    ]),
  ),
})

export const TrendsInputSchema = z.object({
  days: z.number().int().min(1).max(365),
  timezone: z
    .string()
    .max(100)
    .transform((timezone, ctx) => {
      try {
        return Intl.DateTimeFormat('en-US', { timeZone: timezone }).resolvedOptions().timeZone
      } catch {
        ctx.issues.push({ code: 'custom', input: timezone, message: 'Invalid time zone' })
        return z.NEVER
      }
    }),
})

export const TrendsOutputSchema = z.array(z.object({ date: z.string(), comments: z.number(), messages: z.number() }))
