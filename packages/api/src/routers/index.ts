import type { InferRouterOutputs } from '@orpc/server'

import { accountRouter } from './account'
import { adminRouter } from './admin'
import { commentsRouter } from './comments'
import { githubRouter } from './github'
import { guestbookRouter } from './guestbook'
import { notificationsRouter } from './notifications'
import { postsRouter } from './posts'
import { spotifyRouter } from './spotify'
import { wakatimeRouter } from './wakatime'
import { youtubeRouter } from './youtube'

export const router = {
  account: accountRouter,
  admin: adminRouter,
  comments: commentsRouter,
  github: githubRouter,
  guestbook: guestbookRouter,
  notifications: notificationsRouter,
  posts: postsRouter,
  spotify: spotifyRouter,
  wakatime: wakatimeRouter,
  youtube: youtubeRouter,
}

export type Outputs = InferRouterOutputs<typeof router>
