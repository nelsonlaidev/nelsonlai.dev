import type { ErrorComponentProps } from '@tanstack/react-router'

import { OceanPage } from '@/components/ocean-page'
import { RouteError } from '@/components/route-error'
import { m } from '@/paraglide/messages'

export type ProfilePageData = {
  path: string
  title: string
  description: string
  slug: string
  locale: string
}

type ProfileLayoutProps = {
  children: React.ReactNode
}

export function ProfileLayout(props: ProfileLayoutProps) {
  const { children } = props

  return (
    <OceanPage>
      <div className='wrap-anywhere'>{children}</div>
    </OceanPage>
  )
}

export function ProfilePending() {
  return (
    <ProfileLayout>
      <output className='block text-muted-foreground'>{m.common_loading()}</output>
    </ProfileLayout>
  )
}

export function ProfileError(props: ErrorComponentProps) {
  return (
    <ProfileLayout>
      <RouteError {...props} />
    </ProfileLayout>
  )
}
