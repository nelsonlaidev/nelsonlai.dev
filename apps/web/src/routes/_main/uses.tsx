import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/uses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/uses"!</div>
}
