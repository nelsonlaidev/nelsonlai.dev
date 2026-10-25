import { createFileRoute } from '@tanstack/react-router'

import { getProjects } from '@/lib/projects.functions'
import { getLocale } from '@/paraglide/runtime'

import { AboutMe } from './-components/home/about-me'
import { Hero } from './-components/home/hero'
import { SelectedProjects } from './-components/home/selected-projects'

export const Route = createFileRoute('/_main/')({
  loader: async () => getProjects({ data: { locale: getLocale(), limit: 2, selectedOnly: true } }),
  component: RouteComponent,
})

function RouteComponent() {
  const projects = Route.useLoaderData()

  return (
    <>
      <Hero />
      <SelectedProjects projects={projects} />
      <AboutMe />
    </>
  )
}
