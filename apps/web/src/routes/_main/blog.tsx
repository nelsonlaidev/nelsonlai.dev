import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/blog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/blog"!</div>
}
