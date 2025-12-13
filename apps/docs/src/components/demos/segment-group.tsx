import { SegmentGroup, SegmentGroupItem } from '@repo/ui/components/segment-group'

const frameworks = ['React', 'Solid', 'Svelte', 'Vue']

const SegmentGroupDemo = () => {
  return (
    <SegmentGroup>
      {frameworks.map((framework) => (
        <SegmentGroupItem key={framework} value={framework}>
          {framework}
        </SegmentGroupItem>
      ))}
    </SegmentGroup>
  )
}

export default SegmentGroupDemo
