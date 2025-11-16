type ComponentPreviewEmbedProps = {
  name: string
}

const ComponentPreviewEmbed = (props: ComponentPreviewEmbedProps) => {
  const { name } = props

  return (
    <div className='aspect-[4/2.5] w-full overflow-hidden rounded-md border'>
      {/* eslint-disable-next-line @eslint-react/dom/no-missing-iframe-sandbox -- same origin */}
      <iframe
        src={`/embed?component=${name}`}
        title={`${name.split('/')[0]} demo`}
        className='size-full'
        loading='lazy'
        referrerPolicy='no-referrer'
      />
    </div>
  )
}

export default ComponentPreviewEmbed
