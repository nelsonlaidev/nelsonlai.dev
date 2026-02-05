import { SiNextdotjs } from '@icons-pack/react-simple-icons'
import { HeartIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

function FavoriteFramework() {
  const t = useTranslations()

  return (
    <div className='flex flex-col gap-6 rounded-2xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <HeartIcon className='size-4.5' />
        <h2 className='text-sm'>{t('homepage.about-me.fav-framework')}</h2>
      </div>
      <div className='flex items-center justify-center'>
        <SiNextdotjs size={80} />
      </div>
    </div>
  )
}

export default FavoriteFramework
