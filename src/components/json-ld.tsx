import type { Thing, WithContext } from 'schema-dts'

type JsonLdProps = {
  json: WithContext<Thing>
}

function JsonLd(props: JsonLdProps) {
  const { json } = props

  // We need to use `dangerouslySetInnerHTML` to insert the JSON-LD script tag,
  // since React doesn't allow us to set the inner HTML of a component directly.
  // We also need to stringify the JSON-LD object before inserting it into the script tag.
  // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export default JsonLd
