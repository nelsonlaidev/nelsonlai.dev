'use client'

import NumberFlow from '@number-flow/react'
import { EyeIcon, HeartIcon, MessageSquareIcon, MessagesSquareIcon, UsersIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useAdminStats } from '@/hooks/queries/admin.query'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const STAT_ITEMS = [
  // @i18n-check t('admin.dashboard.stats.users')
  { key: 'admin.dashboard.stats.users', icon: UsersIcon, field: 'totalUsers' },
  // @i18n-check t('admin.dashboard.stats.comments')
  { key: 'admin.dashboard.stats.comments', icon: MessagesSquareIcon, field: 'totalComments' },
  // @i18n-check t('admin.dashboard.stats.views')
  { key: 'admin.dashboard.stats.views', icon: EyeIcon, field: 'totalViews' },
  // @i18n-check t('admin.dashboard.stats.likes')
  { key: 'admin.dashboard.stats.likes', icon: HeartIcon, field: 'totalLikes' },
  // @i18n-check t('admin.dashboard.stats.messages')
  { key: 'admin.dashboard.stats.messages', icon: MessageSquareIcon, field: 'totalMessages' },
] as const

export function AdminStatsCards() {
  const { data, isSuccess, isLoading, isError } = useAdminStats()
  const t = useTranslations()

  if (isError) {
    return <p className='text-sm text-destructive'>{t('error.failed-to-fetch-dashboard-data')}</p>
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      {STAT_ITEMS.map((item) => (
        <Card key={item.key} size='sm'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              {t(item.key)} <item.icon className='size-4 text-muted-foreground' />
            </CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>
            {isLoading && <Skeleton className='h-8 w-20' />}
            {isSuccess && <NumberFlow value={data[item.field]} />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
