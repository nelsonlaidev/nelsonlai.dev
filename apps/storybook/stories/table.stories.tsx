import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table'

const meta = {
  title: 'Data and display/Table',
  parameters: {
    docs: {
      description: {
        component:
          'Import the Table* parts from @repo/ui/components/table. This is a semantic table, not a data-fetching grid. Table supplies a horizontal overflow container. Use headers, a caption, and caller-provided loading/empty/error presentations where relevant.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const AnatomyAndOverflow: Story = {
  render: () => (
    <div className='max-w-2xl'>
      <Table>
        <TableCaption>Local component inventory</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope='col'>Component</TableHead>
            <TableHead scope='col'>Category</TableHead>
            <TableHead scope='col'>Description</TableHead>
            <TableHead scope='col' className='text-right'>
              Examples
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { name: 'Button', category: 'Actions', count: 8 },
            { name: 'Drawer', category: 'Overlays', count: 4 },
            { name: 'Chart', category: 'Display', count: 3 },
          ].map((row) => (
            <TableRow key={row.name}>
              <TableCell className='font-medium'>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>Long text to exercise the table overflow container on small screens.</TableCell>
              <TableCell className='text-right'>{row.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total examples</TableCell>
            <TableCell className='text-right'>15</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <Table>
      <TableCaption>No matching local items</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope='col'>Name</TableHead>
          <TableHead scope='col'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={2} className='h-24 text-center text-muted-foreground'>
            No items to display.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
