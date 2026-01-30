'use client'

import { useTranslations } from 'next-intl'

import { useListUsersAdmin } from '@/hooks/queries/admin.query'

import UsersTable from '../tables/users'

function AdminUsers() {
  const { data, isSuccess, isLoading, isError } = useListUsersAdmin()
  const t = useTranslations()

  return (
    <>
      {isSuccess && <UsersTable users={data.users} />}
      {isLoading && <div>{t('common.loading')}</div>}
      {isError && <div>{t('error.failed-to-fetch-users-data')}</div>}
    </>
  )
}

export default AdminUsers
