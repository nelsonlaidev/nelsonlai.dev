import { Demo, DemoItem } from '../ui/demo'
import { SegmentGroup, SegmentGroupItem } from '../ui/segment-group'

function SegmentGroupDemo() {
  return (
    <Demo title='Segment Group'>
      <SegmentGroupBasic />
      <SegmentGroupVertical />
    </Demo>
  )
}

const frameworks = ['React', 'Solid', 'Svelte', 'Vue']

function SegmentGroupBasic() {
  return (
    <DemoItem title='Basic' className='justify-center'>
      <SegmentGroup>
        {frameworks.map((framework) => (
          <SegmentGroupItem key={framework} value={framework}>
            {framework}
          </SegmentGroupItem>
        ))}
      </SegmentGroup>
    </DemoItem>
  )
}

function SegmentGroupVertical() {
  return (
    <DemoItem title='Vertical' className='justify-center'>
      <SegmentGroup orientation='vertical'>
        {frameworks.map((framework) => (
          <SegmentGroupItem key={framework} value={framework}>
            {framework}
          </SegmentGroupItem>
        ))}
      </SegmentGroup>
    </DemoItem>
  )
}

export default SegmentGroupDemo
