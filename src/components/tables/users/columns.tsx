import type { ColumnDef } from '@tanstack/react-table'
import type { AdminUserListOutput } from '@/orpc/client'

import { useTranslations } from 'next-intl'

import { UserAvatar } from '@/components/ui/user-avatar'

import { FormattedDateCell } from '../formatted-date-cell'

export type User = AdminUserListOutput['users'][number]

export function useColumns(): Array<ColumnDef<User>> {
  const t = useTranslations()

  return [
    {
      accessorKey: 'name',
      header: t('components.tables.users.user'),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <UserAvatar id={row.original.id} name={row.original.name} image={row.original.image} size='sm' />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: t('components.tables.users.email'),
    },
    {
      accessorKey: 'role',
      header: t('components.tables.users.role'),
    },
    {
      accessorKey: 'createdAt',
      header: t('components.tables.users.created-at'),
      cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
    },
  ]
}
