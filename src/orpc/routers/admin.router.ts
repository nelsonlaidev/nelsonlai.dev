import { ORPCError } from '@orpc/client'
import { count, desc, sql, sum } from 'drizzle-orm'

import { comments, messages, posts, users } from '@/db/schemas'

import { adminProcedure } from '../procedures'
import {
  ListCommentsInputSchema,
  ListCommentsOutputSchema,
  ListUsersInputSchema,
  ListUsersOutputSchema,
  RecentActivityOutputSchema,
  StatsOutputSchema,
  TrendsInputSchema,
  TrendsOutputSchema,
} from '../schemas/admin.schema'

const listComments = adminProcedure
  .input(ListCommentsInputSchema)
  .output(ListCommentsOutputSchema)
  .handler(async ({ input, context }) => {
    const [result, [totalCountResult]] = await Promise.all([
      context.db.query.comments.findMany({
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
        },
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
        orderBy: desc(comments.createdAt),
      }),
      context.db.select({ count: count() }).from(comments),
    ])

    if (!totalCountResult) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to fetch total count of comments',
      })
    }

    return {
      comments: result,
      pageCount: Math.ceil(totalCountResult.count / input.limit),
      totalCount: totalCountResult.count,
    }
  })

const listUsers = adminProcedure
  .input(ListUsersInputSchema)
  .output(ListUsersOutputSchema)
  .handler(async ({ input, context }) => {
    const [result, [totalCountResult]] = await Promise.all([
      context.db
        .select({
          id: users.id,
          name: users.name,
          image: users.image,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .limit(input.limit)
        .offset((input.page - 1) * input.limit)
        .orderBy(desc(users.createdAt)),
      context.db.select({ count: count() }).from(users),
    ])

    if (!totalCountResult) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to fetch total count of users',
      })
    }

    return {
      users: result,
      pageCount: Math.ceil(totalCountResult.count / input.limit),
      totalCount: totalCountResult.count,
    }
  })

const getStats = adminProcedure.output(StatsOutputSchema).handler(async ({ context }) => {
  const [[usersResult], [commentsResult], [messagesResult], [postsResult]] = await Promise.all([
    context.db.select({ count: count() }).from(users),
    context.db.select({ count: count() }).from(comments),
    context.db.select({ count: count() }).from(messages),
    context.db.select({ totalViews: sum(posts.views), totalLikes: sum(posts.likes) }).from(posts),
  ])

  return {
    totalUsers: usersResult?.count ?? 0,
    totalComments: commentsResult?.count ?? 0,
    totalMessages: messagesResult?.count ?? 0,
    totalViews: Number(postsResult?.totalViews ?? 0),
    totalLikes: Number(postsResult?.totalLikes ?? 0),
  }
})

const getRecentActivity = adminProcedure.output(RecentActivityOutputSchema).handler(async ({ context }) => {
  const [recentComments, recentMessages] = await Promise.all([
    context.db.query.comments.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: desc(comments.createdAt),
      limit: 10,
    }),
    context.db.query.messages.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: desc(messages.createdAt),
      limit: 10,
    }),
  ])

  const activities = [
    ...recentComments.map((comment) => ({
      type: 'comment' as const,
      id: comment.id,
      body: comment.body,
      user: comment.user,
      postId: comment.postId,
      createdAt: comment.createdAt,
    })),
    ...recentMessages.map((message) => ({
      type: 'message' as const,
      id: message.id,
      body: message.body,
      user: message.user,
      createdAt: message.createdAt,
    })),
  ]
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)

  return { activities }
})

const getTrends = adminProcedure
  .input(TrendsInputSchema)
  .output(TrendsOutputSchema)
  .handler(async ({ input, context }) => {
    const { timezone, days } = input

    const rows = await context.db.execute(sql`
      WITH boundaries AS (
        SELECT
          (NOW() AT TIME ZONE ${timezone})::date - (${days} - 1) AS start_day,
          (NOW() AT TIME ZONE ${timezone})::date                 AS end_day
      ),
      date_series AS (
        SELECT generate_series(
          (SELECT start_day FROM boundaries),
          (SELECT end_day   FROM boundaries),
          INTERVAL '1 day'
        )::date AS day
      ),
      comment_counts AS (
        SELECT
          (${comments.createdAt} AT TIME ZONE ${timezone})::date AS day,
          COUNT(*)::int AS count
        FROM ${comments}
        WHERE ${comments.createdAt} >= (SELECT start_day FROM boundaries)::timestamp AT TIME ZONE ${timezone}
          AND ${comments.createdAt} <  (SELECT end_day   FROM boundaries)::timestamp AT TIME ZONE ${timezone} + INTERVAL '1 day'
        GROUP BY 1
      ),
      message_counts AS (
        SELECT
          (${messages.createdAt} AT TIME ZONE ${timezone})::date AS day,
          COUNT(*)::int AS count
        FROM ${messages}
        WHERE ${messages.createdAt} >= (SELECT start_day FROM boundaries)::timestamp AT TIME ZONE ${timezone}
          AND ${messages.createdAt} <  (SELECT end_day   FROM boundaries)::timestamp AT TIME ZONE ${timezone} + INTERVAL '1 day'
        GROUP BY 1
      )
      SELECT
        ds.day::text          AS date,
        COALESCE(cc.count, 0) AS comments,
        COALESCE(mc.count, 0) AS messages
      FROM date_series ds
      LEFT JOIN comment_counts cc ON cc.day = ds.day
      LEFT JOIN message_counts mc ON mc.day = ds.day
      ORDER BY ds.day ASC
    `)

    return rows.map((row) => ({
      date: row.date as string,
      comments: row.comments as number,
      messages: row.messages as number,
    }))
  })

export const adminRouter = {
  comment: {
    list: listComments,
  },
  user: {
    list: listUsers,
  },
  stats: getStats,
  recentActivity: getRecentActivity,
  trends: getTrends,
}
