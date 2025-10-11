import type { Inputs, Outputs } from '../client'

import { listAllComments, listAllUsers } from './admin.router'
import { listSessions, revokeSession, updateUser } from './auth.router'
import { likesStats, viewsStats } from './blog.router'
import { countComments, createComment, deleteComment, listComments } from './comments.router'
import { githubStats } from './github.router'
import { createMessage, deleteMessage, listMessages } from './guestbook.router'
import { countLike, incrementLike } from './likes.router'
import { getAvatarUploadUrl } from './r2.router'
import { countReplies } from './replies.router'
import { spotifyStats } from './spotify.router'
import { countView, incrementView } from './views.router'
import { createVote } from './votes.router'
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
