import GradientBackground from './gradient-background'
import LayoutFooter from './layout/layout-footer'
import LayoutHeader from './layout/layout-header'

type MainLayoutProps = {
  children: React.ReactNode
}

function MainLayout(props: MainLayoutProps) {
  const { children } = props

  return (
    <>
      <LayoutHeader />
      <main id='skip-nav' className='mx-auto mb-16 w-full max-w-5xl flex-1 px-6 py-24 sm:px-8'>
        {children}
      </main>
      <LayoutFooter />
      <GradientBackground className='absolute top-0 left-1/2 -z-10 -translate-x-1/2' />
      <GradientBackground className='absolute -bottom-6 left-1/2 -z-10 -translate-x-1/2 rotate-180' />
    </>
  )
}

export default MainLayout
