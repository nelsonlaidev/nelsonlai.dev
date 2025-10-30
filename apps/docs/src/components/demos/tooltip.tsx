import { Button } from '@repo/ui/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'

const TooltipDemo = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline'>Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default TooltipDemo
