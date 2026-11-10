import { cn } from 'cn'

type SectionProps = {
  id: string
  className: string
  children: React.ReactNode
}

export function Section(props: SectionProps) {
  const { id, className, children } = props

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        'mx-auto max-w-400 pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] md:px-[10%]',
        id !== 'home' && 'scroll-mt-12 md:scroll-mt-16',
        className,
      )}
    >
      {children}
    </section>
  )
}
