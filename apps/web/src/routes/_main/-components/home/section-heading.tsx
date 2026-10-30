type SectionHeadingProps = {
  compact?: boolean
  eyebrow: string
  title: string
  emphasis: string
  description?: string
  id: string
}

export function SectionHeading(props: SectionHeadingProps) {
  const { compact, eyebrow, id, title, emphasis, description } = props

  return (
    <div className={compact ? 'mb-8' : 'mb-10 min-[701px]:mb-16'}>
      <p className='mb-6 text-xs text-primary'>{eyebrow}</p>
      <h2 id={id} className='text-[39px]/[1.12] font-[410] tracking-tighter min-[701px]:text-[clamp(36px,4.1vw,64px)]'>
        {title}
        <br />
        <em className='font-serif tracking-[-0.04em] text-primary'>{emphasis}</em>
      </h2>
      {description && (
        <p className='mt-6 max-w-lg text-base/[1.65] text-muted-foreground min-[701px]:whitespace-pre-line'>
          {description}
        </p>
      )}
    </div>
  )
}
