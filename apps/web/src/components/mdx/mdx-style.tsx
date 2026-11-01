import { useCspNonce } from '@repo/ui/components/ui-provider'

/** Authorize the stylesheet emitted by the MDX syntax-highlighting plugins. */
export function MdxStyle(props: React.ComponentProps<'style'>) {
  const nonce = useCspNonce()

  return <style {...props} nonce={nonce} />
}
