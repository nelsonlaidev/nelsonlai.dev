import { defineRelations } from 'drizzle-orm'

import * as schema from './schema'

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions(),
    accounts: r.many.accounts(),
    guestbookMessages: r.many.guestbookMessages(),
    comments: r.many.comments(),
    commentVotes: r.many.commentVotes(),
    commentNotificationPreference: r.one.commentNotificationPreferences({
      from: r.users.id,
      to: r.commentNotificationPreferences.userId,
    }),
    commentReplyUnsubscribes: r.many.commentReplyUnsubscribes(),
  },
  sessions: {
    user: r.one.users({ from: r.sessions.userId, to: r.users.id, optional: false }),
  },
  accounts: {
    user: r.one.users({ from: r.accounts.userId, to: r.users.id, optional: false }),
  },
  guestbookMessages: {
    user: r.one.users({ from: r.guestbookMessages.userId, to: r.users.id, optional: false }),
  },
  posts: {
    comments: r.many.comments(),
    postLikes: r.many.postLikes(),
  },
  postLikes: {
    post: r.one.posts({ from: r.postLikes.postSlug, to: r.posts.slug, optional: false }),
  },
  comments: {
    post: r.one.posts({ from: r.comments.postSlug, to: r.posts.slug, optional: false }),
    user: r.one.users({ from: r.comments.userId, to: r.users.id }),
    parent: r.one.comments({ from: r.comments.parentId, to: r.comments.id, alias: 'commentReplies' }),
    replies: r.many.comments({ alias: 'commentReplies' }),
    votes: r.many.commentVotes(),
    replyUnsubscribes: r.many.commentReplyUnsubscribes(),
  },
  commentVotes: {
    user: r.one.users({ from: r.commentVotes.userId, to: r.users.id, optional: false }),
    comment: r.one.comments({ from: r.commentVotes.commentId, to: r.comments.id, optional: false }),
  },
  commentNotificationPreferences: {
    user: r.one.users({ from: r.commentNotificationPreferences.userId, to: r.users.id, optional: false }),
  },
  commentReplyUnsubscribes: {
    user: r.one.users({ from: r.commentReplyUnsubscribes.userId, to: r.users.id, optional: false }),
    comment: r.one.comments({ from: r.commentReplyUnsubscribes.commentId, to: r.comments.id, optional: false }),
  },
}))
