import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'

type TableProps = {
  headers: string[]
  rows: string[][]
}

const Table = (props: TableProps) => {
  const { headers, rows } = props

  return (
    <UITable className='not-prose'>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={`${index}`}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  )
}

export default Table
