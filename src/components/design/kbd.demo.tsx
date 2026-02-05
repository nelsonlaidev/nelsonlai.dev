import { ArrowLeftIcon, ArrowRightIcon, CircleDashedIcon, SaveIcon } from 'lucide-react'

import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Kbd, KbdGroup } from '../ui/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

function KbdDemo() {
  return (
    <Demo title='Kbd'>
      <KbdBasic />
      <KbdModifierKeys />
      <KbdGroupExample />
      <KbdArrowKeys />
      <KbdWithIcons />
      <KbdWithIconsAndText />
      <KbdInInputGroup />
      <KbdInTooltip />
      <KbdWithSamp />
    </Demo>
  )
}

function KbdBasic() {
  return (
    <DemoItem title='Basic'>
      <Kbd>Ctrl</Kbd>
      <Kbd>⌘K</Kbd>
      <Kbd>Ctrl + B</Kbd>
    </DemoItem>
  )
}

function KbdModifierKeys() {
  return (
    <DemoItem title='Modifier Keys'>
      <Kbd>⌘</Kbd>
      <Kbd>C</Kbd>
    </DemoItem>
  )
}

function KbdGroupExample() {
  return (
    <DemoItem title='KbdGroup'>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </DemoItem>
  )
}

function KbdArrowKeys() {
  return (
    <DemoItem title='Arrow Keys'>
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </DemoItem>
  )
}

function KbdWithIcons() {
  return (
    <DemoItem title='With Icons'>
      <KbdGroup>
        <Kbd>
          <CircleDashedIcon />
        </Kbd>
        <Kbd>
          <ArrowLeftIcon />
        </Kbd>
        <Kbd>
          <ArrowRightIcon />
        </Kbd>
      </KbdGroup>
    </DemoItem>
  )
}

function KbdWithIconsAndText() {
  return (
    <DemoItem title='With Icons and Text'>
      <KbdGroup>
        <Kbd>
          <ArrowLeftIcon />
          Left
        </Kbd>
        <Kbd>
          <CircleDashedIcon />
          Voice Enabled
        </Kbd>
      </KbdGroup>
    </DemoItem>
  )
}

function KbdInInputGroup() {
  return (
    <DemoItem title='Input Group'>
      <InputGroup>
        <InputGroupInput />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </DemoItem>
  )
}

function KbdInTooltip() {
  return (
    <DemoItem title='Tooltip'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button size='icon-sm' variant='outline'>
              <SaveIcon />
            </Button>
          }
        />
        <TooltipContent className='pr-1.5'>
          <div className='flex items-center gap-2'>
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </DemoItem>
  )
}

function KbdWithSamp() {
  return (
    <DemoItem title='With samp'>
      <Kbd>
        <samp>File</samp>
      </Kbd>
    </DemoItem>
  )
}

export default KbdDemo
