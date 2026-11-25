import { Column, Img, Row } from 'react-email'

type LogoProps = {
  siteUrl: string
}

export function Logo(props: LogoProps) {
  const { siteUrl } = props

  return (
    <Row>
      <Column style={{ width: 40, verticalAlign: 'middle' }}>
        <Img
          src={new URL('/favicon-96x96.png', siteUrl).href}
          alt=''
          width='32'
          height='32'
          style={{ borderRadius: 6 }}
        />
      </Column>
      <Column style={{ fontSize: 18, fontWeight: 600, verticalAlign: 'middle' }}>Seafold</Column>
    </Row>
  )
}
