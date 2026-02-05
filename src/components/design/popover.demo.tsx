import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '../ui/popover'

function PopoverDemo() {
  return (
    <Demo title='Popover'>
      <PopoverBasic />
      <PopoverSides />
      <PopoverWithForm />
      <PopoverAlignments />
      <PopoverInDialog />
    </Demo>
  )
}

function PopoverBasic() {
  return (
    <DemoItem title='Basic'>
      <Popover>
        <PopoverTrigger render={<Button variant='outline'>Open Popover</Button>} />
        <PopoverContent align='start'>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </DemoItem>
  )
}

function PopoverSides() {
  return (
    <DemoItem title='Sides'>
      {(['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger
            render={
              <Button variant='outline' className='capitalize'>
                {side.replace('-', ' ')}
              </Button>
            }
          />
          <PopoverContent side={side} className='w-40'>
            <p>Popover on {side.replace('-', ' ')}</p>
          </PopoverContent>
        </Popover>
      ))}
    </DemoItem>
  )
}

function PopoverWithForm() {
  return (
    <DemoItem title='With Form'>
      <Popover>
        <PopoverTrigger render={<Button variant='outline'>Open Popover</Button>} />
        <PopoverContent className='w-64' align='start'>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <FieldGroup className='gap-4'>
            <Field orientation='horizontal'>
              <FieldLabel htmlFor='width' className='w-1/2'>
                Width
              </FieldLabel>
              <Input id='width' defaultValue='100%' />
            </Field>
            <Field orientation='horizontal'>
              <FieldLabel htmlFor='height' className='w-1/2'>
                Height
              </FieldLabel>
              <Input id='height' defaultValue='25px' />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </DemoItem>
  )
}

function PopoverAlignments() {
  return (
    <DemoItem title='Alignments'>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant='outline' size='sm'>
              Start
            </Button>
          }
        />
        <PopoverContent align='start' className='w-40'>
          Aligned to start
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant='outline' size='sm'>
              Center
            </Button>
          }
        />
        <PopoverContent align='center' className='w-40'>
          Aligned to center
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant='outline' size='sm'>
              End
            </Button>
          }
        />
        <PopoverContent align='end' className='w-40'>
          Aligned to end
        </PopoverContent>
      </Popover>
    </DemoItem>
  )
}

function PopoverInDialog() {
  return (
    <DemoItem title='In Dialog'>
      <Dialog>
        <DialogTrigger render={<Button variant='outline'>Open Dialog</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Popover Example</DialogTitle>
            <DialogDescription>Click the button below to see the popover.</DialogDescription>
          </DialogHeader>
          <Popover>
            <PopoverTrigger render={<Button variant='outline'>Open Popover</Button>} />
            <PopoverContent align='start'>
              <PopoverHeader>
                <PopoverTitle>Popover in Dialog</PopoverTitle>
                <PopoverDescription>
                  This popover appears inside a dialog. Click the button to open it.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </DialogContent>
      </Dialog>
    </DemoItem>
  )
}

export default PopoverDemo
