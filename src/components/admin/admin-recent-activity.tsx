'use client'

import type { AdminRecentActivityOutput } from '@/orpc/client'

import { useTranslations } from 'next-intl'

import { useAdminRecentActivity } from '@/hooks/queries/admin.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { range } from '@/utils/range'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Link } from '../ui/link'
import { Skeleton } from '../ui/skeleton'
import { UserAvatar } from '../ui/user-avatar'

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
            data.activities.map((activity) => (
              <ActivityItem key={`${activity.type}-${activity.id}`} activity={activity} />
            ))
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
  const timeAgo = useFormattedDate(activity.createdAt, { relative: true, threshold: 30 })

  return (
    <div className='flex items-start gap-3 py-3'>
      <UserAvatar id={activity.user.id} name={userName} image={activity.user.image} size='sm' />
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
