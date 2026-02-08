import { relations } from 'drizzle-orm'

import { accounts, sessions, users } from './auth.schema'
import { comments, votes } from './comment.schema'
import { messages } from './message.schema'
import { postLikes } from './post-like.schema'
import { posts } from './post.schema'
import { settings } from './settings.schema'
import { unsubscribes } from './unsubscribe.schema'

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  comments: many(comments),
  messages: many(messages),
  unsubscribes: many(unsubscribes),
  settings: one(settings),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.slug],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comment_replies',
  }),
  replies: many(comments, {
    relationName: 'comment_replies',
  }),
  votes: many(votes),
  unsubscribes: many(unsubscribes),
}))

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [votes.commentId],
    references: [comments.id],
  }),
}))

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
}))

export const messageRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}))

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
}))

export const unsubscribesRelations = relations(unsubscribes, ({ one }) => ({
  user: one(users, {
    fields: [unsubscribes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [unsubscribes.commentId],
    references: [comments.id],
  }),
}))

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.slug],
  }),
}))
