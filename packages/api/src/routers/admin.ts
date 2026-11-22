import { ORPCError } from '@orpc/server'
import { users } from '@repo/db/schema/auth'
import { comments } from '@repo/db/schema/comments'
import { guestbookMessages as messages } from '@repo/db/schema/guestbook'
import { posts } from '@repo/db/schema/posts'
import { count, desc, eq, sql, sum } from 'drizzle-orm'

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
} from '../schema/admin'

const activityUserColumns = {
  id: sql<string>`coalesce(${users.id}, 'deleted')`,
  name: sql<string>`coalesce(${users.name}, 'Deleted user')`,
  image: users.image,
}

const commentColumns = {
  id: comments.id,
  body: comments.body,
  postSlug: comments.postSlug,
  parentId: comments.parentId,
  userId: comments.userId,
  isDeleted: comments.isDeleted,
  createdAt: comments.createdAt,
  updatedAt: comments.updatedAt,
}

const listComments = adminProcedure
  .input(ListCommentsInputSchema)
  .output(ListCommentsOutputSchema)
  .handler(async ({ input, context }) => {
    const [result, [totalCountResult]] = await Promise.all([
      context.db
        .select({
          ...commentColumns,
          user: activityUserColumns,
        })
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit)
        .orderBy(desc(comments.createdAt), desc(comments.id)),
      context.db.select({ count: count() }).from(comments),
    ])

    if (!totalCountResult) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to fetch total count of comments',
      })
    }

    return {
      comments: result.map((comment) => ({
        ...comment,
        user: comment.user ?? { id: 'deleted', name: 'Deleted user', image: null },
      })),
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
        .orderBy(desc(users.createdAt), desc(users.id)),
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
    context.db
      .select({
        id: comments.id,
        body: comments.body,
        postSlug: comments.postSlug,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
        user: activityUserColumns,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .orderBy(desc(comments.createdAt), desc(comments.id))
      .limit(10),
    context.db
      .select({ id: messages.id, body: messages.body, createdAt: messages.createdAt, user: activityUserColumns })
      .from(messages)
      .leftJoin(users, eq(messages.userId, users.id))
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .limit(10),
  ])

  const activities = [
    ...recentComments.map((comment) => ({
      type: 'comment' as const,
      id: comment.id,
      body: comment.body,
      user: comment.user ?? { id: 'deleted', name: 'Deleted user', image: null },
      postSlug: comment.postSlug,
      createdAt: comment.createdAt,
    })),
    ...recentMessages.map((message) => ({
      type: 'message' as const,
      id: message.id,
      body: message.body,
      user: message.user ?? { id: 'deleted', name: 'Deleted user', image: null },
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
    const { days, timezone } = input
    // PostgreSQL interprets signed text zones using POSIX signs. Intervals use ISO signs.
    const zone = /^[+-]/.test(timezone) ? sql`${timezone}::interval` : sql`${timezone}::text`

    const rows = await context.db.execute<{
      date: string
      comments: number
      messages: number
    }>(sql`
      WITH bounds AS (
        SELECT (NOW() AT TIME ZONE ${zone})::date AS today
      ),
      days AS (
        SELECT today - n AS day
        FROM bounds, generate_series(0, ${days} - 1) AS n
      ),
      activity AS (
        SELECT ${comments.createdAt} AS created_at, 'comment' AS kind FROM ${comments}
        UNION ALL
        SELECT ${messages.createdAt} AS created_at, 'message' AS kind FROM ${messages}
      ),
      daily_counts AS (
        SELECT
          (created_at AT TIME ZONE ${zone})::date AS day,
          COUNT(*) FILTER (WHERE kind = 'comment')::int AS comments,
          COUNT(*) FILTER (WHERE kind = 'message')::int AS messages
        FROM activity, bounds
        -- A UTC day on either side covers every offset, including repeated local midnights.
        WHERE created_at >= (today - ${days}::int)::timestamp AT TIME ZONE 'UTC'
          AND created_at < (today + 2)::timestamp AT TIME ZONE 'UTC'
        GROUP BY 1
      )
      SELECT
        days.day::text AS date,
        COALESCE(daily_counts.comments, 0) AS comments,
        COALESCE(daily_counts.messages, 0) AS messages
      FROM days
      LEFT JOIN daily_counts USING (day)
      ORDER BY days.day
    `)

    return rows.rows
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
