import { BlurImage } from '@repo/ui/components/blur-image'
import { Link } from '@tanstack/react-router'
import { ArrowUpRightIcon } from 'lucide-react'

type ContentCardProps = {
  to: string
  title: string
  image: string
  imageAlt: string
  icon?: React.ReactNode
  featured?: boolean
  lazy?: boolean
  children?: React.ReactNode
}

export function ContentCard(props: ContentCardProps) {
  const { to, title, image, imageAlt, icon, featured = false, lazy = true, children } = props

  return (
    <Link to={to} className='group rounded-2xl p-2 shadow-feature-card'>
      {featured && (
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center gap-3'>
            {icon}
            <span>{title}</span>
          </div>
          <ArrowUpRightIcon className='size-4.5 opacity-0 transition-opacity group-hover:opacity-100' />
        </div>
      )}
      <BlurImage src={image} width={1200} height={630} alt={imageAlt} className='rounded-lg' lazy={lazy} />
      {children}
    </Link>
  )
}
