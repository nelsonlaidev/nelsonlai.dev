import { Font } from 'react-email'

function GeistFont(props: { siteUrl: string }) {
  return (
    <Font
      fontFamily='Geist'
      fallbackFontFamily='Arial'
      webFont={{
        url: new URL('/fonts/geist-latin-wght-normal.woff2', props.siteUrl).href,
        format: 'woff2',
      }}
      fontWeight={400}
      fontStyle='normal'
    />
  )
}

export default GeistFont
