'use client'

import { CheckIcon, PlusIcon } from 'lucide-react'

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '../ui/avatar'
import { Demo, DemoItem } from '../ui/demo'

function AvatarDemo() {
  return (
    <Demo title='Avatar'>
      <AvatarSizes />
      <AvatarWithBadge />
      <AvatarGroups />
    </Demo>
  )
}

function AvatarSizes() {
  return (
    <DemoItem title='Sizes' orientation='vertical'>
      <div className='flex flex-wrap items-center gap-2'>
        <Avatar size='sm'>
          <AvatarImage src='https://github.com/nelsonlaidev.png' alt='@nelsonlaidev' />
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src='https://github.com/nelsonlaidev.png' alt='@nelsonlaidev' />
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
        <Avatar size='lg'>
          <AvatarImage src='https://github.com/nelsonlaidev.png' alt='@nelsonlaidev' />
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Avatar size='sm'>
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
        <Avatar size='lg'>
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
      </div>
    </DemoItem>
  )
}

function AvatarWithBadge() {
  return (
    <DemoItem title='With Badge' orientation='vertical'>
      <div className='flex flex-wrap items-center gap-2'>
        <Avatar size='sm'>
          <AvatarImage src='https://github.com/jorgezreik.png' alt='@jorgezreik' />
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar>
          <AvatarImage src='https://github.com/jorgezreik.png' alt='@jorgezreik' />
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size='lg'>
          <AvatarImage src='https://github.com/jorgezreik.png' alt='@jorgezreik' />
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Avatar size='sm'>
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar>
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size='lg'>
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Avatar size='sm'>
          <AvatarImage src='https://github.com/pranathip.png' alt='@pranathip' />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <PlusIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarImage src='https://github.com/pranathip.png' alt='@pranathip' />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <PlusIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar size='lg'>
          <AvatarImage src='https://github.com/pranathip.png' alt='@pranathip' />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <PlusIcon />
          </AvatarBadge>
        </Avatar>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Avatar size='sm'>
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar size='lg'>
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
      </div>
    </DemoItem>
  )
}

function AvatarGroups() {
  return (
    <DemoItem title='Groups' orientation='vertical'>
      <div className='flex flex-wrap gap-6'>
        <AvatarGroup>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div className='flex flex-wrap gap-6'>
        <AvatarGroup>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </div>
      <div className='flex flex-wrap gap-6'>
        <AvatarGroup>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar size='sm'>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>
            <PlusIcon />
          </AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>
            <PlusIcon />
          </AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='grayscale' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/maxleiter.png' alt='@maxleiter' className='grayscale' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/evilrabbit.png' alt='@evilrabbit' className='grayscale' />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>
            <PlusIcon />
          </AvatarGroupCount>
        </AvatarGroup>
      </div>
    </DemoItem>
  )
}

export default AvatarDemo
