'use client'

import { useTranslations } from 'next-intl'

import { useAdminUsers } from '@/hooks/queries/admin.query'

import UsersTable from '../tables/users'

const AdminUsers = () => {
  const { isSuccess, isLoading, isError, data } = useAdminUsers()
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
