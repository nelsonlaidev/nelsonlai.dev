import type { Locale } from 'next-intl'

import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

const Page = (props: PageProps<'/[locale]/admin'>) => {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  return <div>admin</div>
}

export default Page
