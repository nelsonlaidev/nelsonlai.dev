import { Logo } from '@/components/ui/logo'
import { MY_NAME } from '@/constants/site'

const BRAND_COLOR = '#ffffff'

function getTitleFontSize(text: string) {
  const len = text.length
  if (len <= 25) return 80
  if (len <= 50) return 64
  return 50
}

function getDescriptionFontSize(text: string) {
  const len = text.length
  if (len <= 30) return 52
  if (len <= 60) return 42
  return 34
}

type OGImageProps = {
  title: string
  description: string
}

export function OGImage(props: OGImageProps) {
  const { title, description } = props

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        padding: '4rem',
        backgroundColor: '#0c0c0c',
        borderBottom: `18px solid ${BRAND_COLOR}`,
      }}
    >
      <p
        style={{
          fontWeight: 800,
          fontSize: getTitleFontSize(title),
          margin: 0,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: getDescriptionFontSize(description),
          color: 'rgba(240,240,240,0.8)',
          margin: 0,
          marginTop: '16px',
          paddingBottom: '28px',
          borderBottom: `8px dashed ${BRAND_COLOR}`,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <Logo width={40} height={40} />
          <p
            style={{
              fontSize: '56px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {MY_NAME}
          </p>
        </div>
      </div>
    </div>
  )
}
