import type { ErrorComponentProps } from '@tanstack/react-router'

import { OceanPage } from '@/components/ocean-page'
import { RouteError } from '@/components/route-error'
import { m } from '@/paraglide/messages'

type ProjectsLayoutProps = {
  children: React.ReactNode
}

export function ProjectsLayout(props: ProjectsLayoutProps) {
  const { children } = props

  return (
    <OceanPage>
      <div className='wrap-anywhere'>{children}</div>
    </OceanPage>
  )
}

export function ProjectsError(props: ErrorComponentProps) {
  return (
    <ProjectsLayout>
      <RouteError {...props} />
    </ProjectsLayout>
  )
}

export function ProjectsPending() {
  return (
    <ProjectsLayout>
      <output className='block text-muted-foreground'>{m.common_loading()}</output>
    </ProjectsLayout>
  )
}
