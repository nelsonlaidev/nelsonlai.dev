import type { ColumnDef } from '@tanstack/react-table'
import type { AdminUserListOutput } from '../../types'
import type { features } from '../table-features'

import { UserAvatar } from '@/components/user-avatar'
import { m } from '@/paraglide/messages'

import { FormattedDateCell } from '../formatted-date-cell'

export type User = AdminUserListOutput['users'][number]

export function getColumns(): Array<ColumnDef<typeof features, User>> {
  return [
    {
      accessorKey: 'name',
      header: m.admin_users_table_user(),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <UserAvatar id={row.original.id} name={row.original.name} image={row.original.image} className='size-6' />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: m.admin_users_table_email(),
    },
    {
      accessorKey: 'role',
      header: m.admin_users_table_role(),
    },
    {
      accessorKey: 'createdAt',
      header: m.admin_users_table_created_at(),
      cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
    },
  ]
}
