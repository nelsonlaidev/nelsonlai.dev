import type { DecoratorProps } from 'react-cosmos-core'

import { Toaster } from './ui/sonner'

function Decorator(props: DecoratorProps) {
  const { children } = props

  return (
    <div className='mx-auto w-full max-w-3xl p-8'>
      {children}
      <Toaster />
    </div>
  )
}

export default Decorator
