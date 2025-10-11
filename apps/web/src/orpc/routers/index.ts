import type { Inputs, Outputs } from '../client'

import { listAllComments, listAllUsers } from './admin.route'
import { listSessions, revokeSession, updateUser } from './auth.route'
import { likesStats, viewsStats } from './blog.route'
import { countComments, createComment, deleteComment, listComments } from './comments.route'
import { githubStats } from './github.route'
import { createMessage, deleteMessage, listMessages } from './guestbook.route'
import { countLike, incrementLike } from './likes.route'
import { getAvatarUploadUrl } from './r2.route'
import { countReplies } from './replies.route'
import { spotifyStats } from './spotify.route'
import {
  getReplyNotificationPrefs,
  updateGlobalReplyNotificationPrefs,
  updateReplyNotificationPrefs
} from './unsubscribes.route'
import { countView, incrementView } from './views.route'
import { createVote } from './votes.route'
import { wakatimeStats } from './wakatime.route'
import { youtubeStats } from './youtube.route'

export const router = {
  stats: {
    github: githubStats,
    youtube: youtubeStats,
    wakatime: wakatimeStats,
    spotify: spotifyStats,
    blog: {
      views: viewsStats,
      likes: likesStats
    }
  },
  posts: {
    views: {
      count: countView,
      increment: incrementView
    },
    likes: {
      count: countLike,
      increment: incrementLike
    },
    comments: {
      list: listComments,
      create: createComment,
      delete: deleteComment,
      count: countComments
    },
    replies: {
      count: countReplies
    },
    votes: {
      create: createVote
    }
  },
  guestbook: {
    list: listMessages,
    create: createMessage,
    delete: deleteMessage
  },
  admin: {
    listAllComments,
    listAllUsers
  },
  auth: {
    listSessions,
    revokeSession,
    updateUser
  },
  r2: {
    getAvatarUploadUrl
  },
  unsubscribes: {
    getReplyNotificationPrefs,
    updateGlobalReplyNotificationPrefs,
    updateReplyNotificationPrefs
  }
}

export type ListCommentsInput = Inputs['posts']['comments']['list']
export type ListCommentsOutput = Outputs['posts']['comments']['list']

export type ListMessagesOutput = Outputs['guestbook']['list']

export type ListAllCommentsOutput = Outputs['admin']['listAllComments']
export type ListAllUsersOutput = Outputs['admin']['listAllUsers']

export type CountViewOutput = Outputs['posts']['views']['count']
export type CountLikeOutput = Outputs['posts']['likes']['count']

export type ListSessionsOutput = Outputs['auth']['listSessions']
