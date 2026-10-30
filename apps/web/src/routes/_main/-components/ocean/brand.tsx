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
          : 'inline-flex items-center gap-2 text-base tracking-tight min-[701px]:gap-3.25 min-[701px]:text-lg'
      }
    >
      <img
        src='/brand/seafold-nacre.svg'
        width={38}
        height={38}
        alt=''
        className={large ? 'size-9 shrink-0 object-contain' : 'size-7.5 shrink-0 object-contain min-[701px]:size-9.5'}
      />
      <span>Seafold</span>
    </span>
  )
}
