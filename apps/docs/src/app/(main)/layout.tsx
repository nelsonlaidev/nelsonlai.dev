import { Logo } from '@repo/ui/components/logo'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'

import { source } from '@/lib/source'

const Layout = (props: LayoutProps<'/'>) => {
  const { children } = props

  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <div className='flex items-center gap-2.5 pl-2.5 font-mono'>
            <Logo width={12} />
            @nelsonlaidev/docs
          </div>
        )
      }}
    >
      {children}
    </DocsLayout>
  )
}

export default Layout
