import type { Thing, WithContext } from 'schema-dts'

type JsonLdProps = {
  json: WithContext<Thing>
}

export function JsonLd(props: JsonLdProps) {
  const { json } = props

  // We need to use `dangerouslySetInnerHTML` to insert the JSON-LD script tag.
  // oxlint-disable-next-line react/no-danger
  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}
