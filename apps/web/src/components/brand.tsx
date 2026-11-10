type OceanBrandProps = {
  large?: boolean
}

export function OceanBrand(props: OceanBrandProps) {
  const { large } = props

  return (
    <span
      className={
        large
          ? 'inline-flex items-center gap-3 text-2xl tracking-tight'
          : 'inline-flex items-center gap-2 text-base tracking-tight md:gap-3.5 md:text-lg'
      }
    >
      <img
        src='/brand/seafold-nacre.svg'
        width={38}
        height={38}
        alt=''
        className={large ? 'size-9 shrink-0 object-contain' : 'size-8 shrink-0 object-contain md:size-10'}
      />
      <span>Seafold</span>
    </span>
  )
}
