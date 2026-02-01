import { BellIcon, LockIcon, UserIcon } from 'lucide-react'

import { Demo, DemoItem } from '../ui/demo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

function TabsDemo() {
  return (
    <Demo title='Tabs'>
      <TabsBasic />
      <TabsLine />
    </Demo>
  )
}

function TabsBasic() {
  return (
    <DemoItem title='Basic' orientation='vertical'>
      {(['horizontal', 'vertical'] as const).map((orientation) => (
        <Tabs defaultValue='account' key={orientation} orientation={orientation}>
          <TabsList>
            <TabsTrigger value='account'>
              <UserIcon />
              Account
            </TabsTrigger>
            <TabsTrigger value='password'>
              <LockIcon />
              Password
            </TabsTrigger>
            <TabsTrigger value='notifications' disabled>
              <BellIcon />
              Notifications
            </TabsTrigger>
          </TabsList>
          <div className='rounded-xl border p-6'>
            <TabsContent value='account'>Manage your account preferences and profile information.</TabsContent>
            <TabsContent value='password'>Update your password to keep your account secure.</TabsContent>
            <TabsContent value='notifications'>Configure how you receive notifications and alerts.</TabsContent>
          </div>
        </Tabs>
      ))}
    </DemoItem>
  )
}

function TabsLine() {
  return (
    <DemoItem title='Line' orientation='vertical'>
      {(['horizontal', 'vertical'] as const).map((orientation) => (
        <Tabs defaultValue='account' key={orientation} orientation={orientation}>
          <TabsList variant='line'>
            <TabsTrigger value='account'>
              <UserIcon />
              Account
            </TabsTrigger>
            <TabsTrigger value='password'>
              <LockIcon />
              Password
            </TabsTrigger>
            <TabsTrigger value='notifications' disabled>
              <BellIcon />
              Notifications
            </TabsTrigger>
          </TabsList>
          <div className='rounded-xl border p-6'>
            <TabsContent value='account'>Manage your account preferences and profile information.</TabsContent>
            <TabsContent value='password'>Update your password to keep your account secure.</TabsContent>
            <TabsContent value='notifications'>Configure how you receive notifications and alerts.</TabsContent>
          </div>
        </Tabs>
      ))}
    </DemoItem>
  )
}
export default TabsDemo
