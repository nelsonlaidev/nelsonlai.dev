import type { Thing, WithContext } from 'schema-dts'

type JsonLdProps = {
  json: WithContext<Thing>
}

function JsonLd(props: JsonLdProps) {
  const { json } = props

  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export default JsonLd
