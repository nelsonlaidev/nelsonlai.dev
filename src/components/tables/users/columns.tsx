import type { AdminUserListOutput } from '@/orpc/client'
import type { ColumnDef } from '@tanstack/react-table'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAbbreviation } from '@/utils/get-abbreviation'
import { getDefaultImage } from '@/utils/get-default-image'

import { FormattedDateCell } from '../formatted-date-cell'

export type User = AdminUserListOutput['users'][number]

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar size='sm'>
          <AvatarImage src={row.original.image ?? getDefaultImage(row.original.id)} alt={row.original.name} />
          <AvatarFallback>{getAbbreviation(row.original.name)}</AvatarFallback>
        </Avatar>
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
  },
]
