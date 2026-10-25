import type { Locale } from '@/paraglide/runtime'
import type { PostSummary } from './posts'

import { allPosts } from 'content-collections'

export function listPosts(locale: Locale, limit: number | null = null): PostSummary[] {
  return allPosts
    .filter((post) => post.locale === locale)
    .toSorted(
      (left, right) =>
        Date.parse(right.publishedAt) - Date.parse(left.publishedAt) || left.slug.localeCompare(right.slug, 'en'),
    )
    .slice(0, limit ?? undefined)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
    }))
}
