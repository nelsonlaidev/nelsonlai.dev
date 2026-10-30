import { createFileRoute } from '@tanstack/react-router'

import { getPosts } from '@/features/posts/posts.functions'
import { getProjects } from '@/features/projects/projects.functions'
import { createJsonLdWebSite } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

import { AboutMe } from './-components/home/about-me'
import { ChapterNavigation } from './-components/home/chapter-navigation'
import { HomeGuestbook } from './-components/home/guestbook'
import { Hero } from './-components/home/hero'
import { LatestArticles } from './-components/home/latest-articles'
import { SelectedProjects } from './-components/home/selected-projects'

export const Route = createFileRoute('/_main/')({
  loader: async () => {
    const locale = getLocale()
    const [projects, posts] = await Promise.all([
      getProjects({ data: { locale, limit: 3, selectedOnly: true } }),
      getPosts({ data: { locale, limit: 3 } }),
    ])

    return { projects, posts, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return createSeoHead({
      title: null,
      description: m.metadata_site_description({}, { locale: loaderData.locale }),
      pathname: '/',
      locale: loaderData.locale,
      jsonLd: createJsonLdWebSite({
        description: m.metadata_site_description({}, { locale: loaderData.locale }),
        pathname: '/',
        locale: loaderData.locale,
      }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { projects, posts } = Route.useLoaderData()

  return (
    <>
      <ChapterNavigation />
      <Hero />
      <SelectedProjects projects={projects} />
      <LatestArticles posts={posts} />
      <AboutMe />
      <HomeGuestbook />
    </>
  )
}
