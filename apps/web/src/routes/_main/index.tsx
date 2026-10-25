import { createFileRoute } from '@tanstack/react-router'

import { getPosts } from '@/features/posts/posts.functions'
import { getProjects } from '@/features/projects/projects.functions'
import { getLocale } from '@/paraglide/runtime'

import { AboutMe } from './-components/home/about-me'
import { GetInTouch } from './-components/home/get-in-touch'
import { Hero } from './-components/home/hero'
import { LatestArticles } from './-components/home/latest-articles'
import { SelectedProjects } from './-components/home/selected-projects'

export const Route = createFileRoute('/_main/')({
  loader: async () => {
    const locale = getLocale()
    const [projects, posts] = await Promise.all([
      getProjects({ data: { locale, limit: 2, selectedOnly: true } }),
      getPosts({ data: { locale, limit: 2 } }),
    ])

    return { projects, posts }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { projects, posts } = Route.useLoaderData()

  return (
    <>
      <Hero />
      <SelectedProjects projects={projects} />
      <AboutMe />
      <LatestArticles posts={posts} />
      <GetInTouch />
    </>
  )
}
