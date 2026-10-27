import type { ColumnDef } from '@tanstack/react-table'
import type { AdminUserListOutput } from '../../types'
import type { features } from '../features'

import { UserAvatar } from '@/components/user-avatar'
import { m } from '@/paraglide/messages'

import { FormattedDateCell } from '../formatted-date-cell'

export type User = AdminUserListOutput['users'][number]

export function getColumns(): Array<ColumnDef<typeof features, User>> {
  return [
    {
      accessorKey: 'name',
      header: m.components_tables_users_user(),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <UserAvatar id={row.original.id} name={row.original.name} image={row.original.image} className='size-6' />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: m.components_tables_users_email(),
    },
    {
      accessorKey: 'role',
      header: m.components_tables_users_role(),
    },
    {
      accessorKey: 'createdAt',
      header: m.components_tables_users_created_at(),
      cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
    },
  ]
}
