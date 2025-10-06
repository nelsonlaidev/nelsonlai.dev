import { routing } from '@repo/i18n/routing'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

const Page = async (props: PageProps<'/[locale]/admin'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return <div>admin</div>
}

export default Page
