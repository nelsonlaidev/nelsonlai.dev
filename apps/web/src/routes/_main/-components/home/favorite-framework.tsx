import { SiNextdotjs } from '@icons-pack/react-simple-icons'
import { HeartIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

export function FavoriteFramework() {
  return (
    <div className='flex flex-col gap-6 rounded-2xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <HeartIcon className='size-4.5' />
        <h2 className='text-sm'>{m.homepage_about_me_fav_framework()}</h2>
      </div>
      <div className='flex items-center justify-center'>
        <SiNextdotjs size={80} />
      </div>
    </div>
  )
}
