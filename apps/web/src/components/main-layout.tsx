import { SignInDialog } from '@/features/auth/sign-in-dialog'
import { Footer } from '@/routes/_main/-components/footer'
import { GradientBackground } from '@/routes/_main/-components/gradient-background'
import { Header } from '@/routes/_main/-components/header'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout(props: MainLayoutProps) {
  const { children } = props

  return (
    <>
      <Header />
      <main
        id='main-content'
        tabIndex={-1}
        className='mx-auto mb-16 w-full max-w-5xl flex-1 px-6 py-24 outline-none sm:px-8'
      >
        {children}
      </main>
      <Footer />
      <GradientBackground position='top' />
      <GradientBackground position='bottom' />
      <SignInDialog />
    </>
  )
}
