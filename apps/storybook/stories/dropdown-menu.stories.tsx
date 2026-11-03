import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { useState } from 'react'

const meta = {
  title: 'Overlays and feedback/Dropdown menu',
  parameters: {
    docs: {
      description: {
        component:
          'Import the DropdownMenu* parts from @repo/ui/components/dropdown-menu. Content and submenu content supply portals. The real menu supports keyboard navigation, disabled/destructive items, checkbox/radio state, and submenus. Every action below changes local state only.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

function MenuExample() {
  const [grid, setGrid] = useState(true)
  const [density, setDensity] = useState('comfortable')
  const [action, setAction] = useState('No action')

  return (
    <div className='space-y-4'>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant='outline' />}>Open local menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Local draft</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setAction('Copied locally')
              }}
            >
              Copy<DropdownMenuShortcut>⌘ C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Unavailable action</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
            Show grid
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Density</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                <DropdownMenuRadioItem value='comfortable'>Comfortable</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='compact'>Compact</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='destructive'
            onClick={() => {
              setAction('Discarded local example')
            }}
          >
            Discard example
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <output>
        {action}; grid {grid ? 'on' : 'off'}; {density}
      </output>
    </div>
  )
}

export const ItemsAndSubmenu: Story = {
  render: () => <MenuExample />,
}
