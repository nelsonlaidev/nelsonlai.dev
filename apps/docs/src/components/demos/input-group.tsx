import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from '@repo/ui/components/input-group'
import { Separator } from '@repo/ui/components/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { ArrowUpIcon, CheckIcon, InfoIcon, PlusIcon, SearchIcon } from 'lucide-react'

const InputGroupDemo = () => {
  return (
    <div className='grid w-full max-w-sm gap-6'>
      <InputGroup>
        <InputGroupInput placeholder='Search...' />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align='inline-end'>12 results</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder='example.com' className='pl-1!' />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align='inline-end'>
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton className='rounded-full' size='icon-xs'>
                <InfoIcon />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder='Ask, Search or Chat...' />
        <InputGroupAddon align='block-end'>
          <InputGroupButton variant='outline' className='rounded-full' size='icon-xs'>
            <PlusIcon />
          </InputGroupButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant='ghost'>Auto</InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='top' align='start' className='[--radius:0.95rem]'>
              <DropdownMenuItem>Auto</DropdownMenuItem>
              <DropdownMenuItem>Agent</DropdownMenuItem>
              <DropdownMenuItem>Manual</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupText className='ml-auto'>52% used</InputGroupText>
          <Separator orientation='vertical' className='h-4!' />
          <InputGroupButton variant='default' className='rounded-full' size='icon-xs' disabled>
            <ArrowUpIcon />
            <span className='sr-only'>Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder='@shadcn' />
        <InputGroupAddon align='inline-end'>
          <div className='flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground'>
            <CheckIcon className='size-3' />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default InputGroupDemo
