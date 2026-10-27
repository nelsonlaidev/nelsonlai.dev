import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { SignInDialog } from '@/features/auth/sign-in-dialog'
import { authClient } from '@/lib/auth-client'

import { Footer } from './-components/footer'
import { GradientBackground } from './-components/gradient-background'
import { Header } from './-components/header'

export const Route = createFileRoute('/_main')({
  loader: () => ({ copyrightYear: new Date().getFullYear() }),
  component: RouteComponent,
})

function RouteComponent() {
  const { copyrightYear } = Route.useLoaderData()
  const router = useRouter()
  const { data: session, isPending, error } = authClient.useSession()
  const user = session?.user ?? null
  const previousUserRef = useRef<typeof user | undefined>(undefined)

  useEffect(() => {
    if (isPending || (error && error.status !== 401) || previousUserRef.current === user) return

    previousUserRef.current = user
    void router.invalidate()
  }, [error, isPending, router, user])

  return (
    <>
      <Header />
      <main
        id='main-content'
        tabIndex={-1}
        className='mx-auto mb-16 w-full max-w-5xl flex-1 px-6 py-24 outline-none sm:px-8'
      >
        <Outlet />
      </main>
      <Footer copyrightYear={copyrightYear} />
      <GradientBackground position='top' />
      <GradientBackground position='bottom' />
      <SignInDialog />
    </>
  )
}
