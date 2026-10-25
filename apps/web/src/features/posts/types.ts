import type { InferRouterOutputs } from '@orpc/server'
import type { router } from '@repo/api/routers'
import type { Post } from 'content-collections'

export type PostSummary = Pick<Post, 'slug' | 'title' | 'description' | 'publishedAt'>

export type PostStats = InferRouterOutputs<typeof router>['posts']['stats'][number]
