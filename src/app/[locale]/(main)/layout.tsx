import { MainLayout } from '@/components/main-layout'

function Layout(props: LayoutProps<'/[locale]'>) {
  const { children } = props

  return <MainLayout>{children}</MainLayout>
}

export default Layout
