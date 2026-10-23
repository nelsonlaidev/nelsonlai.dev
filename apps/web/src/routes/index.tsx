import { Button } from '@repo/ui/components/button'
import { createFileRoute } from '@tanstack/react-router'

import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <Button>{m.example_message({ username: 'Nelson' })}</Button>
}
