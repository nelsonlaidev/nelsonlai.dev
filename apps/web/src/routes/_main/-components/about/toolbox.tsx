type AboutToolboxProps = {
  label: string
  title: React.ReactNode
  groups: Array<{
    label: string
    tools: string[]
  }>
}

export function AboutToolbox(props: AboutToolboxProps) {
  const { label, title, groups } = props

  return (
    <section className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr] lg:gap-14 xl:gap-24'>
      <div>
        <span className='mb-6 block text-xs/normal text-section-label'>{label}</span>
        <h2 className='text-4xl tracking-tighter lg:text-5xl 2xl:text-6xl [&_em]:font-serif [&_em]:text-primary'>
          {title}
        </h2>
      </div>
      <div>
        {groups.map((group) => (
          <div key={group.label} className='border-t pt-6 pb-8'>
            <span className='mb-4 text-sm/normal text-muted-foreground'>{group.label}</span>
            <p className='text-2xl/relaxed tracking-tight'>
              {group.tools.map((tool, index) => (
                <span key={tool}>
                  {index > 0 && (
                    <>
                      {' '}
                      <i className='px-2.5 text-muted-foreground not-italic'>·</i>{' '}
                    </>
                  )}
                  {tool}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
