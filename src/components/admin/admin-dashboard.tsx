import { RecentActivity } from './admin-recent-activity'
import { AdminStatsCards } from './admin-stats-cards'
import { TrendsChart } from './admin-trend-chart'

export function AdminDashboard() {
  return (
    <div className='space-y-6'>
      <AdminStatsCards />
      <div className='grid gap-4 lg:grid-cols-2'>
        <RecentActivity />
        <TrendsChart />
      </div>
    </div>
  )
}
