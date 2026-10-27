import type { ErrorComponentProps } from '@tanstack/react-router'

import { createFileRoute, Outlet } from '@tanstack/react-router'

import { MainLayout } from '@/components/main-layout'
import { RouteError } from '@/components/route-error'
import { Route as RootRoute } from '@/routes/__root'

export const Route = createFileRoute('/_main')({
  errorComponent: MainError,
  component: RouteComponent,
})

function RouteComponent() {
  const { copyrightYear } = RootRoute.useLoaderData()
  return (
    <MainLayout copyrightYear={copyrightYear}>
      <Outlet />
    </MainLayout>
  )
}

function MainError(props: ErrorComponentProps) {
  const { copyrightYear } = RootRoute.useLoaderData()
  return (
    <MainLayout copyrightYear={copyrightYear}>
      <RouteError {...props} />
    </MainLayout>
  )
}
