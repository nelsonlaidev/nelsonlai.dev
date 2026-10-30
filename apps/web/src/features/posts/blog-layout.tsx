import type { ErrorComponentProps } from '@tanstack/react-router'

import { OceanPage } from '@/components/ocean-page'
import { RouteError } from '@/components/route-error'
import { m } from '@/paraglide/messages'

type BlogLayoutProps = {
  children: React.ReactNode
}

export function BlogLayout(props: BlogLayoutProps) {
  const { children } = props

  return (
    <OceanPage>
      <div className='wrap-anywhere [--muted:#8cafaa]'>{children}</div>
    </OceanPage>
  )
}

export function BlogPending() {
  return (
    <BlogLayout>
      <output aria-busy='true'>{m.common_loading()}</output>
    </BlogLayout>
  )
}

export function BlogError(props: ErrorComponentProps) {
  return (
    <BlogLayout>
      <RouteError {...props} />
    </BlogLayout>
  )
}
