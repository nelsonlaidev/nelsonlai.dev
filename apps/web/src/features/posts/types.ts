import type { InferRouterOutputs } from '@orpc/server'
import type { router } from '@repo/api/routers'
import type { Post } from 'content-collections'

export type PostSummary = Pick<Post, 'slug' | 'title' | 'description' | 'publishedAt' | 'updatedAt'>
export type PostDetail = Pick<
  Post,
  'code' | 'toc' | 'slug' | 'locale' | 'title' | 'description' | 'publishedAt' | 'updatedAt'
>

export type PostStats = InferRouterOutputs<typeof router>['posts']['stats'][number]
