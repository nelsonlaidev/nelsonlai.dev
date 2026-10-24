import { createFileRoute } from '@tanstack/react-router'

import { Hero } from './-components/home/hero'

export const Route = createFileRoute('/_main/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Hero />
}
