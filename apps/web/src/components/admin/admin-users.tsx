'use client'

import { useTranslations } from 'next-intl'

import { useListAdminUsers } from '@/hooks/queries/admin.query'

import UsersTable from '../tables/users'

function AdminUsers() {
  const { data, isSuccess, isLoading, isError } = useListAdminUsers()
  const t = useTranslations()

  return (
    <>
      {isSuccess && <UsersTable users={data.users} />}
      {isLoading && 'Loading...'}
      {isError && <div>{t('error.failed-to-fetch-users-data')}</div>}
    </>
  )
}

export default AdminUsers
