import type { Thing, WithContext } from 'schema-dts'

type JsonLdProps = {
  json: WithContext<Thing>
}

const JsonLd = (props: JsonLdProps) => {
  const { json } = props

  // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- safe
  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export default JsonLd
