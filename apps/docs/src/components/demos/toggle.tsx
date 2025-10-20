import { BoldIcon } from 'lucide-react'

import { Toggle } from '../ui/toggle'

const ToggleDemo = () => {
  return (
    <Toggle aria-label='Toggle italic'>
      <BoldIcon className='size-4' />
    </Toggle>
  )
}

export default ToggleDemo
