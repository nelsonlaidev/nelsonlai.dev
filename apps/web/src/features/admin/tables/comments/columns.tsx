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
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <UserAvatar
            id={row.original.userId ?? 'deleted'}
            name={row.original.user.name}
            image={row.original.user.image}
            className='size-6'
          />
          {row.original.user.name}
        </div>
      ),
    },
    {
      accessorKey: 'body',
      header: m.admin_comments_table_comment(),
    },
    {
      accessorKey: 'postId',
      header: m.admin_comments_table_post(),
      cell: ({ row }) => (
        <Link
          to='/blog/$slug'
          params={{ slug: row.original.postId }}
          search={{
            comment: row.original.parentId ?? row.original.id,
            ...(row.original.parentId && { reply: row.original.id }),
          }}
          className='underline underline-offset-4'
        >
          {row.original.postId}
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
