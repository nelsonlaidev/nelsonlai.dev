import { Font } from '@react-email/components'

function GeistFont() {
  return (
    <Font
      fontFamily='Geist'
      fallbackFontFamily='Arial'
      webFont={{
        url: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
        format: 'woff2',
      }}
      fontWeight={400}
      fontStyle='normal'
    />
  )
}

export default GeistFont
