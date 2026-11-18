import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { cn } from 'cn'
import MarkdownToJSX from 'markdown-to-jsx'
import { Fragment, memo } from 'react'

import { MdxLink } from '@/components/mdx/mdx-link'

import { CommentCodeBlock } from './comment-code-block'
import { CommentTable } from './comment-table'

type CommentMarkdownProps = React.ComponentProps<'div'> & {
  children: string
}

export const CommentMarkdown = memo((props: CommentMarkdownProps) => {
  const { children, className, ...rest } = props

  return (
    <div className={cn('prose ml-0.5 min-w-0 py-3 wrap-break-word', className)} {...rest}>
      <MarkdownToJSX
        options={{
          overrides: {
            a: MdxLink,
            pre: CommentCodeBlock,
            table: CommentTable,
            thead: TableHeader,
            tbody: TableBody,
            tr: TableRow,
            th: TableHead,
            td: TableCell,
          },
          disableParsingRawHTML: true,
          wrapper: Fragment,
        }}
      >
        {children}
      </MarkdownToJSX>
    </div>
  )
})

CommentMarkdown.displayName = 'CommentMarkdown'
