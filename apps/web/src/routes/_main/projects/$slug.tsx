import { BlurImage } from '@repo/ui/components/blur-image'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { Mdx } from '@/components/mdx/mdx'
import { ProjectHeader } from '@/features/projects/project-header'
import { getProject } from '@/features/projects/projects.functions'
import { createJsonLdSoftwareSourceCode } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/projects/$slug')({
  loader: async ({ params }) => {
    const locale = getLocale()
    const project = await getProject({ data: { slug: params.slug, locale } })

    if (!project) throw notFound()

    return { project, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { project, locale } = loaderData
    const pathname = `/projects/${project.slug}` as const

    return createSeoHead({
      title: project.title,
      description: project.description,
      pathname,
      locale,
      jsonLd: createJsonLdSoftwareSourceCode({
        name: project.title,
        description: project.description,
        pathname,
        codeRepository: project.github,
        dateCreated: project.dateCreated,
        dateModified: project.updatedAt,
        slug: project.slug,
        locale,
      }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { project } = Route.useLoaderData()

  return (
    <div className='mx-auto max-w-3xl'>
      <ProjectHeader
        title={project.title}
        description={project.description}
        homepage={project.homepage}
        github={project.github}
      />
      <BlurImage
        src={`/images/projects/${project.slug}/cover.png`}
        width={1200}
        height={630}
        alt={project.title}
        className='my-12 rounded-lg'
        lazy={false}
      />
      <Mdx code={project.mdx} />
    </div>
  )
}
