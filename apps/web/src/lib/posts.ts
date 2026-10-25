import type { Post } from 'content-collections'

export type PostSummary = Pick<Post, 'slug' | 'title' | 'description' | 'publishedAt'>
