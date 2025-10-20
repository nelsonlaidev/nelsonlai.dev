import { allPages, allPosts, allProjects } from '@/lib/content'

export const pathnames = [
  '/',
  '/blog',
  '/guestbook',
  '/projects',
  '/dashboard',
  ...new Set(allPages.map((page) => `/${page.slug}`)),
  ...new Set(allProjects.map((project) => `/projects/${project.slug}`)),
  ...new Set(allPosts.map((post) => `/blog/${post.slug}`))
]
