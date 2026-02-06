'use client'

import {
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  CodeIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeOffIcon,
  InfoIcon,
  MailIcon,
  MicIcon,
  RadioIcon,
  RefreshCwIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  TrashIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Demo, DemoItem } from '../ui/demo'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '../ui/input-group'
import { Kbd, KbdGroup } from '../ui/kbd'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '../ui/popover'
import { Spinner } from '../ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

function InputGroupDemo() {
  return (
    <Demo title='Input Group'>
      <InputGroupBasic />
      <InputGroupWithAddons />
      <InputGroupWithButtons />
      <InputGroupWithTooltip />
      <InputGroupWithKbd />
      <InputGroupInCard />
      <InputGroupTextareaExamples />
    </Demo>
  )
}

function InputGroupBasic() {
  return (
    <DemoItem title='Basic'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='input-group'>Input Group</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group' placeholder='Placeholder' />
          </InputGroup>
        </Field>
        <Field data-disabled='true'>
          <FieldLabel htmlFor='input-group-disabled'>Disabled</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-disabled' placeholder='This field is disabled' disabled />
          </InputGroup>
        </Field>
        <Field data-invalid='true'>
          <FieldLabel htmlFor='input-group-invalid'>Invalid</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-invalid' placeholder='This field is invalid' aria-invalid='true' />
          </InputGroup>
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function InputGroupWithAddons() {
  return (
    <DemoItem title='With Addons'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='input-group-addon-inline-start'>Addon (inline-start)</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-addon-inline-start' />
            <InputGroupAddon>
              <SearchIcon className='text-muted-foreground' />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-addon-inline-end'>Addon (inline-end)</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-addon-inline-end' />
            <InputGroupAddon align='inline-end'>
              <EyeOffIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-addon-both'>Addon (inline-start and inline-end)</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-addon-both' />
            <InputGroupAddon>
              <MicIcon className='text-muted-foreground' />
            </InputGroupAddon>
            <InputGroupAddon align='inline-end'>
              <RadioIcon className='animate-pulse text-red-500' />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-addon-block-start'>Addon (block-start)</FieldLabel>
          <InputGroup className='h-auto'>
            <InputGroupInput id='input-group-addon-block-start' />
            <InputGroupAddon align='block-start'>
              <InputGroupText>First Name</InputGroupText>
              <InfoIcon className='ml-auto text-muted-foreground' />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-addon-block-end'>Addon (block-end)</FieldLabel>
          <InputGroup className='h-auto'>
            <InputGroupInput id='input-group-addon-block-end' />
            <InputGroupAddon align='block-end'>
              <InputGroupText>20/240 characters</InputGroupText>
              <InfoIcon className='ml-auto text-muted-foreground' />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-addon-multiple-icons'>Multiple Icons</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-addon-multiple-icons' />
            <InputGroupAddon align='inline-end'>
              <StarIcon />
              <InputGroupButton size='icon-xs' onClick={() => toast('Copied to clipboard')}>
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon>
              <RadioIcon className='animate-pulse text-red-500' />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-description'>Description</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-description' />
            <InputGroupAddon align='inline-end'>
              <InfoIcon />
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-label'>Label</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <FieldLabel htmlFor='input-group-label'>Label</FieldLabel>
            </InputGroupAddon>
            <InputGroupInput id='input-group-label' />
          </InputGroup>
          <InputGroup>
            <InputGroupInput aria-label='Optional' />
            <InputGroupAddon align='inline-end'>
              <InputGroupText>(optional)</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function InputGroupWithButtons() {
  return (
    <DemoItem title='With Buttons'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='input-group-button'>Button</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-button' />
            <InputGroupAddon>
              <InputGroupButton>Default</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput />
            <InputGroupAddon>
              <InputGroupButton variant='outline'>Outline</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput />
            <InputGroupAddon>
              <InputGroupButton variant='secondary'>Secondary</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton variant='secondary'>Button</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton size='icon-xs'>
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton variant='secondary' size='icon-xs'>
                <TrashIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function InputGroupWithTooltip() {
  const [country, setCountry] = useState('+1')

  return (
    <DemoItem title='With Tooltip, Dropdown, Popover'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='input-group-tooltip'>Tooltip</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-tooltip' />
            <InputGroupAddon align='inline-end'>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton className='rounded-full' size='icon-xs'>
                      <InfoIcon />
                    </InputGroupButton>
                  }
                />
                <TooltipContent>This is content in a tooltip.</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-dropdown'>Dropdown</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-dropdown' />
            <InputGroupAddon>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <InputGroupButton className='text-muted-foreground tabular-nums'>
                      {country} <ChevronDownIcon />
                    </InputGroupButton>
                  }
                />
                <DropdownMenuContent align='start' className='min-w-16' sideOffset={10} alignOffset={-8}>
                  <DropdownMenuItem
                    onClick={() => {
                      setCountry('+1')
                    }}
                  >
                    +1
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setCountry('+44')
                    }}
                  >
                    +44
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setCountry('+46')
                    }}
                  >
                    +46
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-popover'>Popover</FieldLabel>
          <InputGroup>
            <Popover>
              <PopoverTrigger
                nativeButton={false}
                render={
                  <InputGroupAddon>
                    <InputGroupButton variant='secondary' size='icon-xs'>
                      <InfoIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                }
              />
              <PopoverContent align='start'>
                <PopoverHeader>
                  <PopoverTitle>Your connection is not secure.</PopoverTitle>
                  <PopoverDescription>You should not enter any sensitive information on this site.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
            <InputGroupAddon className='pl-1 text-muted-foreground'>https://</InputGroupAddon>
            <InputGroupInput id='input-group-popover' />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton size='icon-xs' onClick={() => toast('Added to favorites')}>
                <StarIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function InputGroupWithKbd() {
  return (
    <DemoItem title='With Kbd'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='input-group-kbd'>Input Group with Kbd</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-kbd' />
            <InputGroupAddon>
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput />
            <InputGroupAddon align='inline-end'>
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder='Search for Apps...' />
            <InputGroupAddon align='inline-end'>Ask AI</InputGroupAddon>
            <InputGroupAddon align='inline-end'>
              <Kbd>Tab</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder='Type to search...' />
            <InputGroupAddon align='inline-start'>
              <SparklesIcon />
            </InputGroupAddon>
            <InputGroupAddon align='inline-end'>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>C</Kbd>
              </KbdGroup>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-username'>Username</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-username' defaultValue='shadcn' />
            <InputGroupAddon align='inline-end'>
              <div className='flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800'>
                <CheckIcon className='size-3 text-white' />
              </div>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription className='text-green-700'>This username is available.</FieldDescription>
        </Field>
        <InputGroup>
          <InputGroupInput placeholder='Search documentation...' />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end'>12 results</InputGroupAddon>
        </InputGroup>
        <InputGroup data-disabled='true'>
          <InputGroupInput placeholder='Search documentation...' disabled />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end'>Disabled</InputGroupAddon>
        </InputGroup>
        <FieldGroup className='grid grid-cols-2 gap-4'>
          <Field>
            <FieldLabel htmlFor='input-group-first-name'>First Name</FieldLabel>
            <InputGroup>
              <InputGroupInput id='input-group-first-name' placeholder='First Name' />
              <InputGroupAddon align='inline-end'>
                <InfoIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor='input-group-last-name'>Last Name</FieldLabel>
            <InputGroup>
              <InputGroupInput id='input-group-last-name' placeholder='Last Name' />
              <InputGroupAddon align='inline-end'>
                <InfoIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
        <Field data-disabled='true'>
          <FieldLabel htmlFor='input-group-loading'>Loading (&quot;data-disabled=&quot;true&quot;)</FieldLabel>
          <InputGroup>
            <InputGroupInput id='input-group-loading' disabled defaultValue='shadcn' />
            <InputGroupAddon align='inline-end'>
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function InputGroupInCard() {
  return (
    <DemoItem title='In Card'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Card with Input Group</CardTitle>
          <CardDescription>This is a card with an input group.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='input-group-email'>Email Address</FieldLabel>
              <InputGroup>
                <InputGroupInput id='input-group-email' type='email' placeholder='you@example.com' />
                <InputGroupAddon align='inline-end'>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor='input-group-website'>Website URL</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput id='input-group-website' placeholder='example.com' />
                <InputGroupAddon align='inline-end'>
                  <ExternalLinkIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor='input-group-feedback'>Feedback & Comments</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id='input-group-feedback'
                  placeholder='Share your thoughts...'
                  className='min-h-25'
                />
                <InputGroupAddon align='block-end'>
                  <InputGroupText>0/500 characters</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-end gap-2'>
          <Button variant='outline'>Cancel</Button>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </DemoItem>
  )
}

function InputGroupTextareaExamples() {
  return (
    <DemoItem title='Textarea'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='input-group-textarea'>Input Group</FieldLabel>
          <InputGroup>
            <InputGroupTextarea id='input-group-textarea' placeholder='Enter your text here...' />
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
        <Field data-disabled='true'>
          <FieldLabel htmlFor='input-group-textarea-disabled'>Disabled</FieldLabel>
          <InputGroup>
            <InputGroupTextarea id='input-group-textarea-disabled' placeholder='Enter your text here...' disabled />
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
        <Field data-invalid='true'>
          <FieldLabel htmlFor='input-group-textarea-invalid'>Invalid</FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id='input-group-textarea-invalid'
              placeholder='Enter your text here...'
              aria-invalid='true'
            />
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-textarea-addon-block-start'>Addon (block-start)</FieldLabel>
          <InputGroup>
            <InputGroupTextarea id='input-group-textarea-addon-block-start' />
            <InputGroupAddon align='block-start'>
              <InputGroupText>Ask, Search or Chat...</InputGroupText>
              <InfoIcon className='ml-auto text-muted-foreground' />
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>This is a description of the input group.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-textarea-addon-block-end'>Addon (block-end)</FieldLabel>
          <InputGroup>
            <InputGroupTextarea id='input-group-textarea-addon-block-end' placeholder='Enter your text here...' />
            <InputGroupAddon align='block-end'>
              <InputGroupText>0/280 characters</InputGroupText>
              <InputGroupButton variant='default' size='icon-xs' className='ml-auto rounded-full'>
                <ArrowUpIcon />
                <span className='sr-only'>Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-textarea-addon-buttons'>Addon (Buttons)</FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id='input-group-textarea-addon-buttons'
              placeholder='Share your thoughts...'
              className='min-h-30'
            />
            <InputGroupAddon align='block-end'>
              <InputGroupButton variant='ghost' className='ml-auto' size='sm'>
                Cancel
              </InputGroupButton>
              <InputGroupButton variant='default' size='sm'>
                Post Comment
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='input-group-textarea-code'>Code Editor</FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id='input-group-textarea-code'
              placeholder="console.log('Hello, world!');"
              className='min-h-75 py-3'
            />
            <InputGroupAddon align='block-start' className='border-b'>
              <InputGroupText className='font-mono font-medium'>
                <CodeIcon />
                script.js
              </InputGroupText>
              <InputGroupButton size='icon-xs' className='ml-auto'>
                <RefreshCwIcon />
              </InputGroupButton>
              <InputGroupButton size='icon-xs' variant='ghost'>
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon align='block-end' className='border-t'>
              <InputGroupText>Line 1, Column 1</InputGroupText>
              <InputGroupText className='ml-auto'>JavaScript</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

export default InputGroupDemo
