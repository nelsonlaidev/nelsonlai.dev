import type { ColumnDef } from '@tanstack/react-table'
import type { AdminCommentListOutput } from '@/orpc/client'

import { useTranslations } from 'next-intl'

import { Link } from '@/components/ui/link'
import { UserAvatar } from '@/components/ui/user-avatar'

import { FormattedDateCell } from '../formatted-date-cell'

export type Comment = AdminCommentListOutput['comments'][number]

export function useColumns(): Array<ColumnDef<Comment>> {
  const t = useTranslations()

  return [
    {
      accessorKey: 'userId',
      header: t('components.tables.comments.user'),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <UserAvatar
            id={row.original.userId}
            name={row.original.user.name}
            image={row.original.user.image}
            size='sm'
          />
          {row.original.user.name}
        </div>
      ),
    },
    {
      accessorKey: 'body',
      header: t('components.tables.comments.comment'),
    },
    {
      accessorKey: 'postId',
      header: t('components.tables.comments.post'),
      cell: ({ row }) => (
        <Link
          href={{
            pathname: `/blog/${row.original.postId}`,
            query: {
              comment: row.original.parentId ?? row.original.id,
              ...(row.original.parentId && { reply: row.original.id }),
            },
          }}
          className='underline underline-offset-4'
        >
          {row.original.postId}
        </Link>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('components.tables.comments.created-at'),
      cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
    },
  ]
}
