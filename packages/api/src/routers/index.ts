import { githubRouter } from './github'
import { postsRouter } from './posts'
import { spotifyRouter } from './spotify'
import { wakatimeRouter } from './wakatime'

export const router = {
  github: githubRouter,
  posts: postsRouter,
  spotify: spotifyRouter,
  wakatime: wakatimeRouter,
}
