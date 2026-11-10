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
        'mx-auto min-h-[85vh] w-full max-w-400 pt-36 pr-[max(16px,env(safe-area-inset-right))] pb-11 pl-[max(16px,env(safe-area-inset-left))] sm:px-[8%] sm:pt-40 sm:pb-16 lg:pt-48 xl:px-[10%] 2xl:px-40',
        className,
      )}
    >
      {children}
    </div>
  )
}
