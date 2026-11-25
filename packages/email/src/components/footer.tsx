import { Hr, Text } from 'react-email'

const currentYear = new Date().getFullYear()

type FooterProps = {
  children?: React.ReactNode
}

export function Footer(props: FooterProps) {
  const { children } = props

  return (
    <>
      <Hr style={{ margin: '48px 0 24px', borderColor: '#d5e1dc' }} />
      {children}
      <Text style={{ fontSize: 13, lineHeight: '20px', margin: 0 }}>© {currentYear} Nelson Lai</Text>
    </>
  )
}
