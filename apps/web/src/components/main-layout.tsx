import { useRouterState } from '@tanstack/react-router'

import { SignInDialog } from '@/features/auth/sign-in-dialog'

import { OceanFooter } from './footer'
import { OceanHeader } from './header'
import { OceanCanvas } from './ocean-canvas'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout(props: MainLayoutProps) {
  const { children } = props
  const page = useRouterState({
    select: (state) => {
      if (state.matches.some((match) => match.status === 'notFound')) return 'default'
      if (state.matches.some((match) => match.routeId === '/_main/')) return 'home'
      if (state.matches.some((match) => match.routeId === '/_main/blog/$slug')) return 'article'
      if (state.matches.some((match) => match.routeId === '/_main/guestbook')) return 'guestbook'
      return 'default'
    },
  })
  let pageDepth = 0.42
  if (page === 'guestbook') pageDepth = 0.93
  else if (page === 'article') pageDepth = 0.68

  return (
    <div className='isolate flex min-h-svh flex-col bg-background text-foreground'>
      <OceanCanvas depthBias={page === 'home' ? 0 : pageDepth} />
      <OceanHeader />
      <main id='main-content' tabIndex={-1} className='mx-auto w-full flex-1 outline-none'>
        {children}
      </main>
      <OceanFooter />
      <SignInDialog />
    </div>
  )
}
