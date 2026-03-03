import '@/styles/globals.css'

function Layout(props: LayoutProps<'/cosmos/[fixture]'>) {
  const { children } = props

  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}

export default Layout
