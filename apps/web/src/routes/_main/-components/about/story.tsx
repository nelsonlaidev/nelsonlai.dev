type AboutStoryProps = {
  label: string
  title: React.ReactNode
  children: React.ReactNode
}

export function AboutStory(props: AboutStoryProps) {
  const { label, title, children } = props

  return (
    <section className='mb-20 grid grid-cols-1 gap-6 lg:mb-32 lg:grid-cols-[1fr_2fr] lg:gap-14 xl:gap-24'>
      <div>
        <span className='mb-6 block text-xs/normal text-section-label'>{label}</span>
        <h2 className='text-4xl tracking-tighter lg:text-5xl 2xl:text-6xl [&_em]:font-serif [&_em]:text-primary'>
          {title}
        </h2>
      </div>
      <div className='prose border-t pt-6'>{children}</div>
    </section>
  )
}
