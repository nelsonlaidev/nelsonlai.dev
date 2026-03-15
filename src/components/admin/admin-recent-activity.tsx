'use client'

import type { AdminRecentActivityOutput } from '@/orpc/client'

import { useTranslations } from 'next-intl'

import { useAdminRecentActivity } from '@/hooks/queries/admin.query'
import { getAbbreviation } from '@/utils/get-abbreviation'
import { getDefaultImage } from '@/utils/get-default-image'
import { range } from '@/utils/range'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Link } from '../ui/link'
import { Skeleton } from '../ui/skeleton'

export function RecentActivity() {
  const { data, isLoading, isError } = useAdminRecentActivity()
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.dashboard.recent-activity.title')}</CardTitle>
      </CardHeader>
      <CardContent className='divide-y'>
        {isLoading && <RecentActivitySkeleton />}
        {isError && <p className='text-sm text-destructive'>{t('error.failed-to-fetch-dashboard-data')}</p>}
        {data &&
          (data.activities.length > 0 ? (
            data.activities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
          ) : (
            <p className='text-sm text-muted-foreground'>{t('admin.dashboard.recent-activity.empty')}</p>
          ))}
      </CardContent>
    </Card>
  )
}

function RecentActivitySkeleton() {
  return range(10).map((number) => (
    <div key={number} className='flex items-start gap-3 py-3'>
      <Skeleton className='size-6 rounded-full' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
      </div>
    </div>
  ))
}

type ActivityProps = {
  activity: AdminRecentActivityOutput['activities'][number]
}

function ActivityItem(props: ActivityProps) {
  const { activity } = props
  const t = useTranslations()

  const userName = activity.user.name
  const timeAgo = getRelativeTime(activity.createdAt)

  return (
    <div className='flex items-start gap-3 py-3'>
      <Avatar size='sm'>
        <AvatarImage src={activity.user.image ?? getDefaultImage(activity.user.id)} alt={userName} />
        <AvatarFallback>{getAbbreviation(userName)}</AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-1'>
        <p className='text-sm'>
          {activity.type === 'comment'
            ? t.rich('admin.dashboard.recent-activity.commented-on', {
                name: userName,
                post: activity.postId,
                link: (chunks) => (
                  <Link href={`/blog/${activity.postId}`} className='underline underline-offset-4'>
                    {chunks}
                  </Link>
                ),
              })
            : t('admin.dashboard.recent-activity.guestbook-message', {
                name: userName,
              })}
        </p>
        <p className='line-clamp-1 text-xs text-muted-foreground'>{activity.body}</p>
        <p className='text-xs text-muted-foreground'>{timeAgo}</p>
      </div>
    </div>
  )
}

function getRelativeTime(date: Date | string): string {
  const now = new Date()
  const target = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - target.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`

  return target.toLocaleDateString()
}
