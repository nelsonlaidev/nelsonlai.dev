import { adminRouter } from './admin.router'
import { authRouter } from './auth.router'
import { commentRouter } from './comment.router'
import { githubRouter } from './github.router'
import { likeRouter } from './like.router'
import { messageRouter } from './message.router'
import { r2Router } from './r2.router'
import { replyRouter } from './reply.router'
import { settingsRouter } from './settings.router'
import { spotifyRouter } from './spotify.router'
import { unsubscribeRouter } from './unsubscribe.router'
import { viewRouter } from './view.router'
import { voteRouter } from './vote.router'
import { wakatimeRouter } from './wakatime.router'
import { youtubeRouter } from './youtube.router'

export const router = {
  github: githubRouter,
  youtube: youtubeRouter,
  wakatime: wakatimeRouter,
  spotify: spotifyRouter,
  view: viewRouter,
  like: likeRouter,
  comment: commentRouter,
  reply: replyRouter,
  vote: voteRouter,
  message: messageRouter,
  admin: adminRouter,
  auth: authRouter,
  settings: settingsRouter,
  r2: r2Router,
  unsubscribe: unsubscribeRouter,
}
