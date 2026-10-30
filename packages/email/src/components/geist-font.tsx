import { Font } from 'react-email'

type GeistFontProps = {
  siteUrl: string
}

function GeistFont(props: GeistFontProps) {
  const { siteUrl } = props

  return (
    <Font
      fontFamily='Geist'
      fallbackFontFamily='Arial'
      webFont={{
        url: new URL('/fonts/geist-latin-wght-normal.woff2', siteUrl).href,
        format: 'woff2',
      }}
      fontWeight={400}
      fontStyle='normal'
    />
  )
}

export default GeistFont
