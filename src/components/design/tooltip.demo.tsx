'use client'

import { InfoIcon, SaveIcon } from 'lucide-react'

import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import { Kbd } from '../ui/kbd'
import { Link } from '../ui/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

function TooltipDemo() {
  return (
    <Demo title='Tooltip'>
      <TooltipBasic />
      <TooltipSides />
      <TooltipWithIcon />
      <TooltipLongContent />
      <TooltipDisabled />
      <TooltipWithKeyboard />
      <TooltipOnLink />
      <TooltipFormatted />
    </Demo>
  )
}

function TooltipBasic() {
  return (
    <DemoItem title='Basic'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant='outline' className='w-fit'>
              Show Tooltip
            </Button>
          }
        />
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

function TooltipSides() {
  return (
    <DemoItem title='Sides'>
      {(['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger
            render={
              <Button variant='outline' className='capitalize'>
                {side.replace('-', ' ')}
              </Button>
            }
          />
          <TooltipContent side={side}>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </DemoItem>
  )
}

function TooltipWithIcon() {
  return (
    <DemoItem title='With Icon'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant='ghost' size='icon'>
              <InfoIcon />
              <span className='sr-only'>Info</span>
            </Button>
          }
        />
        <TooltipContent>
          <p>Additional information</p>
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

function TooltipLongContent() {
  return (
    <DemoItem title='Long Content'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant='outline' className='w-fit'>
              Show Tooltip
            </Button>
          }
        />
        <TooltipContent>
          To learn more about how this works, check out the docs. If you have any questions, please reach out to us.
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

function TooltipDisabled() {
  return (
    <DemoItem title='Disabled'>
      <Tooltip>
        <TooltipTrigger
          render={
            <span className='inline-block w-fit'>
              <Button variant='outline' disabled>
                Disabled
              </Button>
            </span>
          }
        />
        <TooltipContent>
          <p>This feature is currently unavailable</p>
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

function TooltipWithKeyboard() {
  return (
    <DemoItem title='With Keyboard Shortcut'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant='outline' size='icon-sm'>
              <SaveIcon />
            </Button>
          }
        />
        <TooltipContent className='pr-1.5'>
          <div className='flex items-center gap-2'>
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

function TooltipOnLink() {
  return (
    <DemoItem title='On Link'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href='/design#'
              className='w-fit text-sm text-primary underline-offset-4 hover:underline'
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              Learn more
            </Link>
          }
        />
        <TooltipContent>
          <p>Click to read the documentation</p>
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

function TooltipFormatted() {
  return (
    <DemoItem title='Formatted Content'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant='outline' className='w-fit'>
              Status
            </Button>
          }
        />
        <TooltipContent>
          <div className='flex flex-col gap-1'>
            <p className='font-semibold'>Active</p>
            <p className='text-xs opacity-80'>Last updated 2 hours ago</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

export default TooltipDemo
