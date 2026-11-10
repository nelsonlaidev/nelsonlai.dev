import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

type AboutToolboxProps = {
  label: string
  title: React.ReactNode
  groups: Array<{
    label: string
    tools: string[]
  }>
  setupLabel: string
}

export function AboutToolbox(props: AboutToolboxProps) {
  const { label, title, groups, setupLabel } = props

  return (
    <section className='mt-20 grid grid-cols-1 gap-6 lg:mt-32 lg:grid-cols-[1fr_2fr] lg:gap-14 xl:gap-24'>
      <div>
        <span className='block text-xs/normal text-section-label'>{label}</span>
        <h2 className='mt-6 text-4xl tracking-tighter lg:text-5xl 2xl:text-6xl [&_em]:font-serif [&_em]:tracking-tighter [&_em]:text-primary'>
          {title}
        </h2>
      </div>
      <div>
        {groups.map((group) => (
          <div key={group.label} className='border-t pt-6 pb-8'>
            <span className='text-sm/normal text-muted-foreground'>{group.label}</span>
            <p className='mt-4 text-2xl/relaxed tracking-tight'>
              {group.tools.map((tool, toolIndex) => (
                <span key={tool}>
                  {toolIndex > 0 && (
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
        <Link to='/uses' className='group inline-flex items-center gap-2 text-sm text-link'>
          {setupLabel}
          <ArrowRightIcon
            className='size-5 transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 motion-reduce:transition-none'
            aria-hidden='true'
          />
        </Link>
      </div>
    </section>
  )
}
