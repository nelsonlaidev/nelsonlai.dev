'use client'

import { Button } from '@repo/ui/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { CodeBlock } from 'fumadocs-ui/components/codeblock'
import { RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'

type ComponentPreviewTabs = {
  preview: React.ReactNode
  source: React.ReactNode
}

const ComponentPreviewTabs = (props: ComponentPreviewTabs) => {
  const { preview, source } = props
  const [key, setKey] = useState(0)

  return (
    <Tabs defaultValue='preview'>
      <TabsList>
        <TabsTrigger value='preview'>Preview</TabsTrigger>
        <TabsTrigger value='code'>Code</TabsTrigger>
      </TabsList>
      <TabsContent value='preview' className='relative' key={key}>
        <Button
          className='absolute top-1.5 right-1.5 z-10'
          variant='outline'
          size='icon'
          onClick={() => {
            setKey((prev) => prev + 1)
          }}
          aria-label='Reload preview'
        >
          <RotateCcwIcon />
        </Button>
        <div className='not-prose flex min-h-[350px] items-center justify-center rounded-lg border px-10 py-12'>
          {preview}
        </div>
      </TabsContent>
      <TabsContent value='code'>
        <CodeBlock>{source}</CodeBlock>
      </TabsContent>
    </Tabs>
  )
}

export default ComponentPreviewTabs
