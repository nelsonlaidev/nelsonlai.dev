import type { Locale } from '@/paraglide/runtime'
import type { PostSummary } from './types'

import { allPosts } from 'content-collections'

export function findPost(slug: string, locale: Locale) {
  const post = allPosts.find((post) => post.slug === slug && post.locale === locale)

  if (!post) return null

  return {
    code: post.code,
    toc: post.toc,
    slug: post.slug,
    locale,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  }
}

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
      updatedAt: post.updatedAt,
    }))
}
