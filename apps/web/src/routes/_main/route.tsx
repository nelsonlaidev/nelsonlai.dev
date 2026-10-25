import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Footer } from './-components/footer'
import { GradientBackground } from './-components/gradient-background'
import { Header } from './-components/header'

export const Route = createFileRoute('/_main')({
  loader: () => ({ copyrightYear: new Date().getFullYear() }),
  component: RouteComponent,
})

function RouteComponent() {
  const { copyrightYear } = Route.useLoaderData()

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
    </>
  )
}
