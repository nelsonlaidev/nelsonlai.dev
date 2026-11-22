import { Font } from 'react-email'

type GeistFontProps = {
  siteUrl: string
}

export function GeistFont(props: GeistFontProps) {
  const { siteUrl } = props

  return (
    <Font
      fontFamily='Geist'
      fallbackFontFamily={['Arial', 'sans-serif']}
      webFont={{
        url: new URL('/fonts/geist-latin-wght-normal.woff2', siteUrl).href,
        format: 'woff2',
      }}
      fontWeight='100 900'
      fontStyle='normal'
    />
  )
}
