import { cn } from 'cn'

type OceanPageProps = {
  children: React.ReactNode
  className?: string
}

export function OceanPage(props: OceanPageProps) {
  const { children, className } = props

  return (
    <div
      className={cn(
        'mx-auto min-h-[85vh] w-full max-w-400 pt-36 page-gutter pb-11 sm:pt-40 sm:pb-16 sm:[--page-gutter:8%] lg:pt-48 xl:[--page-gutter:10%] 2xl:[--page-gutter:--spacing(40)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
