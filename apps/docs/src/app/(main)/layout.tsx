import { DocsLayout } from 'fumadocs-ui/layouts/notebook'

import { source } from '@/lib/source'

const Layout = (props: LayoutProps<'/'>) => {
  const { children } = props

  return (
    <DocsLayout tree={source.pageTree} nav={{ title: '@nelsonlaidev/docs' }}>
      {children}
    </DocsLayout>
  )
}

export default Layout
