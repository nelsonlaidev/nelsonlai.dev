import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'

const ToggleGroupDemo = () => {
  return (
    <ToggleGroup variant='outline' type='multiple'>
      <ToggleGroupItem value='bold' aria-label='Toggle bold'>
        <BoldIcon className='size-4' />
      </ToggleGroupItem>
      <ToggleGroupItem value='italic' aria-label='Toggle italic'>
        <ItalicIcon className='size-4' />
      </ToggleGroupItem>
      <ToggleGroupItem value='strikethrough' aria-label='Toggle strikethrough'>
        <UnderlineIcon className='size-4' />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default ToggleGroupDemo
