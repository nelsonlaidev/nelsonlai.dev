import type { Inputs, Outputs } from '../client'

import { listAllComments, listAllUsers } from './admin.router'
import { listSessions, revokeSession, updateUser } from './auth.router'
import { likesStats, viewsStats } from './blog.router'
import { countComments, createComment, deleteComment, listComments } from './comment.router'
import { githubStats } from './github.router'
import { countLike, incrementLike } from './like.router'
import { createMessage, deleteMessage, listMessages } from './message.router'
import { getAvatarUploadUrl } from './r2.router'
import { countReplies } from './reply.router'
import { spotifyStats } from './spotify.router'
import { getReplyPrefs, updateCommentReplyPrefs, updateReplyPrefs } from './unsubscribe.router'
import { countView, incrementView } from './view.router'
import { createVote } from './vote.router'
import { wakatimeStats } from './wakatime.router'
import { youtubeStats } from './youtube.router'

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
  messages: {
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
    getReplyPrefs,
    updateReplyPrefs,
    updateCommentReplyPrefs
  }
}

export type ListCommentsInput = Inputs['posts']['comments']['list']
export type ListCommentsOutput = Outputs['posts']['comments']['list']

export type ListMessagesOutput = Outputs['messages']['list']

export type ListAllCommentsOutput = Outputs['admin']['listAllComments']
export type ListAllUsersOutput = Outputs['admin']['listAllUsers']

export type CountViewOutput = Outputs['posts']['views']['count']
export type CountLikeOutput = Outputs['posts']['likes']['count']

export type ListSessionsOutput = Outputs['auth']['listSessions']
