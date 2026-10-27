import { accountRouter } from './account'
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
  comments: commentsRouter,
  notifications: notificationsRouter,
  github: githubRouter,
  guestbook: guestbookRouter,
  posts: postsRouter,
  spotify: spotifyRouter,
  wakatime: wakatimeRouter,
  youtube: youtubeRouter,
}
