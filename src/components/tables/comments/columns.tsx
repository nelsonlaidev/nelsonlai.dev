import type { AdminCommentListOutput } from '@/orpc/client'
import type { ColumnDef } from '@tanstack/react-table'

import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/components/ui/link'
import { getAbbreviation } from '@/utils/get-abbreviation'
import { getDefaultImage } from '@/utils/get-default-image'

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
          <Avatar size='sm'>
            <AvatarImage
              src={row.original.user.image ?? getDefaultImage(row.original.userId)}
              alt={row.original.user.name}
            />
            <AvatarFallback>{getAbbreviation(row.original.user.name)}</AvatarFallback>
          </Avatar>
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
