import type { ColumnDef } from '@tanstack/react-table'
import type { AdminCommentListOutput } from '../../types'
import type { features } from '../table-features'

import { Link } from '@tanstack/react-router'

import { UserAvatar } from '@/components/user-avatar'
import { m } from '@/paraglide/messages'

import { FormattedDateCell } from '../formatted-date-cell'

export type Comment = AdminCommentListOutput['comments'][number]

export function getColumns(): Array<ColumnDef<typeof features, Comment>> {
  return [
    {
      accessorKey: 'userId',
      header: m.admin_comments_table_user(),
      cell: ({ row }) => {
        const { user } = row.original
        const userName = user?.name ?? m.common_labels_deleted_user()

        return (
          <div className='flex items-center gap-2'>
            <UserAvatar id={user?.id} name={userName} image={user?.image} className='size-6' />
            {userName}
          </div>
        )
      },
    },
    {
      accessorKey: 'body',
      header: m.admin_comments_table_comment(),
    },
    {
      accessorKey: 'postSlug',
      header: m.admin_comments_table_post(),
      cell: ({ row }) => (
        <Link
          to='/blog/$slug'
          params={{ slug: row.original.postSlug }}
          search={{
            comment: row.original.parentId ?? row.original.id,
            ...(row.original.parentId && { reply: row.original.id }),
          }}
          className='underline underline-offset-4'
        >
          {row.original.postSlug}
        </Link>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: m.admin_comments_table_created_at(),
      cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
    },
  ]
}
