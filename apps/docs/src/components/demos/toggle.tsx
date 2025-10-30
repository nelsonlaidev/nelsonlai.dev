import { Toggle } from '@repo/ui/components/toggle'
import { BoldIcon } from 'lucide-react'

const ToggleDemo = () => {
  return (
    <Toggle aria-label='Toggle italic'>
      <BoldIcon className='size-4' />
    </Toggle>
  )
}

export default ToggleDemo
