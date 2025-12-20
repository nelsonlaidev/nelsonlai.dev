import { Kbd, KbdGroup } from '@repo/ui/components/kbd'

function KbdDemo() {
  return (
    <div className='flex flex-col items-center gap-4'>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
    </div>
  )
}

export default KbdDemo
