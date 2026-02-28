import { GradientBackground } from './gradient-background'
import { LayoutFooter } from './layout/layout-footer'
import { LayoutHeader } from './layout/layout-header'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout(props: MainLayoutProps) {
  const { children } = props

  return (
    <>
      <LayoutHeader />
      <main
        id='main-content'
        tabIndex={-1}
        className='mx-auto mb-16 w-full max-w-5xl flex-1 px-6 py-24 outline-none sm:px-8'
      >
        {children}
      </main>
      <LayoutFooter />
      <GradientBackground />
      <GradientBackground position='bottom' />
    </>
  )
}
