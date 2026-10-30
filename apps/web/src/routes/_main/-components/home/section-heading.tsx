export function SectionHeading(props: {
  compact?: boolean
  eyebrow: string
  title: string
  emphasis: string
  description?: string
  id: string
}) {
  return (
    <div className={props.compact ? 'mb-8' : 'mb-10 min-[701px]:mb-16'}>
      <p className='mb-6 text-xs text-primary'>{props.eyebrow}</p>
      <h2
        id={props.id}
        className='text-[39px]/[1.12] font-[410] tracking-tighter min-[701px]:text-[clamp(36px,4.1vw,64px)]'
      >
        {props.title}
        <br />
        <em className='font-serif tracking-[-0.04em] text-primary'>{props.emphasis}</em>
      </h2>
      {props.description && (
        <p className='mt-6 max-w-lg text-base/[1.65] text-muted-foreground min-[701px]:whitespace-pre-line'>
          {props.description}
        </p>
      )}
    </div>
  )
}
