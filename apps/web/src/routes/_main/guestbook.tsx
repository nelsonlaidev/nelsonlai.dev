import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/guestbook')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/guestbook"!</div>
}
