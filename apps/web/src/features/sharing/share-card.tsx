type ShareCardProps = {
  title: string
  description: string
  group: string
  index: number
  fontFamily: string
  logo: string
}

/** The approved Seafold page template, with live localized content. */
export function ShareCard(props: ShareCardProps) {
  const { title, description, group, index, fontFamily, logo } = props
  const light = ['#1b6869', '#18586a', '#245d59'][index % 3]
  // CJK glyphs are wider than Latin letters; use the same two-line title area.
  let titleSize = 88
  if (title.length > 80) titleSize = 48
  else if (title.length > 34) titleSize = 64
  else if (title.length > 24) titleSize = 72
  let byline = 'Nelson Lai'
  if (group === 'Blog') byline = 'Writing by Nelson Lai'
  else if (group === 'Projects') byline = 'Made by Nelson Lai'

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        position: 'relative',
        overflow: 'hidden',
        fontFamily,
        color: '#e7eee5',
        background: `linear-gradient(125deg, ${light} 0%, #082f3e 40%, #031a2c 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 470,
          height: 1000,
          left: 610 + (index % 3) * 90,
          top: -420,
          transform: 'rotate(28deg)',
          background: 'linear-gradient(90deg, transparent, #9bd8bd18, transparent)',
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 1100 + i * 200,
            height: 500 + i * 140,
            right: -400 - i * 110,
            bottom: -360 - i * 60,
            border: '1px solid #9cd3c044',
            borderRadius: '50%',
            transform: 'rotate(-17deg)',
          }}
        />
      ))}
      <div style={{ position: 'absolute', top: 48, left: 64, fontSize: 25, color: '#b4d3c6' }}>Seafold / {group}</div>
      <img alt='' src={logo} width={76} height={76} style={{ position: 'absolute', right: 56, top: 36 }} />
      <div style={{ position: 'absolute', left: 64, top: 170, width: 1040 }}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 500,
            lineHeight: 1.07,
            letterSpacing: -2.5,
            maxWidth: 1040,
            lineClamp: 2,
            overflow: 'hidden',
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 29,
            lineHeight: 1.4,
            marginTop: 30,
            maxWidth: 850,
            color: '#bfd7ca',
            lineClamp: 3,
            overflow: 'hidden',
            overflowWrap: 'anywhere',
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 64,
          width: 1072,
          borderTop: '1px solid #a4cfb947',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          color: '#a9c9bd',
        }}
      >
        <span>{byline}</span>
        <span>Seafold</span>
      </div>
    </div>
  )
}
