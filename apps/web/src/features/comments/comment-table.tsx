import { Table } from '@repo/ui/components/table'

export function CommentTable(props: React.ComponentProps<typeof Table>) {
  return (
    <div className='not-prose my-2'>
      <Table {...props} />
    </div>
  )
}
