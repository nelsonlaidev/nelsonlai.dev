import { Table } from '@repo/ui/components/table'
import { cn } from 'cn'

export function CommentTable(props: React.ComponentProps<typeof Table>) {
  const { className, ...rest } = props
  return <Table className={cn('not-prose my-2', className)} {...rest} />
}
