type AdminPageHeaderProps = {
  title: string
  description: string
}

export function AdminPageHeader(props: AdminPageHeaderProps) {
  const { title, description } = props

  return (
    <div className='flex items-center justify-between gap-4 pb-2'>
      <div>
        <h1 className='mb-3 text-3xl font-[420] tracking-tight sm:text-4xl'>{title}</h1>
        <p className='max-w-2xl text-base/relaxed text-muted-foreground'>{description}</p>
      </div>
    </div>
  )
}
