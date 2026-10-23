import { Button } from '@repo/ui/components/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <Button>Click Me</Button>
}
