import { useRouterState } from '@tanstack/react-router'

import { SignInDialog } from '@/features/auth/sign-in-dialog'

import { Footer } from './footer'
import { Header } from './header'
import { OceanCanvas } from './ocean/ocean-canvas'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout(props: MainLayoutProps) {
  const { children } = props
  const isHome = useRouterState({
    select: (state) =>
      state.matches.some((match) => match.routeId === '/_main/') &&
      !state.matches.some((match) => match.status === 'notFound'),
  })

  return (
    <div className='isolate flex min-h-svh flex-col bg-background text-foreground'>
      <OceanCanvas depthBias={isHome ? 0 : 0.42} />
      <Header />
      <main id='main-content' tabIndex={-1} className='mx-auto w-full flex-1 outline-none'>
        {children}
      </main>
      <Footer />
      <SignInDialog />
    </div>
  )
}
