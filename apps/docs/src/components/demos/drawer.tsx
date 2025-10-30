'use client'

import { Button } from '@repo/ui/components/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@repo/ui/components/drawer'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'

const data = [
  { goal: 400 },
  { goal: 300 },
  { goal: 200 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 239 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 349 }
]

const DrawerDemo = () => {
  const [goal, setGoal] = useState(350)

  const handleClick = (adjustment: number) => {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline'>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className='p-4 pb-0'>
            <div className='flex items-center justify-center space-x-2'>
              <Button
                variant='outline'
                size='icon'
                className='size-8 shrink-0 rounded-full'
                onClick={() => {
                  handleClick(-10)
                }}
                disabled={goal <= 200}
              >
                <MinusIcon />
                <span className='sr-only'>Decrease</span>
              </Button>
              <div className='flex-1 text-center'>
                <div className='text-7xl font-bold tracking-tighter'>{goal}</div>
                <div className='text-[0.70rem] text-muted-foreground uppercase'>Calories/day</div>
              </div>
              <Button
                variant='outline'
                size='icon'
                className='size-8 shrink-0 rounded-full'
                onClick={() => {
                  handleClick(10)
                }}
                disabled={goal >= 400}
              >
                <PlusIcon />
                <span className='sr-only'>Increase</span>
              </Button>
            </div>
            <div className='mt-3 h-30'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={data}>
                  <Bar
                    dataKey='goal'
                    style={{
                      fill: 'var(--foreground)',
                      opacity: 0.9
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerDemo
