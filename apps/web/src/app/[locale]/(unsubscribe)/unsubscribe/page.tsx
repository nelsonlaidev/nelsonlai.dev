import UnsubscribeError from '@/components/unsubscribe-error'
import UnsubscribeForm from '@/components/unsubscribe-form'
import { getReplyUnsubData } from '@/lib/unsubscribe'
import { loadUnsubscribeParams } from '@/lib/unsubscribe-params'

const Page = async (props: PageProps<'/[locale]/unsubscribe'>) => {
  const { searchParams } = props
  const { token } = await loadUnsubscribeParams(searchParams)
  const data = await getReplyUnsubData(token)

  return data ? <UnsubscribeForm data={data} /> : <UnsubscribeError />
}

export default Page
