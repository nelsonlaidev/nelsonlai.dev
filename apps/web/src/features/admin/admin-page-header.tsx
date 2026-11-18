type AdminPageHeaderProps = {
  title: string
  description: string
}

export function AdminPageHeader(props: AdminPageHeaderProps) {
  const { title, description } = props

  return (
    <div className='pb-2'>
      <h1 className='mb-3 text-3xl tracking-tight sm:text-4xl'>{title}</h1>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  )
}
