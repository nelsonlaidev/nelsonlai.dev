import { describe, expect, it } from 'vitest'

import { groupClasses } from './group-classes'

describe('groupClasses', () => {
  describe('groups base classes together', () => {
    it('keeps base classes in one group', () => {
      const result = groupClasses(['flex', 'items-center', 'gap-4'])
      expect(result).toEqual(['flex items-center gap-4'])
    })

    it('separates base from variants', () => {
      const result = groupClasses(['flex', 'items-center', 'hover:bg-accent'])
      expect(result).toEqual(['flex items-center', 'hover:bg-accent'])
    })
  })

  describe('responsive modifiers', () => {
    it('groups dark: modifier', () => {
      const result = groupClasses(['bg-white', 'dark:bg-black'])
      expect(result).toEqual(['bg-white', 'dark:bg-black'])
    })

    it('groups sm: modifier', () => {
      const result = groupClasses(['text-sm', 'sm:text-base'])
      expect(result).toEqual(['text-sm', 'sm:text-base'])
    })

    it('groups md: modifier', () => {
      const result = groupClasses(['text-sm', 'md:text-base'])
      expect(result).toEqual(['text-sm', 'md:text-base'])
    })

    it('groups lg: modifier', () => {
      const result = groupClasses(['text-sm', 'lg:text-lg'])
      expect(result).toEqual(['text-sm', 'lg:text-lg'])
    })

    it('groups xl: modifier', () => {
      const result = groupClasses(['text-sm', 'xl:text-xl'])
      expect(result).toEqual(['text-sm', 'xl:text-xl'])
    })

    it('groups 2xl: modifier', () => {
      const result = groupClasses(['text-sm', '2xl:text-2xl'])
      expect(result).toEqual(['text-sm', '2xl:text-2xl'])
    })
  })

  describe('state modifiers', () => {
    it('groups hover: modifier', () => {
      const result = groupClasses(['bg-white', 'hover:bg-accent'])
      expect(result).toEqual(['bg-white', 'hover:bg-accent'])
    })

    it('groups first: modifier', () => {
      const result = groupClasses(['border-b', 'first:border-t'])
      expect(result).toEqual(['border-b', 'first:border-t'])
    })

    it('groups last: modifier', () => {
      const result = groupClasses(['border-b', 'last:border-b-0'])
      expect(result).toEqual(['border-b', 'last:border-b-0'])
    })

    it('groups before: modifier', () => {
      const result = groupClasses(['content-none', 'before:content-[""]'])
      expect(result).toEqual(['content-none', 'before:content-[""]'])
    })

    it('groups after: modifier', () => {
      const result = groupClasses(['content-none', 'after:content-[""]'])
      expect(result).toEqual(['content-none', 'after:content-[""]'])
    })

    it('groups active: modifier', () => {
      const result = groupClasses(['bg-white', 'active:bg-gray-200'])
      expect(result).toEqual(['bg-white', 'active:bg-gray-200'])
    })

    it('groups file: modifier', () => {
      const result = groupClasses(['border', 'file:border-0'])
      expect(result).toEqual(['border', 'file:border-0'])
    })

    it('groups placeholder: modifier', () => {
      const result = groupClasses(['text-black', 'placeholder:text-gray-400'])
      expect(result).toEqual(['text-black', 'placeholder:text-gray-400'])
    })

    it('groups selection: modifier', () => {
      const result = groupClasses(['text-black', 'selection:bg-blue-200'])
      expect(result).toEqual(['text-black', 'selection:bg-blue-200'])
    })

    it('groups focus: modifier', () => {
      const result = groupClasses(['ring-0', 'focus:ring-2'])
      expect(result).toEqual(['ring-0', 'focus:ring-2'])
    })

    it('groups focus-visible: modifier', () => {
      const result = groupClasses(['outline-none', 'focus-visible:ring-2'])
      expect(result).toEqual(['outline-none', 'focus-visible:ring-2'])
    })

    it('groups focus-within: modifier', () => {
      const result = groupClasses(['ring-0', 'focus-within:ring-2'])
      expect(result).toEqual(['ring-0', 'focus-within:ring-2'])
    })
  })

  describe('aria and disabled modifiers', () => {
    it('groups aria-invalid: modifier', () => {
      const result = groupClasses(['border', 'aria-invalid:border-red-500'])
      expect(result).toEqual(['border', 'aria-invalid:border-red-500'])
    })

    it('groups aria-disabled: modifier', () => {
      const result = groupClasses(['opacity-100', 'aria-disabled:opacity-50'])
      expect(result).toEqual(['opacity-100', 'aria-disabled:opacity-50'])
    })

    it('groups disabled: modifier', () => {
      const result = groupClasses(['opacity-100', 'disabled:opacity-50'])
      expect(result).toEqual(['opacity-100', 'disabled:opacity-50'])
    })

    it('groups peer-disabled: modifier', () => {
      const result = groupClasses(['opacity-100', 'peer-disabled:opacity-50'])
      expect(result).toEqual(['opacity-100', 'peer-disabled:opacity-50'])
    })
  })

  describe('data attribute modifiers', () => {
    it('groups data-[disabled]: modifier', () => {
      const result = groupClasses(['opacity-100', 'data-[disabled]:opacity-50'])
      expect(result).toEqual(['opacity-100', 'data-[disabled]:opacity-50'])
    })

    it('groups data-[inset]: modifier', () => {
      const result = groupClasses(['p-4', 'data-[inset]:p-0'])
      expect(result).toEqual(['p-4', 'data-[inset]:p-0'])
    })

    it('groups data-[placeholder]: modifier', () => {
      const result = groupClasses(['text-black', 'data-[placeholder]:text-gray-400'])
      expect(result).toEqual(['text-black', 'data-[placeholder]:text-gray-400'])
    })

    it('groups data-[disabled=true]: modifier', () => {
      const result = groupClasses(['opacity-100', 'data-[disabled=true]:opacity-50'])
      expect(result).toEqual(['opacity-100', 'data-[disabled=true]:opacity-50'])
    })

    it('groups data-[selected=true]: modifier', () => {
      const result = groupClasses(['bg-white', 'data-[selected=true]:bg-accent'])
      expect(result).toEqual(['bg-white', 'data-[selected=true]:bg-accent'])
    })

    it('groups data-[active=true]: modifier', () => {
      const result = groupClasses(['bg-white', 'data-[active=true]:bg-accent'])
      expect(result).toEqual(['bg-white', 'data-[active=true]:bg-accent'])
    })

    it('groups data-[state=open]: modifier', () => {
      const result = groupClasses(['opacity-0', 'data-[state=open]:opacity-100'])
      expect(result).toEqual(['opacity-0', 'data-[state=open]:opacity-100'])
    })

    it('groups data-[state=closed]: modifier', () => {
      const result = groupClasses(['opacity-100', 'data-[state=closed]:opacity-0'])
      expect(result).toEqual(['opacity-100', 'data-[state=closed]:opacity-0'])
    })

    it('groups data-[state=checked]: modifier', () => {
      const result = groupClasses(['bg-white', 'data-[state=checked]:bg-primary'])
      expect(result).toEqual(['bg-white', 'data-[state=checked]:bg-primary'])
    })

    it('groups data-[state=unchecked]: modifier', () => {
      const result = groupClasses(['bg-primary', 'data-[state=unchecked]:bg-white'])
      expect(result).toEqual(['bg-primary', 'data-[state=unchecked]:bg-white'])
    })

    it('groups data-[side=top]: modifier', () => {
      const result = groupClasses(['bottom-0', 'data-[side=top]:top-0'])
      expect(result).toEqual(['bottom-0', 'data-[side=top]:top-0'])
    })

    it('groups data-[orientation=horizontal]: modifier', () => {
      const result = groupClasses(['flex-col', 'data-[orientation=horizontal]:flex-row'])
      expect(result).toEqual(['flex-col', 'data-[orientation=horizontal]:flex-row'])
    })
  })

  describe('group modifiers', () => {
    it('groups group-data-[disabled=true]: modifier', () => {
      const result = groupClasses(['opacity-100', 'group-data-[disabled=true]:opacity-50'])
      expect(result).toEqual(['opacity-100', 'group-data-[disabled=true]:opacity-50'])
    })

    it('groups group-data-[side=left]: modifier', () => {
      const result = groupClasses(['ml-0', 'group-data-[side=left]:ml-4'])
      expect(result).toEqual(['ml-0', 'group-data-[side=left]:ml-4'])
    })

    it('groups group-has-data-[...]: modifier', () => {
      const result = groupClasses(['opacity-100', 'group-has-data-[active]:opacity-50'])
      expect(result).toEqual(['opacity-100', 'group-has-data-[active]:opacity-50'])
    })
  })

  describe('selector modifiers', () => {
    it('groups *: modifier', () => {
      const result = groupClasses(['text-base', '*:text-sm'])
      expect(result).toEqual(['text-base', '*:text-sm'])
    })

    it('groups **: modifier', () => {
      const result = groupClasses(['text-base', '**:text-sm'])
      expect(result).toEqual(['text-base', '**:text-sm'])
    })

    it('groups has-[>svg]: modifier', () => {
      const result = groupClasses(['p-4', 'has-[>svg]:p-2'])
      expect(result).toEqual(['p-4', 'has-[>svg]:p-2'])
    })

    it('groups [&>svg]: modifier', () => {
      const result = groupClasses(['text-base', '[&>svg]:size-4'])
      expect(result).toEqual(['text-base', '[&>svg]:size-4'])
    })

    it('groups [&_svg]: modifier', () => {
      const result = groupClasses(['text-base', '[&_svg]:pointer-events-none'])
      expect(result).toEqual(['text-base', '[&_svg]:pointer-events-none'])
    })

    it('groups [&>span:last-child]: modifier', () => {
      const result = groupClasses(['ml-0', '[&>span:last-child]:ml-2'])
      expect(result).toEqual(['ml-0', '[&>span:last-child]:ml-2'])
    })
  })

  describe('maintains order', () => {
    it('orders base before dark', () => {
      const result = groupClasses(['dark:bg-black', 'bg-white'])
      expect(result).toEqual(['bg-white', 'dark:bg-black'])
    })

    it('orders responsive modifiers correctly', () => {
      const result = groupClasses(['lg:text-lg', 'md:text-base', 'text-sm'])
      expect(result).toEqual(['text-sm', 'md:text-base', 'lg:text-lg'])
    })

    it('orders hover before focus', () => {
      const result = groupClasses(['focus:ring-2', 'hover:bg-accent', 'bg-white'])
      expect(result).toEqual(['bg-white', 'hover:bg-accent', 'focus:ring-2'])
    })

    it('orders first before last', () => {
      const result = groupClasses(['last:border-b-0', 'first:border-t', 'border-b'])
      expect(result).toEqual(['border-b', 'first:border-t', 'last:border-b-0'])
    })

    it('orders disabled before peer-disabled', () => {
      const result = groupClasses(['peer-disabled:opacity-25', 'disabled:opacity-50', 'opacity-100'])
      expect(result).toEqual(['opacity-100', 'disabled:opacity-50', 'peer-disabled:opacity-25'])
    })
  })

  describe('handles multiple classes per variant', () => {
    it('keeps multiple base classes together', () => {
      const result = groupClasses(['flex', 'items-center', 'gap-4', 'p-4'])
      expect(result).toEqual(['flex items-center gap-4 p-4'])
    })

    it('keeps multiple hover classes together', () => {
      const result = groupClasses(['bg-white', 'hover:bg-accent', 'hover:text-white'])
      expect(result).toEqual(['bg-white', 'hover:bg-accent hover:text-white'])
    })

    it('keeps multiple data attribute classes together', () => {
      const result = groupClasses(['opacity-0', 'data-[state=open]:opacity-100', 'data-[state=open]:scale-100'])
      expect(result).toEqual(['opacity-0', 'data-[state=open]:opacity-100 data-[state=open]:scale-100'])
    })
  })

  describe('edge cases', () => {
    it('handles empty array', () => {
      const result = groupClasses([])
      expect(result).toEqual([])
    })

    it('handles single class', () => {
      const result = groupClasses(['flex'])
      expect(result).toEqual(['flex'])
    })

    it('handles unknown modifiers at the end', () => {
      const result = groupClasses(['flex', 'custom:bg-red'])
      expect(result).toEqual(['flex', 'custom:bg-red'])
    })

    it('handles arbitrary values', () => {
      const result = groupClasses(['w-[200px]', 'hover:w-[250px]'])
      expect(result).toEqual(['w-[200px]', 'hover:w-[250px]'])
    })
  })

  describe('comprehensive ordering test', () => {
    it('orders all regex patterns correctly', () => {
      const input = [
        // Unknown modifier (should be last)
        'unknown:text-red',
        // Selector modifiers
        '[&_other]:text-xs',
        '[&>span:last-child]:ml-2',
        '[&_svg]:pointer-events-none',
        '[&>svg]:size-4',
        'has-[>svg]:p-2',
        '**:text-xs',
        '*:text-sm',
        // Group modifiers
        'group-has-data-[active]/sidebar:opacity-50',
        'group-has-data-[active]:opacity-50',
        'group-data-[collapsible=icon]:hidden',
        'group-data-[collapsible=offcanvas]:flex',
        'group-data-[side=right]:ml-4',
        'group-data-[side=left]:ml-4',
        'group-data-[disabled=true]:opacity-50',
        'group-data-[viewport=false]/navigation-menu:hidden',
        // Data attributes - vaul drawer
        'data-[vaul-drawer-direction=left]:left-0',
        'data-[vaul-drawer-direction=bottom]:bottom-0',
        'data-[vaul-drawer-direction=right]:right-0',
        'data-[vaul-drawer-direction=top]:top-0',
        // Data attributes - panel group
        'data-[panel-group-direction=vertical]:flex-col',
        // Data attributes - slot
        'data-[slot=navigation-menu-link]:underline',
        'data-[slot=command-input-wrapper]:px-3',
        'data-[slot=select-value]:pr-2',
        // Data attributes - variant
        'data-[variant=outline]:border',
        'data-[variant=inset]:pl-8',
        'data-[variant=destructive]:bg-red-500',
        // Data attributes - collapsible
        'data-[collapsible=icon]:w-16',
        'data-[collapsible=offcanvas]:w-64',
        // Data attributes - orientation
        'data-[orientation=vertical]:flex-col',
        'data-[orientation=horizontal]:flex-row',
        // Data attributes - motion
        'data-[motion=to-end]:slide-out-to-right',
        'data-[motion=to-start]:slide-out-to-left',
        'data-[motion=from-end]:slide-in-from-right',
        'data-[motion=from-start]:slide-in-from-left',
        'data-[motion^=to-]:animate-out',
        'data-[motion^=from-]:animate-in',
        // Data attributes - size
        'data-[size=sm]:h-8',
        'data-[size=default]:h-10',
        // Data attributes - side
        'data-[side=left]:left-0',
        'data-[side=bottom]:bottom-0',
        'data-[side=right]:right-0',
        'data-[side=top]:top-0',
        // Data attributes - state
        'data-[state=on]:bg-accent',
        'data-[state=active]:bg-accent',
        'data-[state=collapsed]:hidden',
        'data-[state=hidden]:hidden',
        'data-[state=visible]:block',
        'data-[state=unchecked]:bg-transparent',
        'data-[state=checked]:bg-primary',
        'data-[state=closed]:opacity-0',
        'data-[state=open]:opacity-100',
        // Data attributes - other
        'data-[active=true]:bg-accent',
        'data-[selected=true]:bg-accent',
        'data-[disabled=true]:opacity-50',
        'data-[placeholder]:text-muted',
        'data-[inset]:pl-8',
        'data-[disabled]:opacity-50',
        // Peer and disabled
        'peer-disabled:opacity-50',
        'disabled:opacity-50',
        'aria-disabled:cursor-not-allowed',
        'aria-invalid:border-red-500',
        // Focus states
        'focus-within:ring-2',
        'focus-visible:ring-2',
        'focus:ring-2',
        // Other states
        'selection:bg-blue-200',
        'placeholder:text-gray-400',
        'file:border-0',
        'active:bg-gray-200',
        'after:content-[""]',
        'before:content-[""]',
        'last:border-b-0',
        'first:border-t',
        'hover:bg-accent',
        // Responsive
        '2xl:text-2xl',
        'xl:text-xl',
        'lg:text-lg',
        'md:text-base',
        'sm:text-sm',
        'dark:bg-black',
        // Base classes
        'flex',
        'items-center',
        'gap-4'
      ]

      const result = groupClasses(input)

      expect(result).toEqual([
        'flex items-center gap-4',
        'dark:bg-black',
        'sm:text-sm',
        'md:text-base',
        'lg:text-lg',
        'xl:text-xl',
        '2xl:text-2xl',
        'hover:bg-accent',
        'first:border-t',
        'last:border-b-0',
        'before:content-[""]',
        'after:content-[""]',
        'active:bg-gray-200',
        'file:border-0',
        'placeholder:text-gray-400',
        'selection:bg-blue-200',
        'focus:ring-2',
        'focus-visible:ring-2',
        'focus-within:ring-2',
        'aria-invalid:border-red-500',
        'aria-disabled:cursor-not-allowed',
        'disabled:opacity-50',
        'peer-disabled:opacity-50',
        'data-[disabled]:opacity-50',
        'data-[inset]:pl-8',
        'data-[placeholder]:text-muted',
        'data-[disabled=true]:opacity-50',
        'data-[selected=true]:bg-accent',
        'data-[active=true]:bg-accent',
        'data-[state=open]:opacity-100',
        'data-[state=closed]:opacity-0',
        'data-[state=checked]:bg-primary',
        'data-[state=unchecked]:bg-transparent',
        'data-[state=visible]:block',
        'data-[state=hidden]:hidden',
        'data-[state=collapsed]:hidden',
        'data-[state=active]:bg-accent',
        'data-[state=on]:bg-accent',
        'data-[side=top]:top-0',
        'data-[side=right]:right-0',
        'data-[side=bottom]:bottom-0',
        'data-[side=left]:left-0',
        'data-[size=default]:h-10',
        'data-[size=sm]:h-8',
        'data-[motion^=from-]:animate-in',
        'data-[motion^=to-]:animate-out',
        'data-[motion=from-start]:slide-in-from-left',
        'data-[motion=from-end]:slide-in-from-right',
        'data-[motion=to-start]:slide-out-to-left',
        'data-[motion=to-end]:slide-out-to-right',
        'data-[orientation=horizontal]:flex-row',
        'data-[orientation=vertical]:flex-col',
        'data-[collapsible=offcanvas]:w-64',
        'data-[collapsible=icon]:w-16',
        'data-[variant=destructive]:bg-red-500',
        'data-[variant=inset]:pl-8',
        'data-[variant=outline]:border',
        'data-[slot=select-value]:pr-2',
        'data-[slot=command-input-wrapper]:px-3',
        'data-[slot=navigation-menu-link]:underline',
        'data-[panel-group-direction=vertical]:flex-col',
        'data-[vaul-drawer-direction=top]:top-0',
        'data-[vaul-drawer-direction=right]:right-0',
        'data-[vaul-drawer-direction=bottom]:bottom-0',
        'data-[vaul-drawer-direction=left]:left-0',
        'group-data-[viewport=false]/navigation-menu:hidden',
        'group-data-[disabled=true]:opacity-50',
        'group-data-[side=left]:ml-4',
        'group-data-[side=right]:ml-4',
        'group-data-[collapsible=offcanvas]:flex',
        'group-data-[collapsible=icon]:hidden',
        'group-has-data-[active]:opacity-50',
        'group-has-data-[active]/sidebar:opacity-50',
        '*:text-sm',
        '**:text-xs',
        'has-[>svg]:p-2',
        '[&>svg]:size-4',
        '[&_svg]:pointer-events-none',
        '[&>span:last-child]:ml-2',
        '[&_other]:text-xs',
        'unknown:text-red'
      ])
    })
  })
})
