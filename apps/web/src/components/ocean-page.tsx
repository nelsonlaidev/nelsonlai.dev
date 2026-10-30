type OceanPageProps = {
  children: React.ReactNode
}

export function OceanPage(props: OceanPageProps) {
  const { children } = props

  return (
    <div className='mx-auto min-h-[85vh] w-full max-w-400 pt-37.5 pr-[max(16px,env(safe-area-inset-right))] pb-11.25 pl-[max(16px,env(safe-area-inset-left))] min-[601px]:px-[8%] min-[601px]:pt-41.25 min-[601px]:pb-16.25 min-[1001px]:pt-46.25 min-[1101px]:px-[10%] min-[1600px]:px-40'>
      {children}
    </div>
  )
}
