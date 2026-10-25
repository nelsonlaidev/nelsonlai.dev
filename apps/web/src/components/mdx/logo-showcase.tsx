import { Logo } from '@repo/ui/components/logo'

export function LogoShowcase() {
  return (
    <div className='not-prose flex flex-col gap-4 md:flex-row'>
      <div className='flex h-52 w-full items-center justify-center rounded-lg border bg-white'>
        <Logo aria-hidden='true' className='w-12 text-black' />
      </div>
      <div className='flex h-52 w-full items-center justify-center rounded-lg border bg-black'>
        <Logo aria-hidden='true' className='w-12 text-white' />
      </div>
    </div>
  )
}
