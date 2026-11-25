type SectionHeadingProps = {
  title: string
  emphasis: string
  description: string
  className?: string
  id: string
}

export function SectionHeading(props: SectionHeadingProps) {
  const { id, title, emphasis, description, className } = props

  return (
    <div className={className}>
      <h2 id={id} className='mb-6 text-4xl tracking-tight lg:text-5xl 2xl:text-6xl'>
        {title}
        <br />
        <em className='font-serif text-primary'>{emphasis}</em>
      </h2>
      <p className='max-w-lg leading-relaxed text-muted-foreground md:whitespace-pre-line'>{description}</p>
    </div>
  )
}
