import { ResizablePanel, ResizablePanelGroup, ResizableSeparator } from '@repo/ui/components/resizable'

function ResizableDemo() {
  return (
    <ResizablePanelGroup orientation='horizontal' className='max-w-md rounded-lg border md:min-w-[450px]'>
      <ResizablePanel defaultSize={50}>
        <div className='flex h-[200px] items-center justify-center p-6'>
          <span className='font-semibold'>One</span>
        </div>
      </ResizablePanel>
      <ResizableSeparator withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup orientation='vertical'>
          <ResizablePanel defaultSize={25}>
            <div className='flex h-full items-center justify-center p-6'>
              <span className='font-semibold'>Two</span>
            </div>
          </ResizablePanel>
          <ResizableSeparator />
          <ResizablePanel defaultSize={75}>
            <div className='flex h-full items-center justify-center p-6'>
              <span className='font-semibold'>Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ResizableDemo
