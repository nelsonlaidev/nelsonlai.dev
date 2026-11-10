import type { ProjectSummary } from './types'

import { cn } from 'cn'

import {
  CoralArtwork,
  CubeArtwork,
  JournalArtwork,
  PagesArtwork,
  PearlArtwork,
  TerminalArtwork,
  ToolsArtwork,
} from './artworks'

const artworks = {
  pearl: PearlArtwork,
  cube: CubeArtwork,
  coral: CoralArtwork,
  terminal: TerminalArtwork,
  pages: PagesArtwork,
  tools: ToolsArtwork,
  journal: JournalArtwork,
} satisfies Record<ProjectSummary['artwork'], React.ComponentType<{ large: boolean }>>

type ProjectArtProps = {
  project: Pick<ProjectSummary, 'artwork'>
  featured?: boolean
  large?: boolean
}

export function ProjectArt(props: ProjectArtProps) {
  const { project, featured = false, large = false } = props
  const Artwork = artworks[project.artwork]

  return (
    <div
      aria-hidden='true'
      className={cn(
        'relative overflow-hidden border border-[#b2d7ca20] after:pointer-events-none after:absolute after:inset-0 after:content-[""] after:[background:linear-gradient(125deg,#d3edce10,transparent_60%)]',
        featured ? 'md:h-55 lg:h-67.5' : 'md:h-67.5 lg:h-57.5',
        !large && 'h-71.25 [background:radial-gradient(ellipse_at_50%_100%,#408c8e35,transparent_70%),#c0e0d505]',
        !large && !featured && 'xl:h-72.5',
        large &&
          'h-77.5 [background:radial-gradient(ellipse_at_50%_100%,#408c8e45,transparent_75%),#c0e0d505] xl:h-110',
      )}
    >
      <Artwork large={large} />
    </div>
  )
}
