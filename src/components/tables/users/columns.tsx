import type { AdminUserListOutput } from '@/orpc/client'
import type { ColumnDef } from '@tanstack/react-table'

import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getDefaultImage } from '@/utils/get-default-image'
import { getInitials } from '@/utils/get-initials'

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
          <Avatar size='sm'>
            <AvatarImage src={row.original.image ?? getDefaultImage(row.original.id)} alt={row.original.name} />
            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
          </Avatar>
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
