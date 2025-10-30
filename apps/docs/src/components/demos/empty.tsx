import { Button } from '@repo/ui/components/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@repo/ui/components/empty'
import { FolderIcon } from 'lucide-react'

const EmptyDemo = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className='flex gap-2'>
          <Button>Create Project</Button>
          <Button variant='outline'>Import Project</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}

export default EmptyDemo
