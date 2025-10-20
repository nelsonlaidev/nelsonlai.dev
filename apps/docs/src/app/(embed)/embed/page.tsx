const Page = async (props: PageProps<'/embed'>) => {
  const { searchParams } = props
  const { component } = await searchParams

  if (!component || typeof component !== 'string') {
    return <div>Error: Invalid component name</div>
  }

  try {
    const componentModule = await import(`@/components/demos/${component}`)
    const Component = componentModule.default

    return <Component />
  } catch (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }
}

export default Page
