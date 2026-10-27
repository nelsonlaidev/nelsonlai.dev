import type { ErrorComponentProps } from '@tanstack/react-router'

import { createFileRoute, Outlet } from '@tanstack/react-router'

import { MainLayout } from '@/components/main-layout'
import { RouteError } from '@/components/route-error'

export const Route = createFileRoute('/_main')({
  component: RouteComponent,
  errorComponent: MainError,
})

function RouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

function MainError(props: ErrorComponentProps) {
  return (
    <MainLayout>
      <RouteError {...props} />
    </MainLayout>
  )
}
