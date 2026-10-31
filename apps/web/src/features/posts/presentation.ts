import { m } from '@/paraglide/messages'

export type ArticleTopic = 'testing' | 'design' | 'engineering'

const ARTICLE_TOPICS: Record<string, ArticleTopic> = {
  'e2e-testing-with-better-auth': 'testing',
  'top-8-attractive-web-design-websites': 'design',
}

export function articleTopic(slug: string): ArticleTopic {
  return ARTICLE_TOPICS[slug] ?? 'engineering'
}

export function articleTopicLabel(topic: ArticleTopic) {
  return { testing: m.blog_testing, design: m.blog_design, engineering: m.blog_engineering }[topic]()
}

const ARTICLE_NUMBERS: Record<string, string> = {
  'e2e-testing-with-better-auth': '01',
  'top-8-attractive-web-design-websites': '02',
  'how-to-build-a-blog-with-nextjs-and-mdx': '03',
  php: '04',
}

export function articleNumber(slug: string) {
  return ARTICLE_NUMBERS[slug]
}
