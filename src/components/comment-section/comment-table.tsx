import { Table } from '@/components/ui/table'
import { cn } from '@/utils/cn'

type CommentTableProps = React.ComponentProps<'table'>

export function CommentTable(props: CommentTableProps) {
  const { className, ...rest } = props

  return <Table className={cn('not-prose my-2', className)} {...rest} />
}
