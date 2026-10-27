import { TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import MarkdownToJSX from 'markdown-to-jsx'
import { Fragment, memo } from 'react'

import { CommentCodeBlock } from '@/features/comments/comment-code-block'
import { CommentTable } from '@/features/comments/comment-table'

import { MdxLink } from './mdx-link'

type MarkdownProps = {
  children: string
}

export const Markdown = memo((props: MarkdownProps) => {
  const { children } = props

  return (
    <div className='my-3 prose ml-0.5 min-w-0 wrap-break-word'>
      <MarkdownToJSX
        options={{
          overrides: {
            a: MdxLink,
            pre: CommentCodeBlock,
            table: CommentTable,
            thead: TableHeader,
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

Markdown.displayName = 'Markdown'
